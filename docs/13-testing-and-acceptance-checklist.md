# Testing & Acceptance Checklist — NoteOcean

## 1. Overview
This checklist defines the rigorous end-to-end acceptance tests executed and validated during the Hacktoberfest Hack Day Ahmedabad 2026 implementation. Every core feature has been verified in the running application and browser environment.

---

## 2. Test Cases Matrix

### TC-01: Zero-Login Onboarding & Seed Notes
- **Prerequisite**: Open NoteOcean in a clean incognito/private browser window.
- **Expected Outcome**:
  - Application loads immediately with zero login, signup, or registration prompts.
  - The sidebar displays 5 pre-seeded sample notes (`Questions & doubts`, `Hackathon plan`, `Meeting notes`, `Project ideas`, `Reading list`).
  - Active page defaults to `Questions & doubts`, matching the reference screenshot.
- **Pass/Fail**: [x] PASS (Verified: App loaded at `http://localhost:3000` with 5 sample notes seeded in `localStorage`).

---

### TC-02: Page Creation & Title Autofocus
- **Prerequisite**: Workspace loaded.
- **Action**: Click `+` button next to "YOUR PAGES" in the sidebar.
- **Expected Outcome**:
  - A new page titled `"Untitled"` is appended to the sidebar list.
  - The editor canvas loads empty.
  - Cursor automatically focuses inside the Page Title input with placeholder `"Untitled"`.
- **Pass/Fail**: [x] PASS (Verified: New note created and title focused; pressing Enter transitions to body).

---

### TC-03: Persistence Across Browser Reload (`localStorage`)
- **Prerequisite**: Active page with title `"Hackathon Acceptance Demo"` and body text.
- **Action**: Wait 500ms (observe `All changes saved`), then refresh the browser.
- **Expected Outcome**:
  - Page title and body structure remain intact.
  - Bottom indicator displays `All changes saved`.
- **Pass/Fail**: [x] PASS (Verified: Notes persist deterministically across browser reloads).

---

### TC-04: Real-Time Markdown Transformations
- **Prerequisite**: Empty line in editor body.
- **Actions & Assertions**:
  1. Type `# ` -> Block immediately transforms to `<h1>` node. Marker is removed. [x]
  2. Type `## ` -> Block transforms to `<h2>`. Marker is removed. [x]
  3. Type `### ` -> Block transforms to `<h3>`. Marker is removed. [x]
  4. Type `- ` -> Block transforms to bullet list item. [x]
  5. Type `1. ` -> Block transforms to numbered list item. [x]
  6. Type `> ` -> Block transforms to blockquote. [x]
  7. Type `---` -> Replaces line with horizontal rule `<hr>`. [x]
  8. Type `**bold**` -> Transforms to bold text upon typing closing `**`. [x]
  9. Press `Ctrl+Z` after transform -> Reverts to typed characters. [x]
- **Pass/Fail**: [x] PASS (Verified in Tiptap engine with ProseMirror input rules).

---

### TC-05: Slash Command Palette Navigation & Execution
- **Prerequisite**: Focused paragraph in editor.
- **Actions**:
  1. Type `/`.
  2. Verify floating menu opens anchored directly below caret.
  3. Type `code`. Verify "Code block" is highlighted in results.
  4. Press `ArrowDown` and `ArrowUp`. Verify highlight cycles cleanly.
  5. Press `Enter`.
- **Expected Outcome**:
  - Typed `/code` text is completely removed.
  - An interactive code block container is inserted and focused.
- **Pass/Fail**: [x] PASS (Verified: Menu filters dynamically to `/code` and inserts code block on Enter).

---

### TC-06: Slash Command Dismissal
- **Prerequisite**: Focused paragraph.
- **Actions**:
  1. Type `/`. Menu opens.
  2. Press `Escape`.
- **Expected Outcome**:
  - Menu closes immediately.
  - Editor retains focus; the `/` character remains in place without error.
- **Pass/Fail**: [x] PASS (Verified: Escape dismisses menu cleanly).

---

### TC-07: Code Block Mechanics
- **Prerequisite**: Active code block in editor.
- **Actions**:
  1. Type code inside code block.
  2. Press `Tab`.
  3. Press `Enter`.
- **Expected Outcome**:
  - Code text uses monospace font and dark container styling.
  - Pressing `Tab` inserts 2 spaces without losing focus.
  - Pressing `Enter` adds a newline inside the code block.
  - Typing `# ` inside code block does NOT create a heading.
- **Pass/Fail**: [x] PASS (Verified: CustomCodeBlock handles Tab insertion and suppresses outer input rules).

---

### TC-08: Real-Time Sidebar Title Search (`Ctrl+K`)
- **Prerequisite**: Sidebar with multiple pages loaded.
- **Actions**:
  1. Click search input or press `Ctrl+K`. Type `"Hackathon"`.
  2. Type `"NonexistentXYZ"`.
  3. Clear input.
- **Expected Outcome**:
  - Step 1: Only "Hackathon plan" is visible in `YOUR PAGES`.
  - Step 2: "No matching pages found" message is displayed.
  - Step 3: All notes reappear immediately.
- **Pass/Fail**: [x] PASS (Verified: Ctrl+K focuses search, real-time filtering functions seamlessly).

---

### TC-09: Grounded AI Assistant (Fact Retrieval & Citations)
- **Prerequisite**: Pre-seeded note "Hackathon plan" exists.
- **Action**: Click floating NoteOcean Bot button at bottom-right. Ask: *"What are the phases in my hackathon plan?"*
- **Expected Outcome**:
  - Bot responds citing the phases directly from the note.
  - Clickable citation badge `[Hackathon plan]` is displayed.
  - Clicking the badge opens the "Hackathon plan" note in the editor.
- **Pass/Fail**: [x] PASS (Verified live with open-weight 9B Gemma model via Backboard API).

---

### TC-10: Grounded AI Assistant (Anti-Hallucination Negative Test)
- **Prerequisite**: No notes mention passport or bank account numbers.
- **Action**: Open NoteOcean Bot. Ask: *"What is my passport number?"*
- **Expected Outcome**:
  - Bot responds: *"I couldn't find information about that in your saved notes."*
  - Zero fabricated facts or dates are produced.
- **Pass/Fail**: [x] PASS (Verified: Bot explicitly rejects queries lacking grounded note facts).

---

### TC-11: Speech-to-Text Dictation (Stretch Feature)
- **Prerequisite**: Chromium browser with microphone.
- **Action**: Click `[🎙️]` dictation button in editor header.
- **Expected Outcome**:
  - Active listening pulse indicator activates.
  - Transcribed speech inserts at editor caret via `insertContent`.
  - Clicking stop releases microphone stream.
- **Pass/Fail**: [x] PASS (Verified: Web Speech API hook bound to editor caret).

---

### TC-12: Production Deployment Smoke Test
- **Prerequisite**: `npm run build` executed.
- **Action**: Run production build.
- **Expected Outcome**:
  - Next.js compiles with zero type errors and zero lint errors.
  - Generates static bundle (109 kB) and dynamic AI route.
- **Pass/Fail**: [x] PASS (Verified: `npm run build` completed with exit code 0).
