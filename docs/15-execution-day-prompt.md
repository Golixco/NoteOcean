# NoteOcean — Execution Day Kickoff Prompt (For Tomorrow)

> [!IMPORTANT]
> **Instructions for the User**:
> Copy and paste the prompt block below into your first Antigravity prompt tomorrow morning, **AFTER** you have created the public GitHub repository named `NoteOcean` and are ready to begin implementation.
> **DO NOT EXECUTE THIS PROMPT TONIGHT.**

```markdown
# NoteOcean — Implementation & Execution Kickoff

1. Mission Authorization
I have created the public GitHub repository named NoteOcean and I explicitly authorize you to begin implementing the application according to our research, specifications, and architecture package.

2. Mandatory First Actions
Before writing any code:
1. READ `Readfirst.md` in the project root completely. It is your master handoff document.
2. Inspect the design system specification:
   Review `docs/06-ui-reference-and-design-system.md`. Replicate this design faithfully.
3. Verify the Git working tree. Preserve all existing documentation and reference files.

3. Core Architectural Rules (Simplified MVP)
- ABSOLUTELY NO LOGIN OR USER ACCOUNTS. The app must open and function immediately.
- NO DATABASE / NO POSTGRESQL / NO ORM. Store all notes and titles in browser `localStorage`.
- SINGLE CONTAINER: Next.js 15 (App Router, TypeScript) + Tailwind CSS.
- SINGLE BACKEND ROUTE: `POST /api/bot/chat` proxying to Google Gemma 2 baseline (or verified Gemma 4 if confirmed via Backboard catalog check) using server-only `BACKBOARD_API_KEY`.
- CLIENT-SIDE NOTE RETRIEVAL: Filter relevant notes in the browser and pass top snippets to `/api/bot/chat`.
- PREFERRED DEPLOYMENT: DigitalOcean App Platform Basic Web Service ($5/mo), subject to runtime memory, credit eligibility verification, and user cost approval.

4. Implementation Priority Order
- Priority 0: Scaffold Next.js 15 + Tailwind CSS matching the reference screenshot. Seed 5 sample notes into `localStorage`.
- Priority 1: Rich-text editor with Page Title Enter transition, Markdown input rules (`# `, `## `, `### `, `- `, `1. `, `>`, `---`), floating Slash Menu (`/code`), and debounced autosave.
- Priority 2: Sidebar page list, `+` create page, active page teal card highlight, and real-time title search (`Ctrl+K`).
- Priority 3: NoteOcean AI Bot floating glowing button and chat drawer, grounded Gemma retrieval, and clickable source citations. (Check Backboard catalog for Gemma 4 if targeting Best Use of Gemma 4; otherwise stay on Gemma 2 baseline for Best Open-Source AI Project, supported by DigitalOcean).
- Priority 4: Speech-to-text voice dictation (secondary stretch feature).
- Priority 5: Verify build, deploy to DigitalOcean App Platform (preferred target, verifying credits in console first), and execute acceptance checklist (TC-01 to TC-12).

Begin Phase 0 now.
```
