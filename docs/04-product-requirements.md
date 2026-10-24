# Product Requirements Document (PRD) — Simplified MVP

## 1. Overview & Objectives
**NoteOcean** delivers a fast, keyboard-first personal note-taking workspace with instant block transformations, an interactive slash-command palette, real-time title search, browser-local persistence, and a grounded AI assistant powered by Google's open-weight Gemma 2 model (with Gemma 4 as a potential target if verified on execution day).

The product requires **zero login** and operates **without a database**, storing notes in browser `localStorage`.

*Status*: **Preparation & Specification Phase Only**. This PRD defines the specifications for tomorrow's implementation. The application has not yet been built, tested end-to-end, deployed, or submitted.

---

## 2. User Stories & Acceptance Criteria

### US-1: Zero-Friction Workspace & Local Persistence (P1 Core)
- **As a** user,
- **I want to** open NoteOcean and immediately view, create, edit, rename, and delete notes,
- **So that** I can capture thoughts without being blocked by sign-up forms, logins, or database setup.

#### Acceptance Criteria:
1. Opening NoteOcean loads the workspace immediately with zero authentication or registration screens.
2. If storage is empty, 5 fictional sample notes are automatically seeded (`Questions & doubts`, `Hackathon plan`, `Meeting notes`, `Project ideas`, `Reading list`).
3. Clicking `+` next to "YOUR PAGES" creates a new page titled `"Untitled"` and focuses the title input.
4. All note edits (titles and content) automatically persist to browser `localStorage` via a debounced autosave (~500ms).
5. Refreshing the browser or reopening the tab in the same browser profile restores all saved notes and active page state.
6. A clear footer status indicator displays `All changes saved` with a teal circle checkmark.

---

### US-2: Keyboard-Driven Rich Text & Markdown Transformations (P1 Core)
- **As a** writer/developer,
- **I want to** type standard Markdown shortcuts directly into the editor,
- **So that** my notes transform into formatted blocks immediately without a separate preview pane.

#### Acceptance Criteria:
1. Typing `# ` at the line start transforms the block into `<h1>`.
2. Typing `## ` and `### ` transforms to `<h2>` and `<h3>` respectively.
3. Typing `- ` or `* ` creates a bullet list; typing `1. ` creates a numbered list.
4. Typing `> ` creates a blockquote.
5. Typing `---` on an empty line replaces it with a horizontal divider `<hr>`.
6. Inline marks: `**bold**`, `*italic*`, `` `code` `` format upon typing the closing delimiter.
7. *Crucial Rule*: Transformations require a trailing space (`# `). Typing `#` alone does not transform.
8. Transformations are undoable with `Ctrl+Z` / `Cmd+Z`.

---

### US-3: Interactive Slash Command Palette (P1 Core)
- **As a** user,
- **I want to** type `/` to open an interactive command menu,
- **So that** I can insert any block type using keyboard navigation.

#### Acceptance Criteria:
1. Typing `/` opens a floating popup anchored directly below the active caret.
2. Typing characters filters options in real time (e.g., `/code` highlights "Code Block").
3. `ArrowDown` and `ArrowUp` cycle the highlighted item.
4. `Enter` executes the command, deletes the typed `/query`, and inserts the block.
5. `Escape` dismisses the menu without altering text.

---

### US-4: Code Block Insertion & Editing (P1 Core)
- **As a** developer/student,
- **I want to** insert and edit syntax-highlighted code blocks,
- **So that** I can store code snippets cleanly within my notes.

#### Acceptance Criteria:
1. Triggering `/code` or typing ` ``` ` creates a dark-themed monospace code container.
2. Pressing `Tab` inside a code block inserts 2 spaces without shifting DOM focus.
3. Pressing `Enter` creates a line break within the code block.
4. Markdown input rules and `/` slash triggers are suppressed inside code blocks.

---

### US-5: Real-Time Page Title Search (P2)
- **As a** user with multiple notes,
- **I want to** filter pages by typing into the sidebar search input (`Ctrl+K`),
- **So that** I can jump to any specific note in milliseconds.

#### Acceptance Criteria:
1. Typing into the sidebar search bar instantly filters visible page items in `YOUR PAGES`.
2. Matching is case-insensitive and supports substring matching.
3. Pressing `Enter` in the search input opens the first matching result.
4. Pressing `Escape` or clearing the input restores the full page list.

---

### US-6: Grounded AI Assistant — NoteOcean Bot (P3)
- **As a** user,
- **I want to** ask questions to a floating AI assistant that inspects my saved notes,
- **So that** I can recall facts and extract summaries from my personal notebook.

#### Acceptance Criteria:
1. A circular button with an aquamarine glowing ring and tooltip `"Ask NoteOcean AI"` is pinned at the bottom-right.
2. Clicking the button opens a clean slide-up chat drawer.
3. The client retrieves the top 3–5 matching notes from `localStorage` and submits them to `POST /api/bot/chat`.
4. The server invokes Google Gemma 2 (or verified Gemma 4) via Backboard and returns a grounded response citing source notes.
5. If notes do not contain the answer, the bot states: *"I couldn't find information about that in your saved notes."*
6. Clickable source pills allow jumping directly to cited pages.

---

### US-7: Voice Dictation / Speech-to-Text (P4 Stretch)
- **As a** user,
- **I want to** dictate notes by speaking into my microphone,
- **So that** I can capture thoughts hands-free.

#### Acceptance Criteria:
1. Microphone button in editor toolbar initiates Chromium Web Speech API.
2. Live pulsing listening badge displays during recording.
3. Transcribed words insert directly at the editor caret.
4. Stopping recording cleanly releases the microphone.
5. If browser is unsupported, a helpful message is displayed without crashing.

---

## 3. Implementation Priorities

- **Priority 0 (Scaffold & Base Layout)**: Next.js 15, Tailwind CSS, sidebar layout, sample notes seeded in `localStorage`.
- **Priority 1 (Core Editor Engine)**: Tiptap rich text, Page Title with Enter transition, Markdown input rules, slash palette, `/code` block, debounced autosave.
- **Priority 2 (Workspace Management)**: Page creation, page deletion, active page highlight, real-time title search (`Ctrl+K`).
- **Priority 3 (NoteOcean AI Bot)**: Backboard Gemma integration (Gemma 2 baseline; Gemma 4 conditional on catalog check), client-side note retrieval, drawer UI, source citations.
- **Priority 4 (Speech-to-Text)**: Chromium Web Speech API dictation (secondary stretch feature).
- **Priority 5 (Deployment & Demo)**: DigitalOcean App Platform single service ($5/mo preferred target, subject to credit verification and user approval), acceptance testing, demo rehearsal.
