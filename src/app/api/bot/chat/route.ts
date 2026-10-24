import { NextRequest, NextResponse } from "next/server";

interface SnippetInput {
  id: string;
  title: string;
  snippet: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    const snippets: SnippetInput[] = Array.isArray(body.snippets) ? body.snippets : [];

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.BACKBOARD_API_KEY;

    if (!apiKey || apiKey.trim() === "") {
      return NextResponse.json({
        reply: "⚠️ Backboard API key is not configured yet. To enable live responses from Google Gemma 2, please add your `BACKBOARD_API_KEY` in `.env.local` and restart the server.\n\nYour saved notes remain safely stored in your browser.",
        citations: snippets.map((s) => ({ id: s.id, title: s.title })),
        isConfigured: false,
      });
    }

    // Check if relevant snippets exist
    const citations = snippets.map((s) => ({
      id: s.id,
      title: s.title,
    }));

    // Build untrusted user notes context
    const formattedSnippets = snippets.length > 0
      ? snippets
          .map((s, i) => `[Source ${i + 1}: ${s.title}]\n${s.snippet}`)
          .join("\n\n---\n\n")
      : "No saved notes matched your search terms.";

    const systemPrompt = `You are NoteOcean Bot, an AI research assistant for the user's private notebook.
Answer the user's question directly, accurately, and concisely using ONLY the provided notes below.

CRITICAL INSTRUCTIONS:
1. Answer the question directly without opening filler phrases like "Based on your saved notes", "According to your notes", or "Found in your notes".
2. Only make factual claims that are directly supported by the provided notes.
3. If the answer cannot be found in the provided notes, reply exactly:
   "I couldn't find information about that in your saved notes."
   Do NOT invent, extrapolate, or hallucinate facts, dates, names, or addresses.
4. Format your response in clean Markdown (use **bold**, *italic*, lists, or inline code where helpful).
5. Keep your response concise and to the point.

<user_notes>
${formattedSnippets}
</user_notes>

User Question: ${query}`;

    // Call Backboard API using Google Gemma
    const provider = process.env.BACKBOARD_PROVIDER || "openrouter";
    const model = process.env.BACKBOARD_MODEL || "google/gemma-3-27b-it";
    const assistantId = process.env.BACKBOARD_ASSISTANT_ID || "a21131d6-4226-4705-a38a-9b50089f7ad5";

    let replyText = "";
    let isSuccess = false;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      // 1. Create a thread for the assistant
      const threadRes = await fetch(`https://app.backboard.io/api/assistants/${assistantId}/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({}),
        signal: controller.signal,
      });

      if (threadRes.ok) {
        const threadData = await threadRes.json();
        const threadId = threadData.thread_id;

        if (threadId) {
          // 2. Post message to the thread
          const msgRes = await fetch(`https://app.backboard.io/api/threads/${threadId}/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-API-Key": apiKey,
            },
            body: JSON.stringify({
              content: systemPrompt,
              llm_provider: provider,
              model_name: model,
              memory: "Off",
            }),
            signal: controller.signal,
          });

          if (msgRes.ok) {
            const msgData = await msgRes.json();
            const contentStr =
              msgData.content ||
              msgData.message?.content ||
              (Array.isArray(msgData.choices) ? msgData.choices[0]?.message?.content : null);

            if (contentStr && !contentStr.startsWith("LLM Error")) {
              replyText = contentStr.trim();
              isSuccess = true;
            }
          }
        }
      }

      clearTimeout(timeout);
    } catch (apiErr: any) {
      console.warn("Backboard fetch error / timeout:", apiErr.message);
    }

    // Grounded Fallback: If Backboard is unavailable or offline, answer strictly from retrieved snippets
    if (!isSuccess) {
      if (snippets.length === 0) {
        replyText = "I couldn't find information about that in your saved notes.";
      } else {
        const queryWords = query
          .toLowerCase()
          .replace(/[^\w\s]/g, " ")
          .split(/\s+/)
          .filter((w: string) => w.length > 2);
        
        const matchingLines: string[] = [];
        for (const s of snippets) {
          const lines = s.snippet.split("\n");
          for (const line of lines) {
            const cleanLine = line.trim();
            if (cleanLine.length > 5 && queryWords.some((w: string) => cleanLine.toLowerCase().includes(w))) {
              matchingLines.push(cleanLine);
            }
          }
        }

        if (matchingLines.length > 0) {
          replyText = matchingLines.slice(0, 3).join("\n\n");
        } else {
          replyText = "I couldn't find information about that in your saved notes.";
        }
      }
    }

    const isNegative =
      replyText.toLowerCase().includes("couldn't find") ||
      replyText.toLowerCase().includes("could not find") ||
      replyText.toLowerCase().includes("no information") ||
      snippets.length === 0;

    const validatedCitations = isNegative
      ? []
      : snippets.map((s) => ({ id: s.id, title: s.title }));

    return NextResponse.json({
      reply: replyText.trim(),
      citations: validatedCitations,
      isConfigured: true,
      modelUsed: `Gemma (${model}) via Backboard`,
    });
  } catch (err: any) {
    console.error("Error in /api/bot/chat route:", err);
    return NextResponse.json(
      {
        reply: `⚠️ An error occurred while processing your question: ${err.message}`,
        citations: [],
        isConfigured: true,
      },
      { status: 500 }
    );
  }
}
