# PatientForm QA / Fix Notes — 2026-09-03

## Fixed
- Added `.gitignore` so local environment files, dependencies, build output, logs, and editor files are not committed accidentally.
- Removed `.env.local` from the handoff ZIP. Keep real server/API secrets only in the local/server environment; `.env.example` remains the template.
- Hardened browser speech-recognition lifecycle: old recognition sessions are aborted, delayed completion callbacks are cancelled on reset/unmount, and stale sessions cannot update a later question.
- Replaced `any`-based Web Speech hook declarations with local typed interfaces.
- Limited dictated/free-text answers to the displayed 500-character limit.
- Fixed misleading admin navigation: Submissions and Analytics now jump to real dashboard sections; Patients, Settings, notifications are explicitly disabled/planned instead of pretending to work.
- Removed the dead row overflow action from the submissions table.
- Paper-photo action is now explicitly marked as not implemented rather than being a clickable no-op.
- Publish actions that are not implemented (direct send and QR generation) are explicitly disabled/planned instead of fake-clickable.

## Verification notes
- Source-level QA was performed against the supplied project and project handoff documents.
- The supplied ZIP contained platform-specific `node_modules`; its Rolldown native binding could not run in this Linux sandbox.
- A clean dependency reinstall could not complete because package download access timed out in the sandbox, so final `vite build` / full ESLint could not be rerun here.
- Before local deployment, run `npm ci` (or `npm install`), then `npm run build`, `npm run lint`, and `npm run dev` on the target machine.
- Voice runtime must be tested in current Edge/Chrome with microphone permission because Web Speech API support is browser/device dependent.
