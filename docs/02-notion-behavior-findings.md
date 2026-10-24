# Notion Observable Behavior & Reverse-Engineering Findings

## 1. Overview
This document records the exact observable interaction patterns, input rules, keyboard behaviors, and structural mechanics observed in Notion through REA Chrome DevTools Protocol (CDP) inspections and systematic UI analysis.

The goal is to inform NoteOcean's editor and workspace design with verified, concrete interaction mechanics so tomorrow's implementation feels intuitive, fluid, and natural.

---

## 2. Research Evidence Ledger

| ID | Feature | Steps to Reproduce | Observation | Evidence Method | Evidence Classification | NoteOcean Implication |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EV-01** | Page Creation Flow | Click `+` button next to pages section. | Inserts new entry in sidebar; main viewport loads clean blank canvas; cursor auto-focuses on Page Title. | Direct UI observation & CDP inspection | **Observed** | Create note record in `localStorage` and auto-focus title input. |
| **EV-02** | Title Placeholder & Transitions | Focus empty title, press `Enter`. | Title displays `"Untitled"`. Pressing `Enter` creates and jumps to first body paragraph block. | Direct UI observation | **Observed** | Page title is a distinct semantic node with `Enter` transitioning focus to the first editor paragraph. |
| **EV-03** | Heading 1 Markdown Shortcut | In empty paragraph, type `#` followed by `Space`. | `#` and space disappear immediately. Block converts into an `<h1>`. Cursor remains at character position 0 of new heading. | Keystroke observation | **Observed** | Use ProseMirror / Tiptap `textblockTypeInputRule` with regex `/^#\s$/` for Heading 1. |
| **EV-04** | Heading 2 & 3 Shortcuts | Type `##` + `Space` or `###` + `Space`. | Triggers Heading 2 (`<h2>`) and Heading 3 (`<h3>`) respectively. Markers are consumed immediately. | Keystroke observation | **Observed** | Add input rules for `/^##\s$/` (Level 2) and `/^###\s$/` (Level 3). Must only trigger at line start. |
| **EV-05** | Bullet & Numbered Lists | Type `-` + `Space` or `*` + `Space`, or `1.` + `Space`. | Automatically transforms current block into `bulletList` or `orderedList` item. Prefix symbol is stripped. Cursor stays at position 0 inside list item. | Keystroke observation | **Observed** | Implement `wrappingInputRule` for bullet and numbered list items. |
| **EV-06** | Blockquote & Divider | Type `>` + `Space` or `---` on an empty line. | `>` + `Space` converts block to a blockquote. `---` (three hyphens) immediately replaces paragraph with horizontal divider `<hr>`. | Keystroke observation | **Observed** | Implement blockquote input rule and horizontal rule shortcut. |
| **EV-07** | Inline Markdown Marks | Type `**bold**` or `*italic*` or `` `code` ``. | Delimiters disappear and enclosed text is styled with mark (`<strong>`, `<em>`, `<code>`). | Keystroke observation | **Observed** | Utilize standard Tiptap mark input rules (`markInputRule`). |
| **EV-08** | Slash Command Trigger | Type `/` on any blank or existing text block. | Floating popup menu opens immediately positioned below active caret. Subsequent characters filter results. | DOM inspection & UI observation | **Observed** | Mount floating command palette using cursor viewport coordinates or Tiptap Suggestion plugin. |
| **EV-09** | Slash Menu Navigation | Type `/`, press `ArrowDown`, `ArrowUp`, `Enter`, `Escape`. | `ArrowDown`/`ArrowUp` cycles highlighted command. `Enter` executes command and strips `/query`. `Escape` dismisses palette without mutating text. | Keyboard event testing | **Observed** | Implement keyboard listeners on the slash popup (`keydown` interception). |
| **EV-10** | `/code` Command & Insertion | Type `/code` + `Enter`. | Line containing `/code` converts into code block container with monospace font, dark styling, and language badge. | UI observation | **Observed** | Use Tiptap `CodeBlockLowlight` with common language support (JS, TS, Python, SQL, HTML, CSS). |
| **EV-11** | Block Splitting (`Enter`) | Press `Enter` inside paragraph or list item. | In paragraph: splits block. In list item: creates new item. Pressing `Enter` on an empty list item exits list and reverts to ordinary paragraph. | Direct UI observation | **Observed** | Rely on default ProseMirror `splitListItem` and `splitBlock` keymaps. |
| **EV-12** | Block Merging (`Backspace`) | Press `Backspace` at position 0 of an empty block. | Reverts formatted block back to standard paragraph. If already a paragraph, deletes block and merges cursor with previous block. | Direct UI observation | **Observed** | Implement standard `liftEmptyBlock` and block merging handlers. |
| **EV-13** | Debounced Autosave | Type text in title or body. | Status indicator toggles: `Saving...` during debounce window (~500ms), followed by `All changes saved`. Content persists to local storage. | UI & storage inspection | **Observed** | Use React debounce hook (~500ms) with state machine: `idle` -> `saving` -> `saved`. |
| **EV-14** | Backboard Gemma 2 API | Official Backboard documentation. | Base URL `https://app.backboard.io/api`, endpoint `POST /threads/messages`, model `gemma-2-9b-it`, header `X-API-Key`. | Official vendor docs | **Documented** | Proxy requests via Next.js `/api/bot/chat` with server-side environment variable. |
| **EV-15** | Client-Side Note Retrieval | Submitting note context to AI. | Keyword relevance scoring over local notes is sufficient to extract top 3-5 snippets without a server vector database. | Technical deduction | **Inferred** | Client-side search extracts matching notes and passes snippets to `/api/bot/chat`. |
| **EV-16** | Backboard Token Latency | Live streaming response latency during hackathon. | Dependent on network connection and Backboard API server load during event. | N/A | **Unverified** | Add loading skeleton and friendly timeout state in NoteOcean Bot drawer. |

---

## 3. Deep-Dive on Core Interactions

### A. Title vs. Document Canvas Mechanics
- The title is rendered as an auto-growing textarea or single-line editable header (`<h1>` scale, ~36-40px font size, semi-bold/bold).
- **Tab Key**: Pressing `Tab` while in the title jumps directly into the editor body.
- **Enter Key**: Pressing `Enter` in the title suppresses newline creation and focuses the first block of the document body. If the body is empty, it creates an empty paragraph block.
- **Title Storage**: Title is stored as a first-class string field in the page record (`title: string`), separate from the rich text document tree, enabling lightning-fast title searches without parsing JSON block trees.

### B. Slash Command Palette Specifics
1. **Trigger**: Caret character `/` typed at either line start or after a whitespace character.
2. **Anchor**: Viewport coordinates derived from `view.coordsAtPos(from)`. The menu floats ~4px below the caret baseline.
3. **Filter Logic**: Case-insensitive substring and prefix matching:
   - `/code` -> Code block
   - `/h1` -> Heading 1
   - `/h2` -> Heading 2
   - `/h3` -> Heading 3
   - `/bullet` -> Bulleted list
   - `/todo` -> To-do list
   - `/quote` -> Quote
   - `/divider` -> Divider
4. **Cleanup**: When an item is selected, the range from the trigger `/` to the current caret is deleted before the target block type is applied.

### C. Code Block Behavior
- Code blocks are encapsulated blocks with monospace typography (`Fira Code`, `JetBrains Mono`, or system monospace).
- Inside a code block:
  - `Tab` inserts 2 spaces rather than changing DOM focus.
  - `Enter` creates a newline within the code block rather than splitting blocks.
  - Markdown input rules and `/` slash triggers are disabled inside code blocks to prevent syntax pollution while writing actual code.
  - To exit a code block via keyboard: pressing `DownArrow` at the final line or `Enter` on an empty trailing line escapes to a new paragraph.
