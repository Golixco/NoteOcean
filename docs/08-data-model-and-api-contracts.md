# Data Model & API Contracts Specification (Simplified MVP)

## 1. Client-Side Data Storage (`localStorage`)

All application state is persisted in the browser via `window.localStorage`. This provides instant read/write operations (0ms latency), eliminates database network round-trips, and ensures notes survive page reloads and browser restarts.

### Primary Storage Keys

| Key | Type | Description |
| :--- | :--- | :--- |
| `noteocean_pages` | `string` (Serialized JSON array of `NotePage`) | Collection of all created user notes |
| `noteocean_active_page_id`| `string` (UUID) | ID of the currently open and edited page |

---

### Data Entity: `NotePage`

```typescript
export interface NotePage {
  id: string;              // Unique identifier (UUID generated via crypto.randomUUID())
  title: string;           // Display title, e.g. "Questions & doubts"
  icon?: string;           // Optional emoji / icon identifier
  content: any;            // Tiptap ProseMirror document JSON structure
  plainText: string;       // Extracted raw text used for instant search & AI retrieval
  createdAt: string;       // ISO 8601 creation timestamp
  updatedAt: string;       // ISO 8601 last modified timestamp
}
```

### Pre-Seeded Fictional Demo Notes
When `noteocean_pages` is empty or not found on first load, NoteOcean automatically seeds 5 realistic fictional pages (matching the reference UI):
1. **Questions & doubts** (Active page: contains bullet points, "Editor behavior" heading, and highlighted badge).
2. **Hackathon plan** (Contains project milestones and schedule).
3. **Meeting notes** (Contains standup notes and action items).
4. **Project ideas** (Contains feature concepts).
5. **Reading list** (Contains articles and references).

Users can edit, rename, or delete these seeded notes freely.

---

## 2. Server-Side API Contract (`POST /api/bot/chat`)

NoteOcean has exactly one server-side API endpoint, dedicated to proxying AI questions to the Backboard Gemma model while safeguarding the API key.

### Endpoint: `POST /api/bot/chat`

#### Request Headers
```http
Content-Type: application/json
Accept: application/json
```

#### Request Body
```json
{
  "query": "Which page contains the delivery address for Alex?",
  "notesContext": [
    {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "title": "Contact Directory",
      "snippet": "Alex Mercer\nDelivery Address: 124 Ocean Way, Suite 400, Ahmedabad, Gujarat\nPhone: +91 98765 43210"
    },
    {
      "id": "b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e",
      "title": "Hackathon plan",
      "snippet": "Phase 1: Finish core editor. Phase 2: Deploy to App Platform."
    }
  ],
  "history": []
}
```

#### Request Validation Rules
- `query`: String, required, max length 500 characters.
- `notesContext`: Array of note objects, max 5 items. Total text length capped at 6,000 characters.

---

#### Successful Response (`200 OK`)
```json
{
  "reply": "According to your **Contact Directory** note, the delivery address for Alex Mercer is **124 Ocean Way, Suite 400, Ahmedabad, Gujarat**.",
  "citations": [
    {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "title": "Contact Directory"
    }
  ]
}
```

---

#### Error Responses

| HTTP Status | Condition | Example Error Response |
| :--- | :--- | :--- |
| `400 Bad Request` | Missing or malformed query string. | `{"error": "Query is required and must be under 500 characters."}` |
| `413 Payload Too Large`| Notes context exceeds size threshold. | `{"error": "Notes context exceeds maximum token budget."}` |
| `429 Too Many Requests`| Exceeded in-memory rate limit. | `{"error": "Too many requests. Please wait a moment."}` |
| `500 Internal Error` | Backboard API network failure or missing key. | `{"error": "AI service is currently unavailable. Please try again."}` |

---

## 3. Backboard Upstream Request Format

Inside the Next.js server route handler, NoteOcean forwards the prompt to Backboard:

- **Target URL**: `https://app.backboard.io/api/threads/messages`
- **Headers**:
  - `X-API-Key: process.env.BACKBOARD_API_KEY`
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "content": "SYSTEM PROMPT WITH RETRIEVED NOTES AND USER QUERY",
    "llm_provider": "google",
    "model_name": "gemma-2-9b-it",
    "memory": "Off"
  }
  ```
