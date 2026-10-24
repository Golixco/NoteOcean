# Readfirst.md — NoteOcean Master AI Handoff Document

> [!IMPORTANT]
> **MANDATORY FIRST STEP FOR ANY AI AGENT**:
> Read this document completely BEFORE inspecting other files, writing any code, or modifying the application.
> This document contains the definitive context, architecture, visual specifications, reverse-engineered mechanics, and execution plan for **NoteOcean**. You do not need prior conversational history—everything you need to build NoteOcean is here.

---

## 1. Project Overview & Hackathon Alignment

### Product Identity
- **Project Name**: NoteOcean
- **Product Vision**: A modern, fast, keyboard-first note-taking application inspired by the fluid editing interactions and clean organization of Notion, enhanced with immediate Markdown transformations, an interactive slash-command palette, real-time title search, and a floating AI assistant (**NoteOcean Bot**) grounded in the user's personal notes.
- **Problem Solved**: Most note applications force an unnecessary trade-off between crude plain-text Markdown editors and bloated, slow workspace platforms requiring logins and team setup. NoteOcean gives students, developers, and writers a clean, distraction-free desktop-class editor that works **immediately** upon opening.
- **Current Project Status**: **Preparation & Planning Phase Only**. The project architecture, visual design tokens, and technical specifications are prepared. The application has **not** yet been implemented, tested end-to-end, deployed, or submitted.

### Event & Challenge Alignment
- **Event**: **Hacktoberfest Hack Day Ahmedabad x Open Source Weekend** (October 24, 2026).
  - Official Event Page: [https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend](https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend)
  - Official Challenge Page: [https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend/challenges/01a0d987-0c41-12ea-13ac-5b85755dc2f3](https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend/challenges/01a0d987-0c41-12ea-13ac-5b85755dc2f3)
- **Official Prize Categories for This Event**:
  1. **Primary Target**: **Best Open-Source AI Project, supported by DigitalOcean**
     - DigitalOcean is the official sponsor/supporter of this category and our preferred deployment target, subject to actual memory requirements, credit eligibility, and user cost approval.
     - NoteOcean qualifies as an original open-source application with an open-weight AI model at its core.
  2. **Potential Additional Target**: **Best Use of Gemma 4**
     - This is a potential additional category **only if** a verified Gemma 4 model is officially integrated and proven functional during implementation.
     - Gemma 2 (`gemma-2-9b-it`) is our verified baseline open-weight model for the general category; **Gemma 2 must never be claimed or misrepresented as Gemma 4**.
  - *Note on Category Clarity*: Best Use of DigitalOcean and Best Use of Backboard are not confirmed standalone prize categories for this specific Ahmedabad event. Prize eligibility and submissions have not been confirmed and will be formally verified during event check-in.

---

## 2. Strict Product Scope & Non-Negotiable Constraints

### Non-Negotiable Architectural Rules
1. **ABSOLUTELY NO LOGIN / NO USER ACCOUNTS**:
   - Zero registration, zero login/logout, zero OAuth, zero password reset, zero JWTs/cookies, zero auth middleware.
   - The user opens the app and starts taking notes immediately.
2. **ZERO SEPARATE DATABASE / BROWSER-LOCAL PERSISTENCE**:
   - No PostgreSQL, no SQLite, no Drizzle/Prisma ORMs, no Redis, no cloud database.
   - All notes and titles are stored directly in **browser `localStorage`**.
   - Notes survive page reloads and browser restarts within the same browser profile.
   - A clear disclaimer is visible: *"Notes are saved locally in your browser."*
3. **ONE UNIFIED APPLICATION CONTAINER**:
   - Built on **Next.js 15 (App Router, TypeScript)** + **Tailwind CSS**.
   - Serves the frontend UI and exactly **one** server-side API route: `POST /api/bot/chat`.
4. **CREDENTIAL PRIVACY**:
   - AI API keys (`BACKBOARD_API_KEY` or alternate) exist strictly on the server in `.env.local` and App Platform environment variables.
   - The frontend client never touches or bundles any secret key.
5. **PRE-LOADED DEMO NOTES**:
   - A fresh session with empty storage automatically seeds 5 realistic, fictional sample notes (`Questions & doubts`, `Hackathon plan`, `Meeting notes`, `Project ideas`, `Reading list`) so judges can immediately test editing, search, and the AI bot.

---

## 3. Authoritative UI Reference & Visual Design System

The verified visual reference image is located at:
[`/home/vuld0/NoteOcean/doc/reference/NoteOcean-ui-reference.png`](file:///home/vuld0/NoteOcean/doc/reference/NoteOcean-ui-reference.png)

> [!NOTE]
> Detailed measurements, spacing, and CSS token mappings are documented in [`docs/06-ui-reference-and-design-system.md`](file:///home/vuld0/NoteOcean/docs/06-ui-reference-and-design-system.md). Always match the screenshot.

### Visual Breakdown from Reference:
- **Theme**: Deep obsidian / dark mode.
  - Background Canvas: `#0d1117` or `#101418`.
  - Sidebar Background: `#0f141c` with subtle right border `1px solid rgba(255, 255, 255, 0.07)`.
  - Accent Color: Aquamarine / Vibrant Teal (`#2dd4bf` / `#14b8a6` / `#00e5bf`).
- **Sidebar Structure (Width ~250px)**:
  - Header: NoteOcean Wave Sparkle logo + bold white text `"NoteOcean"` + collapse icon `|<`.
  - Search Input: Pill container with magnifying glass icon, placeholder `"Search your pages"`, and `"Ctrl K"` badge.
  - Section 1: `"WORKSPACE"`:
    - `Home` (house icon)
    - `Quick notes` (document icon)
    - `Favorites` (star icon)
  - Section 2: `"YOUR PAGES"` with a `+` (Create Page) button on the right:
    - Lists page titles (`Hackathon plan`, `Meeting notes`, `Project ideas`, `Reading list`, `Questions & doubts`).
    - Active Page Indicator: Rounded card container with teal highlight/border (`#162a2d`, border `1px solid #14b8a6`), active icon in teal.
  - Footer Profile Bar:
    - Avatar circle + username `"Golixco"` + chevron + settings gear icon on far right.
- **Top Header Bar**:
  - Breadcrumbs: File icon in cyan + `"NoteOcean"` / `"{Page Title}"`.
  - Right Controls: Star icon, Share button, Three dots `...`.
- **Editor Canvas Area**:
  - Page Title: Large bold heading (~36-40px font size), white, seamless borderless editing.
  - Gutter Handles: Hovering over blocks reveals a `+` button and a 6-dot drag handle `:::`.
  - Block Types: Paragraphs, Bullet lists (`• `), Headings (`H1`, `H2`), Quotes, Dividers.
  - Highlight Badge: Inline pill badge styling (e.g., `"as you write."` styled in dark teal background `#153e44`, text `#2dd4bf`, rounded corners).
- **Floating Slash Menu**:
  - Popover positioned below `/code` with rounded dark container (`#151c24`, border `1px solid rgba(255, 255, 255, 0.1)`, rounded `10px`).
  - Search query header: `Q /code`.
  - Active Item: `< / > Code block` with cyan box icon and Enter symbol `↵` on the right (`background: #16383a`, border `1px solid #14b8a6`).
  - Items list: `H1 Heading 1`, `::= Bulleted list`, `☑ To-do list`, `” Quote`.
- **Bottom Status Indicator**:
  - Centered at viewport bottom: Checkmark in circle + text: `All changes saved` (`#8e9fac` text, teal checkmark).
- **Floating NoteOcean AI Bot (Bottom-Right)**:
  - Position: `fixed; bottom: 24px; right: 24px;`.
  - Button: Circular button with aquamarine glowing ring (`box-shadow: 0 0 20px rgba(45, 212, 191, 0.4)`), Wave logo inside.
  - Tooltip Badge: Pinned above the button: `"Ask NoteOcean AI"`.
  - Drawer on click: Slide-up chat panel with grounded Q&A and source citations.

---

## 4. Reverse-Engineered Editor Mechanics (Notion Behavioral Findings)

These behaviors were verified via REA Chrome DevTools Protocol inspection of Notion (details in [`docs/02-notion-behavior-findings.md`](file:///home/vuld0/NoteOcean/docs/02-notion-behavior-findings.md) and [`docs/05-editor-interaction-spec.md`](file:///home/vuld0/NoteOcean/docs/05-editor-interaction-spec.md)):

1. **Title to Body Transition**:
   - The Page Title is an editable header. Pressing `Enter` while in the title transitions focus directly to the first paragraph block in the document body.
2. **Real-Time Markdown Input Rules**:
   - `# ` -> Heading 1 | `## ` -> Heading 2 | `### ` -> Heading 3
   - `- ` or `* ` -> Bullet list | `1. ` -> Numbered list
   - `> ` -> Blockquote | `---` -> Horizontal rule `<hr>`
   - `**bold**`, `*italic*`, `` `code` `` -> Inline formatted marks
   - *CRITICAL RULE*: Trailing space is required (`# `). Typing `#` alone must NEVER transform the block. Markers are consumed atomically upon transformation.
   - Undo with `Ctrl+Z` reverts the transformation back to the typed markers.
3. **Slash Command Execution**:
   - Typing `/` opens the floating menu.
   - Typing `/code` filters to Code Block.
   - `ArrowDown` / `ArrowUp` cycles highlighted item.
   - `Enter` executes command, deletes typed `/query`, and inserts the block.
   - `Escape` dismisses menu without modifying text.
4. **Code Block Mechanics**:
   - Monospace font (`ui-monospace`, `Fira Code`, or `Courier New`), dark background container.
   - Inside code block: `Tab` inserts 2 spaces without losing focus.
   - `Enter` creates a line break inside code block.
   - Markdown input rules and `/` slash menus are suppressed inside code blocks.
5. **Autosave to `localStorage`**:
   - Debounced save (~500ms) after typing stops.
   - Status updates: `Saving...` -> `All changes saved`.

---

## 5. Simplified Technical Architecture

```mermaid
graph TD
    subgraph Client Browser (Next.js Client Components)
        UI[Workspace UI Shell]
        Editor[Tiptap v2 Editor]
        Slash[Floating Slash Menu]
        Store[(Browser localStorage: 'noteocean_pages')]
        Search[Client Title Search Filter]
        Retriever[Client Note Relevance Matcher]
        BotUI[Floating NoteOcean Bot Drawer]
        STT[Web Speech API Dictation Hook]
    end

    subgraph Server (Next.js Dynamic Web Service)
        APIBot["POST /api/bot/chat"]
        AIProxy[AI Provider Proxy Client]
    end

    subgraph External Open-Weight AI
        AIModel["Open-Weight LLM (Gemma 2 baseline; Gemma 4 if verified)"]
    end

    UI --> Store
    Editor --> Store
    Search --> Store
    Retriever --> Store
    BotUI --> Retriever
    Retriever -->|Query + Top 3-5 Note Snippets| APIBot
    APIBot --> AIProxy
    AIProxy -->|Server-Side API Key| AIModel
    AIModel --> AIProxy
    AIProxy -->|Grounded Reply + Citations| APIBot
    APIBot --> BotUI
    STT --> Editor
```

### Data Model in `localStorage`
Key: `noteocean_pages`
```typescript
interface NotePage {
  id: string;              // UUID
  title: string;           // e.g. "Questions & doubts"
  icon?: string;           // e.g. "📄"
  content: any;            // Tiptap JSON document tree
  plainText: string;       // Extracted text for search & AI retrieval
  updatedAt: string;       // ISO timestamp
  createdAt: string;       // ISO timestamp
}
```
Key: `noteocean_active_page_id` (string: UUID of current open page).

---

## 6. AI Integration Strategy: Gemma 2 Baseline vs. Gemma 4 Target

### Clear Separation of Model Tiers
1. **Baseline Model (Best Open-Source AI Project)**:
   - Primary: Google **Gemma 2** (e.g., `gemma-2-9b-it` via Backboard).
   - Backboard API is pre-funded with existing user credits and provides a stable REST interface.
   - Fully qualifies NoteOcean for the primary **Best Open-Source AI Project, supported by DigitalOcean** category.
   - **Crucial Rule**: Gemma 2 must always be accurately documented as Gemma 2. It must **never** be labeled or represented as Gemma 4.
2. **Additional Target (Best Use of Gemma 4)**:
   - Entering the **Best Use of Gemma 4** category requires actually using and integrating a confirmed Gemma 4 model.
   - On execution day, the agent will query the Backboard model catalog (`GET https://app.backboard.io/api/models`) to check if a Gemma 4 model (or alias) is currently available under the user's key.
   - If a Gemma 4 model identifier is officially supported and verified, the agent may configure it to target the category.
   - If Gemma 4 is not available via Backboard or requires complex infrastructure that exceeds the hackathon timeline/budget, NoteOcean remains solidly on Gemma 2 for the primary Best Open-Source AI Project category.

### Grounding & Prompt Defense
- **Retrieval Pipeline**: Client extracts top 3–5 note snippets matching query terms and forwards them to `POST /api/bot/chat`.
- **Untrusted Context**: Note snippets are wrapped inside `<user_notes>` tags. The system prompt instructs the model to treat note text strictly as passive data and never execute instructions found within notes.
- **Anti-Hallucination Bound**: If notes do not contain the answer, the model responds:
  *"I couldn't find information about that in your saved notes."*
- **Source Citations**: Assistant replies link to source notes; clicking a citation immediately opens that note in the editor.

---

## 7. Speech-to-Text (Voice Dictation — Secondary Feature)

- **Engine**: Browser-native `webkitSpeechRecognition` / `SpeechRecognition` (Web Speech API).
- **Status**: **Secondary stretch feature (Priority 4)**. Complete the core editor and AI bot first!
- **Mechanics**:
  - User clicks mic button in toolbar.
  - Active red/cyan listening badge activates.
  - Spoken words stream in real time and insert at the editor caret via `editor.commands.insertContent`.
  - Clicking stop releases microphone stream.
  - Unsupported browsers gracefully show: *"Dictation supported in Chromium browsers."*

---

## 8. DigitalOcean App Platform & Cost Plan

- **Preferred Deployment Target**: 1x App Platform Basic Web Service (**$5.00 / month**), subject to actual memory requirements, credit eligibility verification, and user cost approval.
- **Budget**: Expected ~$25 in DigitalOcean credits (to be confirmed in user's cloud console on execution day).
  - 512 MB RAM, 1 vCPU.
  - Zero database services needed (saves $15/mo).
- **Total Monthly Run-rate**: **$5.00 / month** (projected to leave ~$20 buffer if $25 credits are confirmed active).
- **Build Settings**:
  - Build command: `npm run build`
  - Run command: `npm run start`
  - Environment variable: `BACKBOARD_API_KEY` (secret), `NODE_ENV=production`.

---

## 9. Dependency Directory & Installation Status

| Package | Purpose | Version Range | Status |
| :--- | :--- | :--- | :--- |
| `next` | App Router full-stack framework | `^15.0.0` | **Proposed** (install tomorrow) |
| `react` & `react-dom` | UI component library | `^19.0.0` or `^18.3.0` | **Proposed** |
| `typescript` | Static type checking | `^5.0.0` | **Proposed** |
| `tailwindcss` | Utility styling matching reference | `^3.4.0` | **Proposed** |
| `@tiptap/react` | Rich text editor component | `^2.10.0` | **Proposed** |
| `@tiptap/starter-kit` | Core ProseMirror nodes & marks | `^2.10.0` | **Proposed** |
| `@tiptap/extension-placeholder` | Floating placeholder text | `^2.10.0` | **Proposed** |
| `@tiptap/extension-code-block-lowlight` | Syntax-highlighted code block | `^2.10.0` | **Proposed** |
| `lowlight` | Syntax highlighter engine | `^3.1.0` | **Proposed** |
| `lucide-react` | Icons matching the UI reference | `^0.450.0` | **Proposed** |

> [!CAUTION]
> No dependencies are installed inside NoteOcean tonight. Tomorrow's agent will install them during Phase 0 bootstrap.

---

## 10. Step-by-Step Implementation Roadmap (Tomorrow)

- **Priority 0 (Foundation)**: Scaffold Next.js 15, configure Tailwind matching the reference palette, create base layout with sidebar and main canvas. Seed initial demo notes into `localStorage`.
- **Priority 1 (Core Editor)**: Mount Tiptap editor. Implement Page Title with `Enter` transition. Add Markdown rules (`# `, `## `, `### `, `- `, `1. `, `>`, `---`). Build floating Slash Command Menu (`/code`, `H1`, `Bulleted list`, `To-do list`, `Quote`). Add debounced autosave to `localStorage`.
- **Priority 2 (Workspace & Search)**: Complete sidebar page list, `+` create page button, active page styling (teal card), page deletion, and real-time title search (`Ctrl+K`).
- **Priority 3 (NoteOcean AI Bot)**: Build floating glowing bot button and slide-up drawer. Implement client-side note retrieval. Create `/api/bot/chat` calling open-weight Gemma model. Verify grounded answers and citations.
- **Priority 4 (Speech-to-Text — Stretch)**: Add mic button with Web Speech API dictation into editor caret if time permits.
- **Priority 5 (Deploy & Demo)**: Verify build, deploy to DigitalOcean App Platform, execute acceptance checklist (TC-01 to TC-12), rehearse 3-minute demo pitch.

---

## 11. Documentation File Index

All detailed specifications are in [`NoteOcean/docs/`](file:///home/vuld0/NoteOcean/docs/):
- [`00-project-brief.md`](file:///home/vuld0/NoteOcean/docs/00-project-brief.md): Vision, verified prize categories, and scope.
- [`01-research-methodology.md`](file:///home/vuld0/NoteOcean/docs/01-research-methodology.md): REA setup, CDP evidence capture, and 4 classification standards.
- [`02-notion-behavior-findings.md`](file:///home/vuld0/NoteOcean/docs/02-notion-behavior-findings.md): Evidence ledger of Notion editor mechanics.
- [`03-page-search-findings.md`](file:///home/vuld0/NoteOcean/docs/03-page-search-findings.md): Real-time title search and client-side retrieval design.
- [`04-product-requirements.md`](file:///home/vuld0/NoteOcean/docs/04-product-requirements.md): User stories and acceptance criteria.
- [`05-editor-interaction-spec.md`](file:///home/vuld0/NoteOcean/docs/05-editor-interaction-spec.md): Tiptap input rules and slash menu spec.
- [`06-ui-reference-and-design-system.md`](file:///home/vuld0/NoteOcean/docs/06-ui-reference-and-design-system.md): Authoritative visual design tokens from the screenshot.
- [`07-technical-architecture.md`](file:///home/vuld0/NoteOcean/docs/07-technical-architecture.md): Architecture diagram, data flow, and TDRs.
- [`08-data-model-and-api-contracts.md`](file:///home/vuld0/NoteOcean/docs/08-data-model-and-api-contracts.md): `localStorage` schema and `POST /api/bot/chat` contract.
- [`09-gemma-backboard-ai-design.md`](file:///home/vuld0/NoteOcean/docs/09-gemma-backboard-ai-design.md): Gemma 2 / Gemma 4 analysis, Backboard integration, and grounding.
- [`10-speech-to-text-design.md`](file:///home/vuld0/NoteOcean/docs/10-speech-to-text-design.md): Web Speech API dictation specification (secondary stretch).
- [`11-digitalocean-deployment-and-cost-plan.md`](file:///home/vuld0/NoteOcean/docs/11-digitalocean-deployment-and-cost-plan.md): App Platform deployment guide and $5/mo cost plan.
- [`12-security-privacy-and-reliability.md`](file:///home/vuld0/NoteOcean/docs/12-security-privacy-and-reliability.md): Security, secrets, and public endpoint safeguards.
- [`13-testing-and-acceptance-checklist.md`](file:///home/vuld0/NoteOcean/docs/13-testing-and-acceptance-checklist.md): 12 end-to-end acceptance test cases.
- [`14-hackathon-execution-plan.md`](file:///home/vuld0/NoteOcean/docs/14-hackathon-execution-plan.md): 8-hour execution timeline.
- [`15-execution-day-prompt.md`](file:///home/vuld0/NoteOcean/docs/15-execution-day-prompt.md): Copy-paste prompt for tomorrow morning.

---

## 12. Instructions for the Future AI Coding Agent
1. **Do not deviate from the zero-login, browser-storage architecture**. Do not introduce databases, ORMs, or auth servers.
2. **Recreate the UI reference accurately**. Match colors, font sizes, badges, icons, and layout in [`doc/reference/NoteOcean-ui-reference.png`](file:///home/vuld0/NoteOcean/doc/reference/NoteOcean-ui-reference.png).
3. **Be completely honest about Gemma version and eligibility**: Gemma 2 is our baseline for the general Best Open-Source AI Project category. Only enter Best Use of Gemma 4 if Gemma 4 is genuinely verified.
4. **Build end-to-end functional features**, not static mockups.
5. **Follow the priority order**: Editor + Markdown + Slash + Local Persistence first, AI Bot second, Dictation third, Deployment last.
