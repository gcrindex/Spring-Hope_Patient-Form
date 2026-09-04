# PatientForm vNext — Spring Hope Orthopaedic Clinic

Foundation build for a guided clinical assessment MVP with a premium **Clinical Companion** visual language, Duolingo-inspired patient interaction principles, optional browser voice answering, and a server-side **PesatRouter** AI form assistant.

## Product references

- `docs/PATIENTFORM_AGENT_CONTEXT_UPDATED.md` — infrastructure boundaries, current-state context, safety rules, and the latest provider/voice decisions.
- `docs/PATIENTFORM_PRD_MVP_VNEXT.md` — MVP vNext product requirements and acceptance criteria.
- `docs/REDESIGN_HANDOFF.md` — implementation notes and QA checklist.

## Routes

- `/` — landing / product overview
- `/intake` — assessment intro
- `/intake/question` — one-question-per-screen patient flow with manual + voice input
- `/intake/microphone` — optional browser microphone check
- `/intake/complete` — result and next step
- `/admin` — clinical dashboard
- `/admin/new` — create-form method chooser
- `/admin/new/ai` — AI-Assisted form drafting chat (typed or dictated prompt)
- `/admin/forms-builder` — form builder
- `/admin/forms-builder/publish` — publish/share prototype
- `/api/health` — server health/config state
- `/api/ai/form-draft` — server-only PesatRouter form-draft proxy

## PesatRouter setup

Create a local `.env` from `.env.example` and supply the secret only on the server:

```env
PESATROUTER_API_KEY=
PESATROUTER_BASE_URL=https://api.pesatrouter.com/v1
PESATROUTER_MODEL=pesat-flash
```

Never prefix the key with `VITE_`; that would expose it to browser code.

## Development

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run build
npm run lint
```

## Important MVP boundaries

- Patient voice uses browser-native speech recognition where available and always has manual fallback.
- Admin AI-Assisted voice only converts speech to prompt text; PesatRouter handles AI form drafting through the backend.
- Raw microphone audio is not intentionally persisted by the app.
- AI-generated forms are drafts and require staff review before use/publish.
- PDF/image AI extraction is not claimed working until PesatRouter capability is verified.
- Data remains local/demo-oriented; this package does not claim production authentication, a shared production database, medical diagnosis, HIPAA compliance, or live clinical-system integration.
- Do not deploy into the existing `pesat.app`/audit infrastructure without following the Agent Context deployment rules.
