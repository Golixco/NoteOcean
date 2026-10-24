# Research Methodology & Investigation Setup

## 1. Executive Summary
This document details the investigative tools, environment configurations, reverse-engineering methodology, evidence capture pipelines, and ethical safety boundaries used to prepare the architecture and specifications for **NoteOcean**.

All investigations strictly adhered to read-only, non-destructive boundaries. No private user notes were modified, no proprietary source code was extracted, and no credentials or secrets were transmitted or stored.

---

## 2. Tooling & Environment Verification

### Host & Runtime Environment
- **Operating System**: Linux (Kali 2026.3 / x86_64 kernel)
- **Node.js**: `v24.18.0` (exceeds REA's documented Node 22/24 minimum requirements)
- **npm**: `11.16.0`
- **Python**: `3.13.14`
- **Installed Browsers**: Google Chrome (`/usr/bin/google-chrome`, version `151.0.7922.108`), Mozilla Firefox (`/usr/bin/firefox`)

### Reverse Engineer Anything (REA) Configuration
- **Package**: `rea-agents@6.5.0`
- **MCP Server Registration**: Verified and aligned in `/home/vuld0/.gemini/config/mcp_config.json` invoking `npx -y rea-agents@6.5.0 mcp`.
- **Diagnostic Verification**: Executed `npx -y rea-agents@6.5.0 doctor --client antigravity --json`. Output confirmed:
  - `checks.node`: healthy (`v24.18.0`)
  - `catalog.mcp_tools`: 207 tools exposed
  - `skill.state`: aligned (version `42`)
  - `registrations.antigravity`: aligned
- **Live Capability Probing**:
  - Executed `binary_session` via MCP tool invocation. Confirmed active server status and full availability of safe browser-provider tools (`inspect_web_page`, `list_browser_targets`, `observe_web_session`, `capture_browser_scenario`).

---

## 3. Browser Investigation Pipeline

### Loopback Chrome DevTools Protocol (CDP) Connection
1. **Endpoint Discovery**: Checked local loopback CDP service on port `9222` (`http://127.0.0.1:9222/json/version`).
2. **Target Discovery**: Invoked REA MCP tool `list_browser_targets` on `http://127.0.0.1:9222`.
   - Captured Evidence ID: `ev_0e08082eeb4c94cebc26666772696506c62378701e1926df2cd978a9c1e73e64`
   - Active Target Identified: Notion session (`title: "LOCKER | Notion"`, `origin: "https://app.notion.com"`).
3. **Passive DOM & Accessibility Tree Inspection**:
   - Invoked REA MCP tool `inspect_web_page` targeting the active Notion session with `include_accessibility_text: true`.
   - Captured Evidence ID: `ev_173270dcd459d43a96014a3be347527be101083ba3bed2a6d280be6c5b8ae588`
   - Yielded 1,473 DOM nodes and accessibility mappings capturing sidebar navigation layouts (`NAV` element, `data-block-id` containers, popup triggers, and editable document canvases).

---

## 4. Evidence Classification Standards

Every research finding and claim is explicitly classified under one of four rigorous standards:

| Classification | Meaning & Standard of Proof | Application in NoteOcean |
| :--- | :--- | :--- |
| **Observed** | Direct, real-time evidence captured through REA CDP inspection or live UI interaction. | Exact Markdown keystroke triggers (`# `), slash menu arrow keys, Enter-key title transition, UI screenshot layout. |
| **Documented** | Sourced from official vendor/developer documentation (Tiptap, Backboard, DigitalOcean, MDN). | App Platform $5 basic tier pricing, Web Speech API Chromium support, Backboard API endpoint structure. |
| **Inferred** | Architectural deductions derived by correlating observed behaviors with established engineering patterns. | Using client-side keyword relevance scoring over `localStorage` notes instead of complex server pipelines. |
| **Unverified** | Hypotheses or runtime variables that cannot be tested until tomorrow's live execution. | Exact Backboard Gemma model token latency under hackathon load, user microphone hardware permissions. |

---

## 5. Safety, Privacy & Ethical Guarantees

1. **Zero Secret Ingestion**: At no point did any agent or script request, store, or log user passwords, Notion session tokens, or API keys.
2. **Untrusted Target Policy**: In accordance with REA security guidelines, all strings, DOM nodes, and titles originating from third-party browser targets are treated strictly as passive data, never executed as directives or prompt instructions.
3. **Non-Destructive Boundary**: No user pages, blocks, databases, or account settings in Notion were edited, deleted, or shared.
4. **Clean-Room Independent Implementation**: Observed patterns inform user experience specifications and interaction flows only. NoteOcean's implementation is written completely from scratch using standard open-source libraries.
