# Page Search Findings & NoteOcean Search Architecture (Simplified MVP)

## 1. Overview
Finding pages quickly is essential to a modern note-taking workflow. This document analyzes search interaction patterns observed in Notion and specifies NoteOcean's search engine for the hackathon MVP.

---

## 2. Observed Search Patterns in Notion

### A. Surface Placement & Accessibility
1. **Sidebar Search Bar**: Located near the top of the navigation sidebar, featuring a search icon (`magnifying glass`), placeholder `"Search your pages"`, and shortcut cue (`Ctrl K`).
2. **Instant Title Filtering**: Typing in the search field immediately narrows the visible list of pages under `YOUR PAGES`.

### B. Input & Matching Mechanics
- **Real-Time Responsiveness**: Every keystroke updates the filtered list instantly (0ms perceived latency).
- **Matching Scope**: Case-insensitive substring and prefix matching against page titles.
- **Empty Query State**: When the search query is empty, all pages are displayed in their default order.
- **Zero-Match State**: When no pages match, a clean empty state is displayed: *"No notes found matching '[query]'."*
- **Dismissal & Selection**:
  - `ArrowDown` / `ArrowUp`: Highlights the next/previous matching page.
  - `Enter`: Navigates immediately to the highlighted page.
  - `Escape`: Clears the query and blurs the input.
  - Clicking an 'x' icon in the input clears the text and restores the full list.

---

## 3. NoteOcean MVP Search Design

### Architecture Strategy
For our 1-day hackathon MVP:
1. **Client-Side Title Search (`Ctrl+K`)**:
   - Because all notes are held in `localStorage`, title search is performed directly in memory on the client:
     ```typescript
     const filteredPages = pages.filter(p =>
       p.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
     );
     ```
   - Zero network overhead, instant 0ms response time.
2. **Client-Side Content Retrieval for AI Assistant**:
   - Note content retrieval for NoteOcean Bot is also handled on the client by matching query keywords against `plainText` and `title`, extracting the top 3–5 matching snippets to send to `/api/bot/chat`.
   - Eliminates the need for any external vector database or server-side search engine.

---

## 4. UI Specification for Sidebar Search

```
+-----------------------------------------------+
|  NoteOcean [Wave]                     [|<]    |
+-----------------------------------------------+
|  [Q Search your pages                  Ctrl K]|  <-- Active Input
+-----------------------------------------------+
|  YOUR PAGES                               [+] |
|  * Hackathon plan                             |  <-- Matched item
|                                               |
|  (Other items filtered out)                   |
+-----------------------------------------------+
```

### Keyboard & Event Handlers
- `onChange`: Updates `searchQuery` state immediately.
- `onKeyDown`:
  - `ArrowDown`: Increments `selectedIndex`.
  - `ArrowUp`: Decrements `selectedIndex`.
  - `Enter`: Selects `filteredPages[selectedIndex]`, sets `activePageId`, loads editor content.
  - `Escape`: Resets `searchQuery = ""`, blurs input.
- `Clear Button`: Appears whenever `searchQuery.length > 0`; clicking resets input.
