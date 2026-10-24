# Technical Architecture & Decision Records (Simplified MVP)

## 1. System Architecture Overview

To guarantee delivery of a reliable, high-performance working application within the one-day hackathon window, **NoteOcean adopts a lean, single-container architecture**. 

There is **zero database infrastructure**, **no user login**, and **no separate backend microservice**. Page persistence and search are managed entirely in the client's browser, while a single Next.js server route handles the server-side proxy to the Backboard Gemma AI model.

```mermaid
graph TD
    subgraph Client Browser (Next.js Client Components)
        UI[Workspace UI Shell]
        Editor[Tiptap v2 ProseMirror Editor]
        Slash[Floating Slash Menu]
        Store[(Browser localStorage: 'noteocean_pages')]
        TitleSearch[Client-Side Title Search Filter]
        NoteRetriever[Client-Side Relevance Matcher]
        BotUI[Floating NoteOcean Bot Drawer]
        STT[Web Speech API Dictation Hook]
    end

    subgraph Server (Next.js Dynamic Web Service)
        APIBot["POST /api/bot/chat"]
        BackboardProxy[Backboard API Client: Fetch Proxy]
    end

    subgraph External AI Provider
        Backboard[Backboard API: Gemma 2 Model]
    end

    UI --> Store
    Editor --> Store
    TitleSearch --> Store
    NoteRetriever --> Store
    BotUI --> NoteRetriever
    NoteRetriever -->|Query + Top 3 Matching Note Snippets| APIBot
    APIBot --> BackboardProxy
    BackboardProxy -->|X-API-Key (Server Only)| Backboard
    Backboard --> BackboardProxy
    BackboardProxy -->|Grounded Reply + Citations| APIBot
    APIBot --> BotUI
    STT --> Editor
```

---

## 2. Subsystem Responsibilities

### A. Client-Side Workspace & Persistence
- **Storage Engine**: `window.localStorage`.
  - Keys: `noteocean_pages` (serialized JSON array of all notes) and `noteocean_active_page_id` (string).
  - Persistence: Debounced autosave (~500ms) after every keystroke. Changes survive page reloads and browser restarts within the same browser profile.
- **Editor Engine**: **Tiptap v2** (headless ProseMirror).
  - Encapsulates rich-text document state, Markdown input rules, floating slash palette, and code block formatting.
- **Search & Retrieval**:
  - Title Search: Instant in-memory substring filtering on `page.title` as the user types in the sidebar (`Ctrl+K`).
  - Note Retrieval: Fast keyword matching over `page.plainText` and `page.title` when formulating questions for NoteOcean Bot.

### B. Server-Side AI API Route (`/api/bot/chat`)
- Exactly one route handler: `POST /api/bot/chat`.
- Responsibilities:
  1. Validate incoming JSON payload (`query` and `notesContext`).
  2. Enforce prompt length and token limits.
  3. Construct a strictly grounded system prompt using `<user_notes>` delimiter tags.
  4. Call the Backboard API (`https://app.backboard.io/api/threads/messages`) using the server-side environment variable `BACKBOARD_API_KEY`.
  5. Return the assistant's reply and matching page citations to the client.

### C. Deployment Target (DigitalOcean App Platform)
- Deployed as a single **Basic Web Service ($5.00 / month)** on DigitalOcean App Platform.
- No database service, no redis, no separate worker containers.

---

## 3. Technology Decision Records (TDRs)

### TDR-01: Architecture Simplification — LocalStorage vs. PostgreSQL
- **Decision**: Use browser `localStorage` for note storage; defer PostgreSQL to post-hackathon.
- **Alternative Considered**: DigitalOcean Managed PostgreSQL + Drizzle ORM.
- **Main Benefit**: Eliminates database provisioning, schema migrations, network latency, connection pooling bugs, and $15/month database costs.
- **Main Drawback**: Notes do not sync across different browser profiles or devices.
- **Time Saved**: ~2 hours of database configuration and debugging.
- **Cost Impact**: Saves $15/mo (reduces total deployment cost from $20 to $5).
- **Justification**: A hackathon judge tests an application on a single device during a 3-minute evaluation. Fast, 0ms local persistence is more resilient than an external cloud database.

---

### TDR-02: User Authentication — Zero Login vs. User Accounts
- **Decision**: Zero login or registration. App opens directly into the note workspace.
- **Alternative Considered**: NextAuth / Auth0 / Clerk / custom JWT sessions.
- **Main Benefit**: Instant onboarding. Judges and users can immediately write notes, test shortcuts, and query the bot without filling out registration forms.
- **Main Drawback**: No multi-tenant data separation on shared physical machines.
- **Time Saved**: ~2 hours of auth UI, tokens, and middleware.
- **Justification**: For a personal desktop-like note tool, mandatory login adds friction with zero demo value.

---

### TDR-03: Editor Engine — Tiptap v2 (ProseMirror)
- **Decision**: Tiptap v2 headless editor with StarterKit.
- **Alternative Considered**: Lexical, Slate, raw HTML contenteditable.
- **Main Benefit**: Built-in Markdown input rules (`# `, `## `, `### `, `- `, `1. `, `> `, `---`), first-class code block extensions, and active React ecosystem.
- **Time to Implement**: 1.5 hours.
- **Cost**: $0 (Open Source, MIT).

---

### TDR-04: AI Model & Provider — Gemma 2 Baseline via Backboard (Gemma 4 Conditional)
- **Decision**: Backboard API invoking Google Gemma 2 (`gemma-2-9b-it`) as the verified baseline open-weight model.
- **Category Alignment**: Fulfills the requirements for the primary category: **Best Open-Source AI Project, supported by DigitalOcean**.
- **Model Accuracy**: `gemma-2-9b-it` is explicitly identified as Gemma 2, never misrepresented as Gemma 4.
- **Gemma 4 Policy**: On execution day, the developer/agent checks if an authentic Gemma 4 model is available via Backboard (`GET /api/models`). If verified, it may be targeted for the **Best Use of Gemma 4** category; otherwise, the stable Gemma 2 baseline is retained without introducing unwarranted architecture complexity.
- **Security**: The API key (`BACKBOARD_API_KEY`) is stored strictly in server-side environment variables (`.env.local` locally and App Platform encrypted variables in production).
- **Cost**: Covered by existing pre-funded Backboard user credits ($0 incremental cost).

---

### TDR-05: Cloud Hosting — Single App Platform Web Service
- **Decision**: DigitalOcean App Platform Basic Web Service ($5.00/mo) as the preferred deployment target, subject to runtime memory requirements, credit eligibility, and user cost approval.
- **Alternative Considered**: DigitalOcean Droplet, Kubernetes (DOKS), local demo only.
- **Main Benefit**: Push-to-deploy from GitHub, automatic SSL, zero server maintenance, projected to fit comfortably within the expected $25 credit budget with a $20 buffer.
- **Cost**: $5.00/month.
