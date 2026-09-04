# PatientForm vNext — Redesign Handoff

## Design direction

The implementation in this package follows the agreed direction:

- **Clinical Companion visual language**: premium, calm, trustworthy healthcare SaaS.
- **Duolingo-inspired patient interaction quality**: one task per screen, obvious progress, large answer targets, immediate acknowledgement, short microcopy, and low cognitive load. This is an interaction reference only, not a visual/brand clone.
- **Voice as a first-class input**: browser-native speech recognition where supported, with listening, processing, recognized, error, retry, and manual fallback states.
- **Professional admin UX**: operational SaaS rather than patient-side gamification.

## What changed

### Landing
- Rebuilt the landing page from scratch with stronger product storytelling, interactive patient preview, voice demonstration, workflow section, admin preview, responsive CTA hierarchy, and a more premium visual system.
- Removed dependency on remote hero/product image assets; product previews are native UI/CSS so they stay consistent and lightweight.

### Patient assessment
- Rebuilt the start, question, microphone-check, and completion screens.
- Mobile-first one-question-per-screen flow.
- EN / ID / Simplified Chinese UI and question content.
- Choice, yes/no, 0–10 scale, and free-text inputs.
- Persistent progress and question count.
- Local resume data using existing `pf_*`-style localStorage keys.
- Existing risk thresholds remain: 0–30 low, 31–60 moderate, 61+ high.

### Voice
- Added a reusable browser speech-recognition hook.
- Voice locale follows selected language (`en-SG`, `id-ID`, `zh-CN`).
- Choice/yes-no answers are mapped to valid options.
- Scale speech parses 0–10.
- Free-text speech appends editable transcript.
- Unsupported/denied/no-speech states preserve manual input.
- No raw microphone audio is persisted.

### Admin
- Rebuilt dashboard, forms builder, patient preview, and publish/share screen with a compact professional clinical-SaaS direction.
- Dashboard reads demo/local submission data.
- Form builder keeps the core supported question types and shows a patient mobile preview.
- Publish screen is explicitly presented as MVP behavior and does not overclaim live production integration.

## Technical notes

- Existing TanStack Start route paths were preserved.
- No new runtime dependency was added, so the package can continue using the existing dependency lockfile.
- Motion is implemented with lightweight CSS state transitions/animations in this package because no additional animation dependency was added. The interaction structure is ready for a later Motion-for-React pass if that dependency is approved and installed.
- No deployment, Cloudflare, DNS, tunnel, `pesat.ai`, or VPS configuration was changed.

## QA performed in this handoff

- All project TypeScript/TSX sources were syntax-transpiled with the TypeScript compiler API: no syntax errors.
- Source tree checked for secret values introduced by this redesign: none intentionally added.
- Output ZIP is flat at project root for Robocopy use; it does **not** wrap files in an extra `spring-hope-project/` directory.

## QA still required after `npm install`

Because this handoff environment did not have the project npm dependencies installed, run locally:

```bash
npm install
npm run build
npm run lint
npm run dev
```

Then manually test:

- 320 / 360 / 390 / 414 mobile widths.
- EN / ID / 中文 language switching.
- Choice / yes-no / scale / free-text manual completion.
- Voice in a supported Edge/Chrome browser.
- Microphone denied and unsupported fallbacks.
- Result score/risk.
- Admin dashboard, builder and publish views.

## Foundation update — PesatRouter + AI-Assisted

- Added `/admin/new` as the create-form method chooser.
- Added `/admin/new/ai` as a chat-based AI form assistant.
- The AI composer supports typed prompts and optional browser speech-to-text; voice is not a separate create-form menu.
- Added server-only `/api/ai/form-draft` proxy for PesatRouter using the OpenAI-compatible chat-completions contract.
- Default model is `pesat-flash`; secrets are read only from `PESATROUTER_*` server environment variables.
- Added schema validation for generated multilingual form drafts before they can be passed to the builder.
- PDF and image creation cards remain present but intentionally communicate that extraction capability must be verified before being enabled.
- Motion remains purposeful and lightweight: progressive section reveals, card feedback, patient question transitions, progress motion, microphone pulse/waveform, and reduced-motion support.
