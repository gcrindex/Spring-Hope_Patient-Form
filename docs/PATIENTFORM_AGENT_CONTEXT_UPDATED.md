# PatientForm — Agent Context

> **Read this file first** before making any changes. It is the single source of truth for project scope, boundaries, data contracts, and deployment safety.

---

## 1. Purpose and Product Positioning

PatientForm is a **Spring Hope Orthopaedic Clinic** pilot project by **pesat.ai**. Spring Hope is a Singapore orthopaedic practice; this project provides their staff with a digital clinical questionnaire and assessment workflow.

**What it is:**

- A Typeform-style clinical questionnaire/form workflow product.
- Clinics admin creates, edits, and publishes assessment forms.
- Patients fill them digitally on mobile or desktop.
- Patients may also submit a **photo of a completed paper form** as an alternative.
- Staff review submissions with scoring, risk flags, and detail modals.
- Future roadmap: AI-assisted form generation from chat/PDF/image, voice input, PDF export.

**What it is not:**

- It is **not** the general pesat.ai application.
- It is **not** a production multi-user auth/database product -- it is a localStorage interactive MVP.
- It is **not** a replacement for the pesat.ai Cloudflare Workers platform.

---

## 2. Hard Domain and Infrastructure Boundary

This is the most important section. Violating these boundaries can break live services.

### Separate infrastructure

- **pesat.ai** and **pesat.app** are completely separate infrastructure, repos, DNS zones, and Cloudflare configurations.
- **This PatientForm project lives on the pesat.app side** (patient-form workspace within the pesat-app repo context).
- **Never** touch pesat.ai workers, DNS, D1 database, source code, or secrets. Those are out of scope.

### Repository

- Source repo: `https://github.com/emerilansel-jpg/pesat-app`
- Documentation in the repo is the source of truth for pesat.app boundary.

### Two-VPS warning

There are **two separate VPS** instances. Never assume which one is active without inspecting first.

| VPS | IP | Role | Notes |
|---|---|---|---|
| Live audit tunnel VPS | `148.230.103.98` | Caddy (Docker) gateway, Cloudflare Tunnel `0f7602b7` | `/builds/audit` or `/var/www/audit` must be inspected before deploy |
| Separate nginx VPS | `94.100.26.189` | nginx only | May **not** be connected to the live tunnel |

**Never assume which VPS is serving live traffic.** Always inspect the active gateway and tunnel configuration before deploying or testing routes.

### Existing audit apps must be preserved

- The `/audit/` namespace contains multiple existing apps (hanuman, hokahokabento, hokben, cahayabuanagroup, etc.).
- **No global redirects or catch-all route changes** that could break these.
- All existing audit routes must continue to return expected responses after any PatientForm changes.

---

## 3. Current URLs and Status

### Temporary / publicly known routes

| Route | Content |
|---|---|
| `https://audit.pesat.app/patient-form/` | Landing page (`index.html`) |
| `https://audit.pesat.app/admin.html` | Admin SPA (`admin.html`) |
| `https://audit.pesat.app/form.html?id=knee-pain-assessment` | Public patient form renderer |

### Planned canonical namespace

```
https://pesat.app/smart/patient-form/
```

**NOT live yet.** Do not claim this is live until external verification (see Section 4). The Cloudflare Tunnel currently routes `pesat.ai` and `apps.pesat.ai`, but **not** `pesat.app` to the tunnel.

### Apex pesat.app belongs to Cloudflare Pages

- The apex `pesat.app` domain currently serves a Cloudflare Pages showroom/deploy.
- **Never** delete its CNAME casually -- doing so would break the production Pages deployment.

### How to verify a URL is actually live (not stale)

A 200 status or old gallery HTML is **not** proof the latest build is live. You must:

1. Add a cache-busting query parameter (e.g., `?v=1234`).
2. Check the response body for a **known marker** (e.g., a comment, version string, or specific element text).
3. Test at least **two existing audit routes** to confirm they still work.
4. Verify the Cloudflare route, tunnel config, and gateway config all agree.

### Known routing issue history

Stale tunnel configs, wrong VPS targeting, or Worker routes can intercept or serve fallback HTML. If a URL returns unexpected content, inspect in this order:

1. Cloudflare Worker routes (DNS + Workers panel)
2. Cloudflare Tunnel ingress (`config.yml` on VPS)
3. Caddy/nginx gateway config on the active VPS

---

## 4. Local Project Layout

```
patient-form/
  index.html          # Premium SaaS landing page
  admin.html          # Hash-routed SPA: login, dashboard, form list, new-form chooser,
                      #   builder, drag-drop, publish modal, submissions
  form.html           # Public patient renderer: intro/name, questions, scoring,
                      #   results, send submission, EN/ID/ZH translations, paper-photo
  form.html.bak       # Backup of form.html (do not delete)
  assets/
    hero.png          # Large generated hero image
    phone-hand.png    # Large generated phone-in-hand image
    dashboard.png     # Large generated dashboard screenshot

  patient-form-server/              # Server-side AI proxy (NOT frontend)
    server.js                       # Express server, AI proxy endpoints
    package.json
    package-lock.json
    .env.example                    # Template for env vars
    .gitignore
    README.md                       # API docs, setup, security
    node_modules/
```

### Sibling workspace context

The local workspace at `D:/Claude Cowork/Pesat Business Audit/spring-hope-audit/` also contains:

- `deploy-task.md` -- Full deployment runbook and VPS state documentation.
- `patient-form-server/` -- The server-side proxy (see Section 7).
- `coldstart/coldstart.md` -- Cold-start context for this project.

### Asset notes

- `hero.png`, `phone-hand.png`, `dashboard.png` are large generated PNGs.
- Optimize only with a backup of the originals. After optimization, verify all HTML references to these files still resolve correctly (search for the filenames in `index.html` and `admin.html`).

---

## 5. Implemented UX and Features

### Landing page (`index.html`)

- Premium SaaS motion design with scroll-triggered animations.
- Generated imagery (hero, phone-hand, dashboard).
- Bento grid feature section showing AI, PDF, scan, voice, and manual options.
- Paper forms still welcome message.
- Responsive layout, mobile-safe.

### Admin SPA (`admin.html`)

- **Hash-routed SPA** -- all navigation via `#/login`, `#/dashboard`, `#/builder/:id`, `#/submissions/:id`, etc.
- **Demo login** -- session-based (sessionStorage), no real auth.
- **Dashboard** -- stat cards (total forms, total submissions, high/moderate/low risk counts, average score), recent submissions table with risk pills.
- **Form list** -- all forms with status, submission count, created/updated dates.
- **New Form chooser** -- four modes: AI-assisted (chat), standard (manual), PDF upload, scan image upload.
- **Form builder** -- drag-and-drop question reorder, add/edit/delete questions, question types (choice, yesno, scale, text), phone preview frame.
- **Publish modal** -- generates a shareable link with the form slug as `?id=`.
- **Submissions table** -- sortable by date, risk pill, patient name, score.
- **Submission detail modal** -- full answers breakdown, risk assessment, mock "Send to Plato" button.
- **AI modal** -- chat interface, form preview, "Use This Form" action.
- **Upload modal** -- PDF and image upload with drag-and-drop zone.
- **Toast notifications** for user feedback.

### Patient form (`form.html`)

- **One-question-per-screen** flow (0 = intro, 1..N = questions, N+1 = results).
- **Auto-advance** on choice selection.
- **Scale** slider with continue button.
- **Yes/No** buttons.
- **Free text** input.
- **Scoring and risk assessment** (see Section 6).
- **Results screen** with score, risk level, next steps, disclaimer.
- **Send to Spring Hope** action (mock -- stores locally, no real backend).
- **Paper photo upload** -- camera capture option, with truthful review confirmation checkbox.
- **Mobile-safe layout** -- tested at 320/360/390/414 widths.
- **Translations** -- English (`en`), Indonesian (`id`), Simplified Chinese (`zh`). Stored in `pf_lang` localStorage key.

---

## 6. LocalStorage Data Contracts

### `pf_forms` (array of form objects)

```json
[
  {
    "id": "knee-pain-assessment",
    "title": "Knee Pain Assessment",
    "status": "published",
    "submissions": 34,
    "createdAt": "2026-08-01T00:00:00.000Z",
    "updatedAt": "2026-08-22T00:00:00.000Z",
    "questions": [
      {
        "id": "q1",
        "text": "How old are you?",
        "type": "choice",
        "options": [
          { "label": "Under 30", "score": 1 },
          { "label": "30-44", "score": 2 },
          { "label": "45-64", "score": 3 },
          { "label": "65 or older", "score": 4 }
        ]
      },
      {
        "id": "q_pain",
        "text": "Rate your pain level",
        "type": "scale",
        "max": 10
      },
      {
        "id": "q_swelling",
        "text": "Do you have swelling in your knee?",
        "type": "yesno",
        "options": [
          { "label": "Yes", "score": 12 },
          { "label": "No", "score": 0 }
        ]
      },
      {
        "id": "q_notes",
        "text": "Any additional notes?",
        "type": "text"
      }
    ]
  }
]
```

**Question types:**

| Type | Options field | Score source |
|---|---|---|
| `choice` | Required: array of `{label, score}` | Matched option's `score` value |
| `yesno` | `[{label:"Yes",score:12},{label:"No",score:0}]` | Yes = 12, No = 0 |
| `scale` | `max: 10` | `scale_value * 3` |
| `text` | None | 0 (unless real processing added later) |

### `pf_submissions` (array of submission objects)

```json
[
  {
    "id": "sub_1",
    "formId": "knee-pain-assessment",
    "patientName": "Tan Wei Ling",
    "submittedAt": "2026-08-22T10:30:00Z",
    "answers": {
      "q1": 3,
      "q2": 2,
      "q_pain": 5,
      "q_swelling": "no",
      "q_locking": "no",
      "q_instability": "no",
      "q_activity": 2,
      "q_injury": "no"
    },
    "score": 52,
    "risk": "mod"
  }
]
```

**Risk level thresholds:**

| Score range | Risk value | Display |
|---|---|---|
| 0 -- 30 | `low` | Green pill, "Low Risk" |
| 31 -- 60 | `mod` | Amber pill, "Moderate" |
| 61+ | `high` | Red pill, "High Risk" |

### `pf_lang` (string)

```
"en" | "id" | "zh"
```

Default: `"en"`. Used by `form.html` to switch all UI strings via the `I18N` lookup object.

### `pf_pending_papers` (array, form.html only)

```json
[
  {
    "formId": "knee-pain-assessment",
    "timestamp": "2026-08-22T10:30:00Z"
  }
]
```

Tracks paper-photo submissions that were captured but cannot be uploaded in a localStorage MVP.

### Stable slug IDs

Form IDs **must** be stable slugs derived from the title:

- `knee-pain-assessment`
- `hip-function-score`
- `post-surgery-follow-up`

**Do not reintroduce** old prefix-style IDs like `f_knee`. The `slugify()` function in admin.html generates these consistently.

### Important caveat

localStorage is **browser-local** and **not multi-user production persistence**. Data is per-browser, per-device. There is no shared database. This is an MVP/demo constraint, not a bug.

---

## 7. AI/PDF/Image/Voice Proxy Contract

### Server location

- Local: `patient-form-server/` (sibling to the frontend files)
- Production: `/opt/patient-form-server/` on VPS `148.230.103.98`
- Port: `3010` (port 3001 is taken by SeoTool)

### API base URL

- Planned canonical: `/smart/patient-form/api/` (via Caddy `handle_path` reverse proxy to `127.0.0.1:3010`)
- Existing: `/patient-form-server/` -- only use after route verification on the active VPS.
- The frontend currently calls the server via relative path or hardcoded origin.

### Endpoints

| Method | Path | Purpose | Request | Response |
|---|---|---|---|---|
| GET | `/api/health` | Health check | -- | `{status, timestamp, pesatRouterConfigured}` |
| POST | `/api/ai/form-draft` | AI form generation | `{mode:"chat", messages:[...]}` | `{success, form:{title, questions}}` |
| POST | `/api/ai/extract-pdf` | PDF text extraction + AI | Multipart `file` (PDF, max 10MB) | `{success, form, extractedTextPreview}` |
| POST | `/api/ai/extract-image` | Image vision + AI | Multipart `file` (PNG/JPEG/WebP, max 10MB) | `{success, form}` |

### Environment variables (server-side only)

| Variable | Required | Purpose |
|---|---|---|
| `PESATROUTER_API_KEY` | Yes | Server-side API key for PesatRouter |
| `PESATROUTER_BASE_URL` | No | Defaults to `https://api.pesatrouter.com/v1` |
| `PESATROUTER_MODEL` | No | Model name, defaults to `pesat-flash` |
| `PORT` | No | Server port, defaults to `3001` (production uses `3010`) |

**Never expose these in frontend code, logs, chat output, or documentation.** Variable names only, no values.

### Error contract

When the AI provider is not configured (env vars missing), the server returns:

```json
{
  "success": false,
  "error": "AI_PROVIDER_NOT_CONFIGURED",
  "message": "AI service is not configured."
}
```

Status: `503`. The server **never** pretends success when the provider is down. No provider details leak in the error message.

### Voice support

Voice is an **input method**, not a separate create-form mode.

- Patient assessment voice uses browser speech recognition where supported, with manual fallback at all times.
- Admin AI-Assisted chat may also use browser speech recognition to turn a spoken prompt into text.
- The resulting text prompt is then sent through the normal server-side AI form-draft endpoint.
- Raw microphone audio is not persisted by the MVP.
- Do not route a PesatRouter API key to the browser.

Voice recognition and AI generation are separate responsibilities: speech-to-text captures the user's words; PesatRouter is used for AI form drafting.

### PDF extraction

The `/api/ai/extract-pdf` endpoint depends on the `pdf-parse` npm package. If not installed, it returns `501 NO_EXTRACTION_ENGINE` with a hint to use chat mode instead. Do not fake success.

### AI provider adapter

The vNext foundation uses **PesatRouter** through its OpenAI-compatible chat-completions endpoint:

- Base: `https://api.pesatrouter.com/v1`
- Chat path: `/chat/completions`
- Default model: `pesat-flash`
- Authentication: Bearer token, server-side only

Frontend code calls only the internal `/api/ai/form-draft` route. The server validates both the request and generated JSON before returning a form draft. If the provider is unavailable or returns invalid output, return a controlled error and never pretend success.

---

## 8. Deployment Safety and Runbook

### Pre-deployment checklist

1. **Backup** current app files and Caddy config outside the web root:
   ```bash
   ssh pesat-vps 'TIMESTAMP=$(date +%Y%m%d_%H%M%S); BACKUP_DIR="/var/backups/pesat/$TIMESTAMP"; mkdir -p "$BACKUP_DIR/caddy"; cp /opt/gateway/Caddyfile "$BACKUP_DIR/caddy/Caddyfile"'
   ```
2. **Inspect** active gateway (Caddy on `148.230.103.98`, Docker container `gateway-caddy`). Confirm it is the VPS handling live traffic.
3. **Inspect** Cloudflare Tunnel config (`/root/.cloudflared/config.yml` on VPS).
4. **Stage** new files to a temp location first.
5. **Validate** config before reload: `docker exec gateway-caddy caddy validate --config /etc/caddy/Caddyfile` or equivalent Caddy syntax check.
6. **Reload** -- use `docker restart gateway-caddy` (not a blind restart of unrelated services).
7. **Verify** new route with cache-busting (`?v=<timestamp>`).
8. **Test** at least two existing audit routes (`/audit/hokben/`, `/audit/hanuman/`).
9. **Record** rollback steps and backup path.

### Rollback

```bash
# Find latest backup
ls -t /var/backups/pesat/ | head -1

# Restore and restart
cp /var/backups/pesat/LATEST/caddy/Caddyfile /opt/gateway/Caddyfile
docker restart gateway-caddy
```

### Hard rules

- **Do not delete** the old patient-form deployment at `/builds/audit/patient-form/` until explicit approval.
- **Do not touch** `pesat.ai` or any unrelated routes.
- **Do not use nginx** on the audit VPS -- it is installed but dead/disabled. Use Caddy.
- **Do not assume** port availability -- 3001 is taken by SeoTool; patient-form-server uses 3010.

---

## 9. QA Checklist for Next Agent

### Browser automation rules

- **Microsoft Edge only** if browser automation is needed.
- Use the **existing Edge/CDP window only** via `cdp-bridge.js`. No Chrome, Chromium, Playwright, or Glance.
- Never spawn a new browser window.

### Functional testing

- [ ] Admin login with demo credentials
- [ ] New Form chooser: all four modes visible and clickable
- [ ] Standard form builder: add question, edit, delete, drag reorder
- [ ] Publish modal: generates correct slug link
- [ ] Open public form via published link
- [ ] Patient form flow: intro, all questions, scoring, results
- [ ] Submissions table: rows visible, click opens detail modal
- [ ] Submission detail modal: answers, risk pill, mock send action
- [ ] Paper photo upload: camera capture, review confirmation
- [ ] Language switch: EN, ID, ZH all render correctly
- [ ] Scoring: choice picks correct score, scale multiplies by 3, yes=12/no=0
- [ ] Send action: confirmation UI shows
- [ ] Console: no JavaScript errors

### Mobile testing

- [ ] 320px width: no horizontal overflow, content readable
- [ ] 360px width: same
- [ ] 390px width: same
- [ ] 414px width: same
- [ ] Vertical scroll: all content accessible
- [ ] Horizontal table scroll: submissions table scrolls if wider than viewport
- [ ] Safe area: no overlay or fixed element intercepting taps
- [ ] Form progress bar renders correctly

### Security

- [ ] No secrets (API keys, tokens, passwords) in frontend code
- [ ] XSS test: submit `<script>alert(1)</script>` in text fields -- should not execute
- [ ] API errors: controlled JSON responses, no stack traces
- [ ] No destructive route changes to existing audit apps
- [ ] CORS: only allowed origins can reach the API

### Build verification

- [ ] HTML/JS syntax valid (no unclosed tags, no syntax errors)
- [ ] All asset references resolve (hero.png, phone-hand.png, dashboard.png)
- [ ] Form seeded data loads correctly on first visit

---

## 10. Known Limitations / Do Not Overclaim

| Claim | Reality |
|---|---|
| "Multi-user auth system" | **No.** Demo login is sessionStorage-only, not production auth. |
| "Database-backed" | **No.** All data is localStorage, browser-local, not shared. |
| "Send to Plato" | **Mock only.** Shows confirmation UI but does not actually transmit data unless a real API contract is implemented. |
| "AI form generation is live" | **Only when server env vars are configured** and PesatRouter is reachable. Otherwise shows a controlled error. |
| "PDF/image extraction works" | **Only when `pdf-parse` is installed** (PDF) and the AI provider is configured (both). Voice is explicitly not implemented. |
| "Public URL is live" | **Must be externally verified.** An origin 200 response is insufficient -- the URL must work through Cloudflare's CDN, with correct tunnel/route config. |
| "Patient data is secure" | **MVP limitation.** localStorage data stays on the device. No encryption, no server-side persistence, no HIPAA compliance. |

---

## 11. Handoff Rules and First Actions for New Agent

### First steps (in order)

1. **Read this file** (`PATIENTFORM_AGENT_CONTEXT.md`) completely.
2. **Read repo docs:**
   - `docs/coldstart.md`
   - `docs/domain-boundaries.md`
   - `docs/routing-matrix.md`
   - `docs/skills/pesat-app-agent.md`
   (These may not exist locally yet -- check the repo.)
3. **Inspect git status** and active deployment state before any edits.
4. **Understand the current VPS state** by reading `deploy-task.md` in the workspace.

### Working rules

- **Keep changes small.** One focused fix or feature per session.
- **Backup before deploy.** Every time, no exceptions.
- **Update coldstart docs** after major work so the next agent has accurate context.
- **Report exact files changed** and deployment status when done.
- **Ask before any destructive DNS, Worker, or tunnel changes.**

### Escalation triggers

Stop and ask the human if any of these come up:

- A change affects `pesat.ai` or its routes.
- A change affects Cloudflare DNS records or Workers.
- A change affects the apex `pesat.app` CNAME or Cloudflare Pages.
- You need to modify the Cloudflare Tunnel ingress.
- You are unsure which VPS is serving live traffic.

---

## Do Not Do

These are absolute prohibitions. Violating them can break production services.

1. **No pesat.ai edits.** Do not modify, deploy, or reference pesat.ai workers, DNS, D1, source code, or secrets. Entirely out of scope.
2. **No secret handling in chat or frontend.** API keys, tokens, passwords, and connection strings must never appear in frontend code, chat output, logs, screenshots, or documentation. Variable names only (`PESATROUTER_API_KEY`), never values.
3. **No global catch-all redirects.** Existing audit routes must keep working. Any catch-all change must preserve `/audit/*`, `/smart/*`, and other namespaces.
4. **No claim of live without external proof.** An origin 200 is not proof. The URL must work through Cloudflare with correct tunnel/route config. Verify externally.
5. **No delete/recreate before restore/backup.** Always back up current config and files before any deployment. Always have a rollback path.
6. **No nginx on the audit VPS.** It is installed but dead/disabled. Use Caddy only.
7. **No Playwright/Glance/new browser windows.** Browser work uses the existing Edge CDP bridge only.

---

## 12. MVP vNext Product Direction — Leader Addition (2026-09-03)

> **Status:** This section defines the **next MVP target** requested by the project leader. It does **not** describe the current live implementation. Sections 1–11 remain the source of truth for current infrastructure, deployment boundaries, current data contracts, and safety rules.

### Leader direction

The next MVP must:

1. Preserve the core PatientForm product concept and existing demo flow.
2. Redesign the **patient answering experience** using **Duolingo-inspired interaction principles**: one task at a time, clear progress, low cognitive load, large tappable controls, encouraging micro-feedback, and a mobile-first feel.
3. Allow patients to **answer/fill the form using voice** in addition to tap/keyboard input.
4. Remain an MVP: do not overclaim production authentication, production database persistence, clinical compliance, or live integrations that are not actually implemented.

### Existing demo routes used as the visual/product baseline

- Landing: `https://pesat.app/audit/patient-form/`
- Patient form: `https://pesat.app/audit/patient-form/form.html?id=knee-pain-assessment`
- Admin: `https://pesat.app/audit/patient-form/admin.html`

### Demo observations / baseline behavior

The current demo establishes three product surfaces:

- **Landing / clinic-facing marketing:** clean blue/white SaaS presentation, product explanation, comparison of old vs new workflow, feature/integration sections, how-it-works steps, and demo CTA.
- **Patient experience:** a focused, one-question-per-screen assessment with a top progress indicator, language controls, large answer options, scale/yes-no/choice questions, and a final risk/result card.
- **Admin experience:** clinic login, left-side navigation, summary stat cards, form list/table, publication state, submission access, and form actions.

The next MVP should **evolve** this visual baseline rather than blindly clone the current UI.

---

## 13. Target Patient UX — Duolingo-Inspired, Not a Visual Clone

The goal is to borrow the **interaction model**, not Duolingo branding, mascot, copyrighted illustrations, or a pixel-for-pixel visual identity.

### Core UX principles

- One primary decision per screen.
- Large touch targets and obvious primary action.
- Persistent but unobtrusive progress at the top.
- Short, conversational question copy.
- Immediate visual acknowledgement after an answer.
- Clear disabled/enabled states for Continue.
- Smooth transitions between questions.
- Friendly microcopy without making clinical claims playful or trivial.
- High readability for older patients and mobile users.
- Voice is a first-class input method, not a hidden accessibility afterthought.
- Tap/keyboard must always remain available as fallback.

### Suggested patient flow

1. **Welcome / start choice**
   - Start digital assessment.
   - Existing paper-photo path may remain available where relevant.
2. **Name / basic intro**
   - Explain that voice is optional.
   - Ask for microphone permission only when the user activates voice, not immediately on page load.
3. **Question loop**
   - Question text.
   - Answer controls appropriate to question type.
   - Voice control.
   - Visual recognition/transcription state when voice is active.
   - Confirm/continue state.
4. **Completion moment**
   - Lightweight positive completion feedback.
   - No gamification that trivializes medical risk.
5. **Result / next step**
   - Score/risk representation follows the current scoring contract unless the scoring model is intentionally revised.
   - Clear clinical disclaimer and next-step instruction.

### Interaction states per question

Every question screen should define at least:

- `idle`
- `listening`
- `processing`
- `recognized`
- `selected`
- `validation_error`
- `voice_permission_denied`
- `voice_not_supported`

---

## 14. Voice Input MVP Contract

### Purpose

Voice input enables a patient to answer without needing to tap every control or type free text. It must complement, not replace, normal form controls.

### Required voice behavior

- A clearly visible microphone button is available on answerable question screens.
- The patient explicitly starts and stops voice capture.
- While listening, the UI shows an unmistakable listening state (for example: pulse/waveform + `Listening…`).
- A recognized transcript is shown before or at the same time as the answer is mapped.
- The patient can correct the result using normal controls.
- Voice errors must never block the form; fallback input remains usable.
- The MVP must not claim that raw audio is securely stored or clinically archived.

### Mapping voice to question types

| Question type | Voice behavior |
|---|---|
| `choice` | Recognize the spoken option and map it to the closest valid option. Show the selected option visibly before continuing. |
| `yesno` | Map common yes/no expressions in the active language to Yes/No. Never silently continue if recognition is ambiguous. |
| `scale` | Parse a valid spoken number within the scale range, update the slider/value, and show the parsed number. |
| `text` | Use speech-to-text dictation and place the transcript in the text field for review/editing. |

### Multilingual requirement

Voice must follow the currently selected patient language when technically supported:

- English (`en`)
- Indonesian (`id`)
- Simplified Chinese (`zh`)

If a browser/provider cannot support the selected language, the UI must explain the limitation and keep manual input available.

### Voice MVP implementation options

For a standalone prototype generated in v0/Lovable:

- Prefer a **voice adapter abstraction** so the UI is not tightly coupled to one provider.
- A browser-native speech recognition implementation may be used for a demo if supported by the target browser, with graceful fallback when unavailable.
- A production-grade STT provider can be integrated later through the server-side proxy without exposing provider secrets in frontend code.

### Privacy / safety rules

- Do not store raw microphone audio in localStorage.
- Do not place API keys or provider tokens in frontend code.
- Do not claim HIPAA/medical compliance.
- Do not send patient data to an external AI/STT provider unless that integration is explicitly approved and documented.
- If an external provider is introduced later, add a provider/data-flow review before production use.

---

## 15. MVP vNext Functional Scope

### Must have

#### Patient

- Mobile-first responsive experience.
- Language switch: EN / ID / ZH.
- One-question-per-screen assessment.
- Choice, yes/no, scale, and free-text question types.
- Progress indicator.
- Voice input as specified in Section 14.
- Manual fallback for every voice-capable question.
- Existing scoring/risk behavior unless product owner explicitly changes it.
- Completion/results screen with disclaimer and next step.

#### Admin

- Demo login only unless real auth is separately approved.
- Dashboard summary.
- Form list.
- Create/edit a basic form.
- Publish/shareable form link behavior.
- View submissions and submission detail.
- Keep admin UX clean and efficient; Duolingo-style gamification is primarily for the **patient flow**, not the clinical operations dashboard.

#### Landing

- Explain the product clearly.
- Provide a direct path into the demo assessment.
- Preserve a professional clinical/SaaS tone.
- Responsive on desktop and mobile.

### Should have

- Smooth screen transitions.
- Friendly answer acknowledgement/micro-feedback.
- Resume current assessment on accidental refresh where practical.
- Voice capability/permission status messaging.
- Keyboard accessibility and visible focus states.

### Out of scope for this MVP unless separately requested

- Production multi-user authentication.
- Production shared database.
- HIPAA/compliance claims.
- Real Plato integration.
- Real payment/billing.
- Production analytics stack.
- Rebuilding unrelated `pesat.ai` services.
- Destructive Cloudflare/DNS/tunnel changes.
- PDF extraction and image/vision extraction remain out of scope until provider capability is explicitly verified. **AI-Assisted chat/form drafting is now in scope using PesatRouter**, per the leader's added requirement.

---

## 16. MVP vNext Acceptance Criteria

### Patient UX

- [ ] A new user can start and complete the demo assessment on a 360px-wide mobile viewport without horizontal overflow.
- [ ] Only one primary question/task is presented at a time.
- [ ] Progress is visible throughout the question flow.
- [ ] Choice, yes/no, scale, and text questions can all be completed manually.
- [ ] Voice can be activated from the question flow where supported.
- [ ] Voice transcript/recognized answer is visibly reviewable.
- [ ] The user can correct a voice-derived answer manually.
- [ ] Denied microphone permission does not break the assessment.
- [ ] Unsupported voice capability produces a clear fallback message.
- [ ] EN/ID/ZH UI switching does not break layout or question flow.
- [ ] Result screen displays the calculated result/risk using the current scoring contract.

### Admin

- [ ] AI-Assisted appears as a create-form method and opens an admin chat experience.
- [ ] Admin can type or speak a prompt; voice only populates the prompt and does not bypass staff review.
- [ ] `/api/ai/form-draft` calls PesatRouter server-side and no provider secret is exposed in browser code.
- [ ] Generated draft is validated and must be explicitly accepted before entering the builder.
- [ ] Admin demo login works.
- [ ] Forms can be listed and opened.
- [ ] A basic form can be created/edited.
- [ ] A public form link can be generated/opened.
- [ ] Submission list and detail are visible.

### Safety / technical

- [ ] No secret values appear in frontend source, browser logs, screenshots, or docs.
- [ ] No raw microphone audio is persisted in localStorage.
- [ ] Existing `pesat.ai` infrastructure is untouched.
- [ ] A standalone prototype is not described as production/live until externally verified.
- [ ] Any later integration into the existing deployment follows Sections 2, 3, 8, 9, and 11 of this document.

---

## 17. Recommended Build Sequence for v0 / Lovable Prototype

1. Build the **patient flow first** with seeded Knee Pain Assessment data.
2. Complete manual interactions for all question types.
3. Add Duolingo-inspired progress, transitions, feedback states, and mobile polish.
4. Add the voice adapter and browser-supported speech recognition with manual fallback.
5. Add completion/results flow.
6. Build the minimal admin/dashboard parity needed for the MVP.
7. Add/refine the landing page last.
8. Run responsive, accessibility, error-state, and voice-permission QA.
9. Export/review code before any integration with the existing repo.
10. Do not deploy to the existing production/audit infrastructure without following the deployment runbook and obtaining approval for any boundary-changing action.

---

## 18. Handoff Rule for Generated MVPs

Any prototype generated by v0, Lovable, or another code-generation tool must be treated as **untrusted draft code until reviewed**.

Before integration:

- Review all dependencies.
- Remove generated secrets/placeholders.
- Confirm no external data collection was added implicitly.
- Confirm no analytics/tracking was added without approval.
- Validate voice behavior and fallback paths.
- Preserve current form IDs/data contracts where compatibility matters.
- Compare generated routes against the existing routing boundaries.
- Keep the prototype isolated until code review is complete.

