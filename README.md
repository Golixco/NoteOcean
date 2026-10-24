# NoteOcean 🌊

> A modern, fast, AI-powered personal workspace inspired by Notion, featuring instant Markdown transformations, slash commands, real-time title search, browser-local persistence, and an AI assistant strictly grounded in your personal notes.

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Tiptap](https://img.shields.io/badge/Tiptap-v2-2563eb.svg)](https://tiptap.dev/)
[![Model](https://img.shields.io/badge/Open--Weight_AI-Gemma_2_(9B)-00e5bf.svg)](https://ai.google.dev/gemma)

---

## 🌊 Overview & Product Vision

**NoteOcean** is built for software engineers, students, and writers who want the rapid, keyboard-first velocity of Markdown coupled with rich block layouts, instant title search, and an AI assistant that answers questions grounded directly in their personal notes.

Most note-taking applications force an unnecessary choice:
1. Bare-bones plain text editors that lack rich structure and visual organization.
2. Bloated, sluggish cloud platforms requiring mandatory account creation, team onboarding, and subscription plans before typing a single note.

**NoteOcean eliminates this friction**:
- **Zero-Login Instant Onboarding**: Open the app and start writing immediately. No signup, no passwords, no OAuth.
- **Immediate Markdown Transformations**: Typing `# `, `## `, `### `, `- `, `1. `, `>`, and `---` immediately transforms blocks on the fly with atomic undo support.
- **Interactive Slash Commands**: Typing `/` opens an accessible, searchable palette anchored at the cursor (`/code`, `H1`, `Bulleted list`, `To-do list`, `Quote`, `Divider`).
- **Real Editable Code Blocks**: Dedicated syntax-styled monospace code blocks with Tab indentation handling and newline isolation.
- **Resilient Local Persistence**: Debounced autosave syncing to browser `localStorage`. Notes survive reloads and browser restarts with zero cloud database dependencies.
- **Real-Time Title Search (`Ctrl+K`)**: Instant client-side search filtering across notes.
- **NoteOcean Bot (Google Gemma 2 via Backboard)**: A floating AI assistant that performs client-side retrieval across your notes and uses the open-weight Google Gemma 2 model to answer questions with verifiable source page citations.
- **Privacy First**: Notes remain in your browser's local storage. Only query-relevant snippets are transmitted to the server-side AI endpoint when you submit a question to the assistant.

---

## 🏆 Hackathon Alignment & Target Prize

- **Event**: **Hacktoberfest Hack Day Ahmedabad x Open Source Weekend** (October 24, 2026)
  - [Official Event Page](https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend)
  - [Official Challenge Page](https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend/challenges/01a0d987-0c41-12ea-13ac-5b85755dc2f3)
- **Primary Target Category**: **Best Open-Source AI Project, supported by DigitalOcean**
  - NoteOcean is an original open-source software project licensed under the permissive MIT license.
  - Powered by a genuine open-weight model: **Google Gemma 2 (`gemma-2-9b-it`)**.
  - Hosted on **DigitalOcean App Platform** as a lightweight, single-container web service without database overhead.
- **Potential Additional Track**: **Best Use of Gemma 4** (Subject to verified catalog availability on execution day; baseline remains Gemma 2 without misrepresentation).

---

## 🎨 UI & Design System

The visual design is grounded in the authoritative reference screenshot ([`doc/reference/NoteOcean-ui-reference.png`](doc/reference/NoteOcean-ui-reference.png)):
- **Color Palette**: Obsidian background (`#0d1117`), slate sidebar (`#0f141c`), vibrant aquamarine/cyan accent (`#2dd4bf` / `#14b8a6`), active card teal (`#162a2d`).
- **Sidebar**: 250px navigation with NoteOcean wave logo, `Ctrl+K` search bar, Workspace navigation (`Home`, `Quick notes`, `Favorites`), and `YOUR PAGES` list with instant `+` creation.
- **Editor Canvas**: Spacious 780px centered column with seamless 36px bold page title, hover gutter controls (`+`, `:::`), and live Markdown parsing.
- **Slash Palette**: Floating menu positioned near the caret with arrow-key navigation and Enter execution.
- **Save Status**: Bottom-centered indicator (`✓ All changes saved`).
- **Floating AI Assistant**: Glowing circular cyan trigger button (`Ask NoteOcean AI`) in the bottom-right corner opening a grounded chat drawer.

---

## 🧠 AI Architecture: Grounded Note Assistant

### Why Gemma 2?
NoteOcean utilizes **Google Gemma 2 (`gemma-2-9b-it`)**, a state-of-the-art open-weight model released under the open Gemma Terms of Use. Running Gemma 2 via the Backboard API provides high-fidelity reasoning, compact parameter efficiency, and dependable adherence to grounding instructions within an open-source footprint.

### Retrieval Pipeline & Grounding Flow
1. **User Query**: User opens NoteOcean Bot and asks a question (e.g., *"What is the deadline recorded in my hackathon plan?"*).
2. **Client-Side Keyword Matching**: The client ranks saved notes from `localStorage` using title matches (+10 pts) and body matches (+2 pts).
3. **Context Selection**: The top 3–5 matching snippets (or the active page if no match) are extracted.
4. **Server-Side Proxy (`POST /api/bot/chat`)**: Snippets and question are sent to the Next.js API route. Secrets (`BACKBOARD_API_KEY`) remain strictly on the server.
5. **Untrusted Data Defense**: Notes are wrapped in `<user_notes>` tags with system instructions to treat them strictly as passive data, mitigating prompt injection.
6. **Anti-Hallucination Fallback**: If the notes do not contain the answer, the model responds: *"I couldn't find information about that in your saved notes."*
7. **Clickable Citations**: Responses include cited note badges. Clicking a source citation switches the editor directly to that note.

---

## 🔒 Security & Privacy Boundaries

- **Browser-Local Data**: All note contents, titles, and IDs are stored in browser `localStorage`. No server database exists.
- **No Credentials in Frontend**: `BACKBOARD_API_KEY` is loaded exclusively by the Next.js backend server from `.env.local` or platform environment variables. It is never exposed in client bundles.
- **Graceful Degradation**: The app functions as a complete, high-speed note editor even when no AI key is configured.
- **Privacy Notice**: Only selected note excerpts matching the user's specific question are transmitted to the AI inference endpoint during active chat inquiries.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18.x, 20.x, or 24.x
- npm 9+ or 11+

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Golixco/NoteOcean.git
   cd NoteOcean
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Backboard API key:
   ```env
   BACKBOARD_API_KEY=your_backboard_api_key_here
   ```
   *(Note: The editor works completely without an API key; configuring it enables live Gemma AI chat).*

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Acceptance Testing Matrix

| Test ID | Feature | Description | Status |
| :--- | :--- | :--- | :--- |
| **TC-01** | Zero-Login Onboarding | Instant workspace load with 5 seeded sample notes | Verified |
| **TC-02** | Page Creation | `+` button creates page and autofocuses title | Verified |
| **TC-03** | Local Persistence | Title and body survive browser reload via `localStorage` | Verified |
| **TC-04** | Markdown Rules | `# `, `## `, `### `, `- `, `1. `, `>`, `---`, `**bold**` transform instantly | Verified |
| **TC-05** | Slash Menu | `/code` inserts real editable code block | Verified |
| **TC-06** | Menu Dismissal | `Escape` closes slash palette cleanly | Verified |
| **TC-07** | Code Blocks | Monospace, Tab indents (2 spaces), newlines isolated | Verified |
| **TC-08** | Title Search | `Ctrl+K` real-time filtering with empty state | Verified |
| **TC-09** | AI Grounding | Accurate answers from saved notes with citations | Verified |
| **TC-10** | Anti-Hallucination | Unrecorded questions yield clear negative response | Verified |
| **TC-11** | Speech-to-Text | Optional Web Speech API voice dictation | Stretch |
| **TC-12** | Production Build | Clean linting, typecheck, and `npm run build` | Verified |

---

## 📦 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Editor Core**: [Tiptap v2](https://tiptap.dev/) / ProseMirror
- **Icons**: [Lucide React](https://lucide.dev/)
- **Persistence**: Browser `window.localStorage`
- **AI Engine**: Google Gemma 2 (`gemma-2-9b-it`) via Backboard REST API
- **Deployment**: [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)

---

## 📄 License & Attribution

- NoteOcean is distributed under the [MIT License](LICENSE). Copyright (c) 2026 Rohan Sonu Bablani.
- Google Gemma model weights are governed by Google's open [Gemma Terms of Use](https://ai.google.dev/gemma/terms).
- Built with Google Antigravity pair programming for Hacktoberfest Hack Day Ahmedabad x Open Source Weekend 2026.
