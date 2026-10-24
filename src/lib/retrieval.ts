import { NotePage, SearchMatch } from "@/types/note";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
  "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
  "but", "by", "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does",
  "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had",
  "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her",
  "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd",
  "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself",
  "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off",
  "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over",
  "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
  "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
  "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've",
  "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
  "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when",
  "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's",
  "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
  "yours", "yourself", "yourselves"
]);

/**
 * Extract clean search terms from a query string, filtering out stop words.
 */
export function extractQueryTerms(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2 && !STOP_WORDS.has(term));
}

/**
 * Extract a relevant ~400-char snippet centered around matching query terms.
 */
export function extractSnippet(text: string, terms: string[], maxLen = 400): string {
  if (!text || text.trim().length === 0) return "";
  const lowerText = text.toLowerCase();
  
  // Find the earliest match index
  let earliestIdx = -1;
  for (const term of terms) {
    const idx = lowerText.indexOf(term);
    if (idx !== -1 && (earliestIdx === -1 || idx < earliestIdx)) {
      earliestIdx = idx;
    }
  }

  if (earliestIdx === -1) {
    // If no term match in body (e.g. matched in title), return beginning of note
    return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
  }

  // Center the window around earliest match
  const start = Math.max(0, earliestIdx - 80);
  const end = Math.min(text.length, start + maxLen);
  let snippet = text.slice(start, end).trim();

  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  return snippet;
}

/**
 * Client-side retrieval scoring algorithm.
 * Matches user query against note titles (+10 pts) and note bodies (+2 pts).
 * Returns ranked notes and formatted snippets.
 */
export function retrieveRelevantNotes(
  notes: NotePage[],
  query: string,
  activePageId?: string
): Array<{ id: string; title: string; snippet: string; score: number }> {
  const terms = extractQueryTerms(query);
  
  if (terms.length === 0) {
    // If query has no substantive terms (e.g., "hello" or empty), fallback to active note if available
    const activeNote = notes.find((n) => n.id === activePageId);
    if (activeNote) {
      return [
        {
          id: activeNote.id,
          title: activeNote.title,
          snippet: extractSnippet(activeNote.plainText, [], 400),
          score: 1,
        },
      ];
    }
    return [];
  }

  const scored: Array<{ id: string; title: string; snippet: string; score: number }> = [];

  for (const note of notes) {
    let score = 0;
    const lowerTitle = (note.title || "").toLowerCase();
    const lowerBody = (note.plainText || "").toLowerCase();

    for (const term of terms) {
      if (lowerTitle.includes(term)) {
        score += 10;
      }
      // Count body occurrences up to a cap
      const bodyMatches = (lowerBody.match(new RegExp(term, "g")) || []).length;
      if (bodyMatches > 0) {
        score += Math.min(bodyMatches * 2, 20);
      }
    }

    if (score > 0) {
      scored.push({
        id: note.id,
        title: note.title,
        snippet: extractSnippet(note.plainText, terms, 450),
        score,
      });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Take top 3 most relevant notes with positive score
  if (scored.length > 0) {
    return scored.slice(0, 3);
  }

  // Only fallback to active note if user explicitly asks about current page/summary
  const isCurrentPageQuery = /\b(this page|this note|current page|current note|summarize|summary)\b/i.test(query);
  if (isCurrentPageQuery) {
    const activeNote = notes.find((n) => n.id === activePageId);
    if (activeNote && activeNote.plainText.trim()) {
      return [
        {
          id: activeNote.id,
          title: activeNote.title,
          snippet: extractSnippet(activeNote.plainText, [], 400),
          score: 1,
        },
      ];
    }
  }

  // If no note matches query terms, return empty array (do NOT pollute context with unrelated notes)
  return [];
}
