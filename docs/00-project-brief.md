# NoteOcean — Project Brief & Product Vision (Simplified MVP)

## 1. Product Vision
**NoteOcean** is a fast, clean, modern note-taking application inspired by the fluid editor interactions and intuitive page organization of Notion, enhanced by instant Markdown shortcuts, an interactive slash-command palette, real-time title search, and a floating AI assistant (**NoteOcean Bot**) grounded in the user's personal notes.

The product aims to feel like a polished, responsive desktop-class web tool rather than a toy prototype or static hackathon mockup.

---

## 2. Hackathon Alignment & Target Challenges

- **Event**: **Hacktoberfest Hack Day Ahmedabad x Open Source Weekend** (October 24, 2026).
  - Official Event Page: [https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend](https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend)
  - Official Challenge Page: [https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend/challenges/01a0d987-0c41-12ea-13ac-5b85755dc2f3](https://www.mlh.com/events/hacktoberfest-hack-day-ahmedabad-x-open-source-weekend/challenges/01a0d987-0c41-12ea-13ac-5b85755dc2f3)
- **Confirmed Event Prize Categories**:
  1. **Primary Target**: **Best Open-Source AI Project, supported by DigitalOcean**
     - DigitalOcean is the official supporter of this category and our preferred deployment platform.
     - NoteOcean qualifies as an original open-source workspace featuring an open-weight model (Google Gemma 2 baseline) at its core.
  2. **Potential Additional Target**: **Best Use of Gemma 4**
     - This is a potential additional category **only if** an authentic Gemma 4 model is officially integrated and proven functional during implementation.
     - Google Gemma 2 (`gemma-2-9b-it`) is our verified baseline open-weight model; **Gemma 2 is never described or claimed as Gemma 4**.
- **Category Clarification**:
  - Claims of "Best Use of DigitalOcean" or "Best Use of Backboard" as separate prize categories are **removed**. DigitalOcean supports the primary AI track and serves as the preferred deployment host; Backboard is the AI API provider.
- **Readiness & Submission Status**:
  - The project is fully prepared for implementation, but has **not** yet been built, tested end-to-end, deployed, or submitted. Formal prize eligibility and submissions will be verified during event check-in.

---

## 3. Core Architectural Simplification (Hackathon MVP)

To guarantee a reliable, polished, and fully functional product can be delivered in a single 8-hour build session:
1. **Zero Login / Instant Onboarding**: Users open the application and start typing immediately without creating accounts, logging in, or dealing with authentication hurdles.
2. **Browser-Local Persistence (`localStorage`)**: Page titles and rich-text document structures persist directly in browser `localStorage`. Notes survive reloads and restarts within the same browser profile.
3. **Single Application Container**: Built entirely on **Next.js 15 (App Router)** and deployed as a single web service on **DigitalOcean App Platform ($5/mo Basic Tier)** as the preferred deployment target, subject to actual memory requirements, credit eligibility, and user cost approval. No separate database service is required.

---

## 4. Scope & Feature Boundaries

| Domain | MVP Features (Included) | Post-Hackathon Scope (Excluded) |
| :--- | :--- | :--- |
| **Editor** | Notion-like rich text, real-time Markdown rules (`# `, `## `, `### `, `- `, `1. `, `>`, `---`), slash menu (`/code`, `/h1`, `/bullet`, `/quote`), code block with Tab indentation, debounced autosave. | Collaborative multi-user editing (CRDTs), complex drag-and-drop table databases. |
| **Workspace** | Left sidebar, pre-seeded sample notes, `+ New Page` button, in-place title rename, delete page, active page teal highlight. | Workspace permissions, folders/sub-workspaces, team member invites. |
| **Search** | Real-time title search in sidebar (`Ctrl+K`) with instant filtering. | Server-side Elasticsearch / Pinecone vector databases. |
| **AI Bot** | Floating circular bot with glowing ring at bottom-right, slide-up drawer, client-side note retrieval, Gemma 2 integration via Backboard, source page citations. | Multi-modal image analysis, web browsing agents. |
| **Speech-to-Text** | Secondary stretch feature: Web Speech API microphone dictation directly into editor caret. | Cloud audio storage, speaker diarization. |
| **Deployment** | Single Next.js web service on DigitalOcean App Platform ($5/mo) as preferred target (subject to memory requirements and credit confirmation). | Multi-container Docker compose, Kubernetes, managed database clusters. |
