# UI Reference Analysis & Design System Specification

## 1. Authoritative Reference Screenshot Verification

> [!IMPORTANT]
> **VERIFIED VISUAL ASSET**: The authoritative UI reference screenshot was inspected directly at:
> [`/home/vuld0/NoteOcean/doc/reference/NoteOcean-ui-reference.png`](file:///home/vuld0/NoteOcean/doc/reference/NoteOcean-ui-reference.png)
> Size: 1.34 MB (1341511 bytes). High-resolution dark mode desktop interface.
> 
> All UI styling, layout measurements, colors, component hierarchies, and interactive states in this document are directly derived from this image.

---

## 2. Comprehensive Visual Breakdown

```
+---------------------------------------------------------------------------------------------------------+
| [Doc] NoteOcean  /  Questions & doubts                                               [Star] [Share] [...]|
+----------------------+----------------------------------------------------------------------------------+
| NoteOcean [Wave] [|<]|                                                                                  |
|                      |   Questions & doubts (Title - 36px Bold)                                         |
| [Q Search...  Ctrl K]|                                                                                  |
|                      |   :::  * How should page search work?                                            |
| WORKSPACE            |   :::  * Which features belong in the first release?                             |
| [Home] Home          |                                                                                  |
| [Doc] Quick notes    |   Editor behavior (H2 - 24px Bold)                                              |
| [Star] Favorites     |                                                                                  |
|                      |   Type naturally. Markdown shortcuts become formatted blocks [as you write.]     |
| YOUR PAGES        [+]|                                                                                  |
| [Doc] Hackathon plan |   [+] ::: /code|                                                                 |
| [Doc] Meeting notes  |           +---------------------------------------------+                        |
| [Doc] Project ideas  |           | Q /code                                     |                        |
| [Doc] Reading list   |           | [</>] Code block                         [↵]| (Active Cyan Card)       |
| [Doc] Questions & .. |           | H1    Heading 1                             |                        |
| (Active Teal Card)   |           | ::=   Bulleted list                         |                        |
|                      |           | [v]   To-do list                            |                        |
|                      |           | ""    Quote                                 |                        |
|                      |           +---------------------------------------------+                        |
|                      |                                                                                  |
|                      |                                                              [Ask NoteOcean AI]  |
| [Avatar] Golixco [v] |                               [✓] All changes saved          [(Wave) Glowing Bot]|
+----------------------+----------------------------------------------------------------------------------+
```

---

## 3. NoteOcean Design Tokens (Extracted from Reference)

### A. Color Palette (Obsidian & Aquamarine / Cyan Theme)

| Token Name | Hex / CSS Value | Usage in Reference Screenshot |
| :--- | :--- | :--- |
| `--bg-main` | `#0d1117` | Main editor canvas background |
| `--bg-sidebar` | `#0f141c` | Left navigation sidebar background |
| `--bg-search-input`| `#181f28` | Sidebar search bar pill background |
| `--bg-active-card` | `#162a2d` | Active sidebar page item (`Questions & doubts`) |
| `--bg-slash-menu` | `#151c24` | Floating slash command palette background |
| `--bg-slash-active`| `#16383a` | Active item in slash menu (`Code block`) |
| `--bg-pill-badge` | `#153e44` | Inline highlight badge (`as you write.`) |
| `--accent-cyan` | `#2dd4bf` (Teal-400) | NoteOcean wave logo, active borders, glowing ring |
| `--accent-border` | `#14b8a6` (Teal-500) | 1px border on active sidebar item & active slash item |
| `--accent-glow` | `rgba(45, 212, 191, 0.4)`| Circular glowing drop-shadow on AI Bot button |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)`| Subtle dividers and card outlines |
| `--text-white` | `#f8fafc` | Document title, headings, primary labels |
| `--text-body` | `#cbd5e1` | Paragraph content, list items |
| `--text-muted` | `#8e9fac` | Category headers (`WORKSPACE`, `YOUR PAGES`), shortcuts |
| `--text-cyan` | `#2dd4bf` | Active text in pill badges and active icons |

---

### B. Typography & Font Hierarchy

- **Font Family**: Modern system sans-serif (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Monospace Family**: Monospace font (`ui-monospace, "Fira Code", monospace`).

| Element | Font Size | Font Weight | Color | Line Height |
| :--- | :--- | :--- | :--- | :--- |
| **Page Title** | `2.25rem` (36px) | 700 (Bold) | `#f8fafc` | 1.2 |
| **Heading 2** | `1.5rem` (24px) | 700 (Bold) | `#f8fafc` | 1.3 |
| **Body Text** | `1.0rem` (16px) | 400 (Regular) | `#cbd5e1` | 1.65 |
| **Sidebar Sections**| `0.75rem` (12px)| 600 (Semi-bold, Uppercase)| `#64748b` | 1.4 |
| **Sidebar Page Item**| `0.875rem` (14px)| 500 (Medium) | `#cbd5e1` | 1.4 |
| **Status Indicator**| `0.8125rem` (13px)| 500 (Medium)| `#8e9fac` | 1.4 |
| **Slash Item Label**| `0.875rem` (14px)| 500 (Medium) | `#f8fafc` | 1.4 |

---

## 4. Component Layout & Structural Details

### A. Left Navigation Sidebar
- **Width**: `250px` fixed desktop, collapsable via `|<` button.
- **Top Brand**: NoteOcean wave icon (cyan) + bold white text `"NoteOcean"`.
- **Search Bar**:
  - Rounded pill input with magnifying glass on the left and `"Ctrl K"` badge on the right.
  - Border: `1px solid rgba(255, 255, 255, 0.08)`.
- **Navigation Groups**:
  - `WORKSPACE`: `Home` (house icon), `Quick notes` (file icon), `Favorites` (star icon).
  - `YOUR PAGES`: Has a small `+` icon on the right for immediate page creation.
  - Page list: Shows document icon + title.
  - Active Item: Wrapped in rounded card (`border-radius: 8px; background: #162a2d; border: 1px solid #14b8a6; padding: 6px 10px; color: #f8fafc; font-weight: 500;`). Icon is styled in vibrant cyan.
- **Bottom User Footer**:
  - Circular avatar (32px), text `"Golixco"`, chevron dropdown icon, and settings gear icon on far right.

### B. Top Header Bar
- **Breadcrumbs**: Cyan document icon + `"NoteOcean"` + `" / "` + `"{Page Title}"` (e.g. `Questions & doubts`).
- **Right Utilities**: Star button, Share button, Three dots `...` button.

### C. Main Editor Canvas
- **Centered Column**: Max width `780px`, horizontal auto margin.
- **Left Gutter**:
  - Hovering on a block reveals:
    - `+` button in a small rounded square.
    - 6-dot drag handle icon `:::`.
- **Block Formatting**:
  - Bullet List: Standard bullet point `•` followed by text.
  - Inline Highlight Badge: Dark cyan rounded pill (`background: #153e44; color: #2dd4bf; padding: 2px 8px; border-radius: 6px;`).

### D. Floating Slash Command Palette
- **Position**: Floats directly underneath the active `/code` line.
- **Dimensions**: Width `260px`, rounded corners `10px`, background `#151c24`, border `1px solid rgba(255, 255, 255, 0.1)`.
- **Header**: Search icon `Q` + filter query `/code`.
- **Active Row (`Code block`)**:
  - Background `#16383a`, border `1px solid #14b8a6`, border-radius `6px`.
  - Icon: `< / >` in a cyan box.
  - Right Symbol: Enter key indicator `↵`.
- **Other Rows**:
  - `H1 Heading 1`
  - `::= Bulleted list`
  - `☑ To-do list`
  - `” Quote`

### E. Status Bar (Center-Bottom)
- Centered at the bottom of the viewport:
  - Green/teal circle checkmark icon + text: `All changes saved`.

### F. Floating NoteOcean AI Bot (Bottom-Right)
- **Position**: `fixed; bottom: 24px; right: 24px; z-index: 50;`
- **Trigger Button**:
  - Circular button (`52px` x `52px`).
  - Dark cyan background `#0d1e24` with solid `2px` cyan border `#2dd4bf`.
  - Neon glow drop shadow: `box-shadow: 0 0 20px rgba(45, 212, 191, 0.4)`.
  - Icon: NoteOcean wave sparkle emblem.
- **Tooltip Hover Badge**:
  - Floating pill above the button: `"Ask NoteOcean AI"` (`background: #1e2630; color: #f8fafc; font-size: 12px; padding: 4px 10px; border-radius: 9999px;`).

---

## 5. Responsive Behavior
- **Desktop (>1024px)**: Dual pane (sidebar `250px` + main canvas flex-1).
- **Tablet / Mobile (<1024px)**: Sidebar collapses into a sliding drawer triggered by a hamburger / wave icon. Main canvas takes 100% viewport width with 16px lateral padding.
