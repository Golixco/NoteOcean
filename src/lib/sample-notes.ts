import { NotePage } from "@/types/note";

export const SAMPLE_NOTES: NotePage[] = [
  {
    id: "sample-1",
    title: "Questions & doubts",
    icon: "📄",
    createdAt: "2026-10-24T09:00:00.000Z",
    updatedAt: "2026-10-24T10:15:00.000Z",
    plainText: `How should page search work?
Which features belong in the first release?
Editor behavior
Type naturally. Markdown shortcuts become formatted blocks as you write.
Try typing /code to insert a real editable code block.`,
    content: {
      type: "doc",
      content: [
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "How should page search work?" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Which features belong in the first release?" }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Editor behavior" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Type naturally. Markdown shortcuts become formatted blocks " },
            {
              type: "text",
              marks: [{ type: "bold" }],
              text: "as you write.",
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: { language: "typescript" },
          content: [
            {
              type: "text",
              text: "// Press Tab for 2-space indentation\nconst app = 'NoteOcean';\nconsole.log(`Welcome to ${app}!`);",
            },
          ],
        },
      ],
    },
  },
  {
    id: "sample-2",
    title: "Hackathon plan",
    icon: "📄",
    createdAt: "2026-10-24T08:30:00.000Z",
    updatedAt: "2026-10-24T09:45:00.000Z",
    plainText: `Hacktoberfest Hack Day Ahmedabad 2026
Target Track: Best Open-Source AI Project, supported by DigitalOcean.
Phases of execution:
- Phase 1: Repository setup and foundational design tokens.
- Phase 2: Workspace UI shell matching reference screenshot.
- Phase 3: Page management with browser localStorage persistence.
- Phase 4: Headless Tiptap rich-text editor with instant Markdown triggers and slash commands.
- Phase 5: Gemma 2 AI assistant with client-side retrieval and grounded answers.
- Phase 6: Polish, acceptance testing, and final demo rehearsal.
Key Deadline: All code frozen by 2:00 PM for judging demonstrations.`,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Hacktoberfest Hack Day Ahmedabad 2026" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Target Track: Best Open-Source AI Project, supported by DigitalOcean.",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "Phases of execution" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Phase 1: Repository setup and design tokens." }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Phase 2: Workspace UI shell matching reference." }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Phase 3: Page management & local persistence." }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Phase 4: Tiptap rich-text editor & slash commands." }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Phase 5: Gemma 2 AI assistant with grounded citations." }],
                },
              ],
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              marks: [{ type: "bold" }],
              text: "Key Deadline: All code frozen by 2:00 PM for judging demonstrations.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "sample-3",
    title: "Meeting notes",
    icon: "📄",
    createdAt: "2026-10-24T08:00:00.000Z",
    updatedAt: "2026-10-24T08:45:00.000Z",
    plainText: `Architecture Sync with Alex & Jordan
Key architectural decisions:
1. Zero-login onboarding: No user accounts, registration, or JWT tokens.
2. Browser-local storage: Notes are persisted directly in localStorage for instant latency and offline resilience.
3. Single Next.js container: Unified frontend and API route.
4. AI grounding: Send only relevant note snippets to prevent prompt bloat.
Fictional Contact Details:
- Contact Person: Alex Morgan
- Email: alex@example.com
- Delivery Address: 742 Evergreen Terrace, Sector 4, Ahmedabad.`,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Architecture Sync with Alex & Jordan" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Key architectural decisions agreed upon:" }],
        },
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Zero-login onboarding: No user accounts or friction." }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Browser-local storage: Notes persist in localStorage." }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Single Next.js container on DigitalOcean App Platform." }],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 3 },
          content: [{ type: "text", text: "Fictional Contact Details" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Contact Person: Alex Morgan" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Email: alex@example.com" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Delivery Address: 742 Evergreen Terrace, Sector 4, Ahmedabad." }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "sample-4",
    title: "Project ideas",
    icon: "📄",
    createdAt: "2026-10-24T07:30:00.000Z",
    updatedAt: "2026-10-24T08:15:00.000Z",
    plainText: `Future Features & Creative Brainstorming
- Web Speech API integration for instant voice dictation into the editor.
- Bi-directional linking between notes using [[Page Name]] syntax.
- Quick export options to clean Markdown or HTML.
- Dark obsidian and aquamarine wave branding aesthetics.`,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Future Features & Creative Brainstorming" }],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Web Speech API integration for instant voice dictation." }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Bi-directional linking between notes using [[Page Name]] syntax." }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Quick export options to clean Markdown or HTML." }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "sample-5",
    title: "Reading list",
    icon: "📄",
    createdAt: "2026-10-24T07:00:00.000Z",
    updatedAt: "2026-10-24T07:45:00.000Z",
    plainText: `Technical Articles & Papers to Read
1. Google Gemma 2: Technical Report & Open-Weights Architecture
2. ProseMirror Guide: Document Transactions & Selection Positioning
3. Modern Web Best Practices for Keyboard Navigation and Accessibility
4. DigitalOcean App Platform Performance and Memory Optimization`,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Technical Articles & Papers to Read" }],
        },
        {
          type: "orderedList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Google Gemma 2: Technical Report & Open-Weights Architecture" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "ProseMirror Guide: Document Transactions & Selection Positioning" }],
                },
              ],
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Modern Web Best Practices for Keyboard Navigation and Accessibility" }],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];
