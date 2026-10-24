# Testing & Acceptance Checklist (Simplified MVP)

## 1. Overview
This checklist defines the rigorous end-to-end acceptance tests that must be validated during tomorrow's implementation phase. No feature is considered complete until its corresponding test case passes.

---

## 2. Test Cases Matrix

### TC-01: Zero-Login Onboarding & Seed Notes
- **Prerequisite**: Open NoteOcean in a clean incognito/private browser window.
- **Expected Outcome**:
  - Application loads immediately with zero login, signup, or registration prompts.
  - The sidebar displays 5 pre-seeded sample notes (`Questions & doubts`, `Hackathon plan`, `Meeting notes`, `Project ideas`, `Reading list`).
  - Active page defaults to `Questions & doubts`, matching the reference screenshot.
- **Pass/Fail**: [ ]

---

### TC-02: Page Creation & Title Autofocus
- **Prerequisite**: Workspace loaded.
- **Action**: Click `+` button next to "YOUR PAGES" in the sidebar.
- **Expected Outcome**:
  - A new page titled `"Untitled"` is appended to the sidebar list.
  - The editor canvas loads empty.
  - Cursor automatically focuses inside the Page Title input with placeholder `"Untitled"`.
- **Pass/Fail**: [ ]

---

### TC-03: Persistence Across Browser Reload (`localStorage`)
- **Prerequisite**: Active page with title `"Hackathon Schedule"` and body text `"Finish editor before lunch"`.
- **Action**: Wait 1 second (observe `All changes saved`), then hard-refresh the browser (`Ctrl+F5` or `Cmd+Shift+R`).
- **Expected Outcome**:
  - Page title remains `"Hackathon Schedule"`.
  - Body text retains exact block structure and text.
  - Bottom indicator displays `All changes saved`.
- **Pass/Fail**: [ ]

---

### TC-04: Real-Time Markdown Transformations
- **Prerequisite**: Empty line in editor body.
- **Actions & Assertions**:
  1. Type `# ` -> Block immediately transforms to `<h1>` node. Marker is removed. [ ]
  2. Type `## ` -> Block transforms to `<h2>`. Marker is removed. [ ]
  3. Type `### ` -> Block transforms to `<h3>`. Marker is removed. [ ]
  4. Type `- ` -> Block transforms to bullet list item. [ ]
  5. Type `1. ` -> Block transforms to numbered list item. [ ]
  6. Type `> ` -> Block transforms to blockquote. [ ]
  7. Type `---` -> Replaces line with horizontal rule `<hr>`. [ ]
  8. Type `**bold**` -> Transforms to bold text upon typing closing `**`. [ ]
  9. Press `Ctrl+Z` after any transform -> Reverts to typed characters. [ ]
- **Pass/Fail**: [ ]

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
- **Pass/Fail**: [ ]

---

### TC-06: Slash Command Dismissal
- **Prerequisite**: Focused paragraph.
- **Actions**:
  1. Type `/`. Menu opens.
  2. Press `Escape`.
- **Expected Outcome**:
  - Menu closes immediately.
  - Editor retains focus; the `/` character remains in place without error.
- **Pass/Fail**: [ ]

---

### TC-07: Code Block Mechanics
- **Prerequisite**: Active code block in editor.
- **Actions**:
  1. Type `const x = 42;`.
  2. Press `Tab`.
  3. Press `Enter`.
- **Expected Outcome**:
  - Code text uses monospace font and dark container styling.
  - Pressing `Tab` inserts 2 spaces without losing focus.
  - Pressing `Enter` adds a newline inside the code block.
  - Typing `# ` inside code block does NOT create a heading.
- **Pass/Fail**: [ ]

---

### TC-08: Real-Time Sidebar Title Search (`Ctrl+K`)
- **Prerequisite**: Sidebar with multiple pages loaded.
- **Actions**:
  1. Click search input or press `Ctrl+K`. Type `"Hackathon"`.
  2. Type `"NonexistentXYZ"`.
  3. Press `Escape` or clear input.
- **Expected Outcome**:
  - Step 1: Only "Hackathon plan" is visible in `YOUR PAGES`.
  - Step 2: "No notes found" message is displayed.
  - Step 3: All notes reappear immediately.
- **Pass/Fail**: [ ]

---

### TC-09: Grounded AI Assistant (Fact Retrieval & Citations)
- **Prerequisite**: Pre-seeded note "Hackathon plan" or "Contact Directory" exists.
- **Action**: Click floating NoteOcean Bot button at bottom-right. Ask: *"What are the phases in my hackathon plan?"*
- **Expected Outcome**:
  - Bot responds accurately citing the content from the note.
  - A clickable citation badge referencing `[Hackathon plan]` is displayed.
  - Clicking the badge opens the "Hackathon plan" note in the editor.
- **Pass/Fail**: [ ]

---

### TC-10: Grounded AI Assistant (Anti-Hallucination Negative Test)
- **Prerequisite**: No notes mention passport, flight, or bank account numbers.
- **Action**: Open NoteOcean Bot. Ask: *"What is my passport number?"*
- **Expected Outcome**:
  - Bot responds: *"I couldn't find any information about that in your saved notes."*
  - Zero fabricated facts or dates are produced.
- **Pass/Fail**: [ ]

---

### TC-11: Speech-to-Text Dictation (If Included)
- **Prerequisite**: Chromium browser with microphone.
- **Action**: Click `[🎙️]` dictation button in editor header. Speak: *"Voice dictation for NoteOcean."*
- **Expected Outcome**:
  - Active listening pulse indicator activates.
  - Transcribed text inserts at editor caret.
  - Clicking stop releases microphone stream.
- **Pass/Fail**: [ ]

---

### TC-12: Production Deployment Smoke Test
- **Prerequisite**: Application deployed to DigitalOcean App Platform.
- **Action**: Open public `.ondigitalocean.app` domain.
- **Expected Outcome**:
  - Page loads within 2 seconds.
  - Full editor typing, Markdown transforms, slash menu, local persistence across refresh, search, and AI bot function identically to local dev.
- **Pass/Fail**: [ ]
