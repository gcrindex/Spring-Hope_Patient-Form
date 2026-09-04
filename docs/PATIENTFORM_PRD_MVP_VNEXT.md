# PatientForm — Product Requirements Document (MVP vNext)

**Version:** 0.1  
**Date:** 2026-09-03  
**Status:** Draft for MVP build  
**Product:** PatientForm — Spring Hope Orthopaedic Clinic pilot  
**Primary goal:** Rebuild/evolve the existing PatientForm demo into a more engaging, mobile-first assessment experience with Duolingo-inspired interaction patterns and optional voice answering.

---

## 1. Executive Summary

PatientForm is a clinical questionnaire workflow for Spring Hope Orthopaedic Clinic. The existing demo already includes a landing page, patient questionnaire, scoring/risk result, and an admin interface for forms/submissions.

The next MVP should preserve that core product flow while improving the patient experience so it feels simpler, more guided, and more engaging. The interaction should take inspiration from Duolingo's one-step-at-a-time learning flow, but must remain appropriate for a clinical context and must not visually clone Duolingo.

A new requirement is **voice answering**. Patients should be able to speak an answer, see what was recognized, and correct it before moving on. Manual input must always remain available.

This MVP is still a prototype. It must not claim production authentication, production database persistence, HIPAA compliance, or live integrations that have not actually been implemented.

---

## 2. Background / Existing Product

### Existing demo surfaces

1. **Landing**  
   `https://pesat.app/audit/patient-form/`

2. **Patient assessment**  
   `https://pesat.app/audit/patient-form/form.html?id=knee-pain-assessment`

3. **Admin**  
   `https://pesat.app/audit/patient-form/admin.html`

### Existing product behavior

The current demo provides:

- Clinic-facing SaaS landing page.
- One-question-per-screen patient assessment.
- Choice, yes/no, scale, and text input types.
- Progress indicator.
- EN / ID / ZH language switching.
- Score calculation and risk output.
- Paper-form/photo alternative path.
- Admin login demo.
- Admin dashboard and form list.
- Form editing/publishing concepts.
- Submission list/detail concepts.

### Current technical limitations

- Demo auth only.
- Browser-local persistence via localStorage.
- No shared production database.
- No production clinical compliance claim.
- Voice is not implemented in the current application.
- Some AI/PDF/image features depend on server/provider configuration and are not required for this iteration.

---

## 3. Product Problem

The current patient form is functional and already uses one-question-per-screen interaction, but it still feels like a conventional clinical form presented more cleanly.

The MVP should reduce friction by making every step obvious, focused, and reassuring. It should be especially comfortable on mobile and for users who may prefer speaking rather than typing or tapping through every field.

---

## 4. Product Goals

### Primary goals

- Make the patient assessment feel guided and effortless.
- Preserve clinical professionalism while increasing engagement.
- Make the experience excellent on mobile.
- Add optional voice input across supported question types.
- Keep manual input available at all times.
- Preserve existing scoring/risk logic unless explicitly changed.
- Maintain clear separation from production infrastructure and sensitive systems.

### Secondary goals

- Improve accessibility and readability.
- Make progress and completion feel clear.
- Reduce perceived effort and abandonment risk.
- Keep admin workflows simple and practical.

---

## 5. Non-Goals for This MVP

The following are not required unless separately approved:

- Production multi-user authentication.
- Production database migration.
- HIPAA or regulatory compliance certification.
- Real Plato integration.
- Billing/payment system.
- Full analytics platform.
- Real AI form generation.
- Production PDF/image extraction.
- Voice audio storage.
- Destructive changes to Cloudflare, DNS, tunnel, or unrelated infrastructure.
- Rebuilding unrelated `pesat.ai` systems.

---

## 6. Target Users

### Patient

A patient completing a clinical assessment on mobile or desktop, potentially with limited technical confidence or a preference for speaking instead of typing.

### Clinic staff/admin

Staff who create/manage forms, publish assessment links, and review submissions/results.

### Product/demo viewer

A stakeholder or clinic representative viewing the landing page and demo to understand the product value.

---

## 7. UX Direction

### Design principle

Use **Duolingo-inspired interaction principles**, not Duolingo branding or a visual clone.

### Desired characteristics

- One primary task per screen.
- Large, obvious controls.
- Rounded, friendly UI without becoming childish.
- Strong visual hierarchy.
- Clear progress at the top.
- Smooth question-to-question transitions.
- Immediate acknowledgement after an answer.
- Short, conversational copy.
- Minimal cognitive load.
- Strong mobile ergonomics.
- High contrast and readable typography.
- Clinical seriousness preserved for warnings, risk, and result screens.

### Tone

Friendly, calm, reassuring, concise, and professional.

Avoid:

- Cartoonish clinical risk messaging.
- Over-celebration of medical outcomes.
- Claims that the form diagnoses a condition.

---

## 8. Information Architecture

### Public / patient

- Landing
- Assessment start
- Start method selection
- Patient intro/name
- Question flow
- Completion
- Results / next steps

### Admin

- Login
- Dashboard
- Forms
- Form builder
- Publish/share link
- Submissions
- Submission detail

---

## 9. Core Patient Flow

### 9.1 Landing to assessment

- User sees clear primary CTA: **Try Demo Form** / equivalent.
- CTA opens the seeded Knee Pain Assessment.

### 9.2 Start screen

- Patient sees clinic/product identity.
- Patient chooses the digital form path.
- Existing paper-form/photo path may remain visible as a secondary option.
- Language switch is visible and usable.

### 9.3 Intro

- Patient enters name or required intro data.
- Voice is introduced as optional.
- Do not request microphone permission until the user presses the voice button.

### 9.4 Question loop

Each question screen contains:

- Progress indicator.
- Question number/context if useful.
- Question text.
- Manual answer control.
- Voice action.
- Recognized/transcribed answer state.
- Continue action where needed.

### 9.5 Completion

- Provide a subtle completion moment.
- Avoid game-like celebration that could trivialize health information.

### 9.6 Result

- Show score/risk based on existing rules.
- Show next-step guidance.
- Show a clear disclaimer that the form is not a diagnosis.

---

## 10. Voice Input Requirements

### 10.1 General behavior

Voice is optional and user-triggered.

The voice experience must support these states:

- Idle
- Listening
- Processing
- Recognized
- Ambiguous / needs confirmation
- Permission denied
- Unsupported browser/device
- Generic recognition error

### 10.2 UI behavior

- Microphone button is easy to find but does not overpower the manual answer control.
- While listening, show a visible animated listening indicator.
- Show the transcript or interpreted answer.
- Allow correction before continuation.
- If voice fails, keep all manual controls functional.

### 10.3 Mapping by question type

#### Choice

Example: options are “Less than 1 month”, “1–3 months”, “3–6 months”, “Over 6 months”.

Voice should:

- Recognize the spoken option.
- Match it to one valid choice.
- Visually select that choice.
- Require confirmation if recognition is ambiguous.

#### Yes / No

Voice should map common equivalents in the selected language.

Examples:

- English: yes / no / yeah / nope
- Indonesian: ya / iya / tidak / enggak
- Chinese: supported equivalents when recognition locale supports them

Do not auto-continue on ambiguous recognition.

#### Scale

Example: pain level 0–10.

Voice should:

- Parse the spoken number.
- Validate it is inside the allowed range.
- Update the visible slider/value.
- Reject out-of-range values with a friendly message.

#### Free text

Voice should:

- Dictate into the text field.
- Preserve editable text.
- Let user correct before submitting.

### 10.4 Multilingual voice

Voice recognition should follow the selected UI language when supported:

- `en`
- `id`
- `zh`

If voice support is unavailable for the selected locale, show a clear fallback message and keep manual input active.

### 10.5 Privacy

For the standalone MVP:

- Do not save raw microphone audio.
- Do not store audio blobs in localStorage.
- Do not expose API keys in frontend code.
- Do not claim the voice pipeline is clinically compliant.

---

## 11. Admin Requirements

### MVP admin scope

- Demo login.
- Dashboard summary cards.
- Form list.
- Form status: draft/published.
- Create/edit form.
- Supported question types: choice, yes/no, scale, text.
- Publish/generate a public form link.
- Submission table.
- Submission detail.
- Score/risk display.

### Admin UX principle

The admin UI should remain efficient and professional. Duolingo-inspired gamification applies mainly to the **patient flow**.

---

## 12. Landing Page Requirements

The landing page should communicate:

- What PatientForm is.
- Why digital assessment is easier than paper-only workflow.
- How the workflow works.
- Mobile-first patient experience.
- Multilingual support.
- Voice-enabled answering as a new product capability.
- Paper forms can still be accommodated where relevant.

Primary CTA should lead directly to the demo assessment.

---

## 13. Data Model / Compatibility

For prototype compatibility, preserve the existing logical model where practical:

### Form

- id / stable slug
- title
- status
- createdAt
- updatedAt
- questions[]

### Question

- id
- text
- type
- options where applicable
- score where applicable
- max for scale

### Submission

- id
- formId
- patientName
- submittedAt
- answers
- score
- risk

### Existing risk thresholds

- 0–30: low
- 31–60: moderate
- 61+: high

Do not change scoring rules silently.

---

## 14. Prototype Technical Direction

### Preferred standalone prototype stack

Use a modern React/TypeScript frontend generated by v0 or Lovable.

Recommended:

- React + TypeScript
- Tailwind CSS
- Accessible component primitives
- Client-side mock/seed data
- localStorage only for MVP persistence if needed
- Voice adapter abstraction

### Voice adapter

Define a small interface such as:

- `startListening(locale)`
- `stopListening()`
- `onTranscript(text, confidence?)`
- `onError(error)`
- `isSupported()`

For the prototype, browser-native speech recognition may be used where available. The UI must gracefully fall back when unsupported.

A production STT provider can be added later through a server-side adapter.

### Security constraints

- No API secrets in frontend.
- No hidden external data collection.
- No production deployment as part of the generated prototype.
- Do not touch `pesat.ai` infrastructure.

---

## 15. Responsive Requirements

Must work at minimum:

- 320px
- 360px
- 390px
- 414px
- tablet
- desktop

Key rules:

- No horizontal overflow.
- Question controls fit comfortably with thumb use.
- Bottom actions do not cover content.
- Voice button remains reachable.
- Admin tables may use horizontal scrolling on narrow screens.

---

## 16. Accessibility Requirements

- Keyboard-navigable controls.
- Visible focus states.
- Semantic buttons/labels.
- Sufficient contrast.
- Do not rely on color alone for risk or state.
- Voice is optional, never mandatory.
- Manual fallback always available.
- Clear microphone permission/error copy.

---

## 17. MVP Acceptance Criteria

### Patient

- [ ] User can complete the full seeded Knee Pain Assessment manually.
- [ ] One question/task is shown at a time.
- [ ] Progress is visible.
- [ ] EN/ID/ZH switch works without breaking layout.
- [ ] Voice can be activated where browser/device supports it.
- [ ] Voice can map a choice response.
- [ ] Voice can map yes/no.
- [ ] Voice can set a scale value.
- [ ] Voice can dictate free text.
- [ ] Recognized content is reviewable/correctable.
- [ ] Permission denied does not block form completion.
- [ ] Unsupported voice produces a clear fallback.
- [ ] Result score/risk follows the existing scoring contract.

### Admin

- [ ] AI-Assisted form creation is reachable from Create New Form.
- [ ] Staff can type or dictate an AI prompt.
- [ ] PesatRouter is called server-side only; no API key reaches frontend bundles.
- [ ] AI response is schema-validated and presented as a reviewable draft before use.
- [ ] Demo login opens dashboard.
- [ ] Forms list is visible.
- [ ] Basic create/edit flow works.
- [ ] Public assessment link can be opened.
- [ ] Submissions and detail can be reviewed.

### Technical

- [ ] No frontend secrets.
- [ ] No raw microphone audio persisted.
- [ ] No production infrastructure changes.
- [ ] No console-breaking errors during core flow.
- [ ] Responsive behavior passes target widths.

---

## 18. Success Metrics for MVP Review

These are evaluation metrics, not production analytics requirements:

- Demo can be completed end-to-end without explanation.
- A first-time user understands how to answer by voice.
- Voice failure never blocks completion.
- Mobile experience feels intentionally designed rather than desktop-shrunk.
- Stakeholder can recognize continuity with the existing PatientForm product.
- Patient flow feels more guided and interactive than the current demo.

---

## 19. Recommended Delivery Phases

### Phase 1 — Core patient MVP

- Seeded assessment
- Manual answers
- Progress
- Results
- Mobile layout

### Phase 2 — Interaction polish

- Duolingo-inspired states
- Motion/transitions
- Answer feedback
- Completion state

### Phase 3 — Voice

- Voice adapter
- Listening UI
- Choice/yes-no/scale/text mapping
- Permission/error handling
- Multilingual locale handling

### Phase 4 — Admin parity

- Dashboard
- Forms
- Builder
- Publish
- Submissions

### Phase 5 — Landing + QA

- Landing refresh
- Accessibility
- Responsive QA
- Error states
- Code review/export

---

## 20. Risks / Open Decisions

The following should be confirmed before production integration, but do not block a standalone prototype:

- Which production speech-to-text provider, if any, is approved.
- Whether external STT is allowed to process patient responses.
- Whether AI/PDF/image features need parity in this MVP or can remain outside scope.
- Whether the production build will stay localStorage-based or move to a real backend/database.
- Whether existing admin UI must be pixel-compatible or only functionally compatible.

---

## 21. Definition of Done

The MVP is ready for stakeholder review when:

1. The patient can complete the seeded assessment manually and by voice where supported.
2. The experience is clearly more guided, mobile-first, and interactive than the current demo.
3. The voice interaction has visible listening, recognition, correction, and fallback states.
4. The current scoring/result behavior is preserved.
5. The minimal admin flow works.
6. The app contains no frontend secrets or hidden production claims.
7. The generated code can be reviewed independently before any integration into the existing repo/deployment.


---

## 20. Leader-Added Foundation Requirements — 2026-09-03

These requirements are now part of the MVP foundation and supersede older wording that treated AI form generation as optional/out of scope.

### 20.1 AI-Assisted form creation

- `Create New Form` keeps four conceptual starting methods: AI-Assisted, Standard Builder, Upload PDF, and Scan Image.
- **AI-Assisted is active** and opens a chat-based form drafting experience.
- Staff may type a prompt or use the microphone to dictate that prompt. Voice here is only speech-to-text convenience.
- AI form drafting uses **PesatRouter** through the backend only.
- Default provider contract: `POST https://api.pesatrouter.com/v1/chat/completions`, Bearer authentication, default model `pesat-flash`.
- Frontend must call an internal endpoint such as `/api/ai/form-draft`; the PesatRouter API key must never be exposed to the browser.
- Generated forms are drafts only. Staff must review wording, translations, scoring, and clinical suitability before publishing.
- Upload PDF and Scan Image remain visually present but must not claim working AI extraction until corresponding provider capabilities are verified.

### 20.2 Voice placement

Voice is **not a fifth menu / form creation mode**. It is an input capability inside relevant experiences:

1. **Patient assessment** — first-class answer method on supported questions.
2. **Admin AI-Assisted chat** — optional microphone inside the prompt composer.
3. **Form builder** — setting/indicator to enable patient voice answering where appropriate.
4. **Landing page** — showcased as a key product capability, not a navigation destination.

### 20.3 Motion and interaction polish

Motion must support comprehension rather than decoration. The foundation should include:

- Soft entrance transitions for marketing/product sections.
- Question-card transitions between assessment steps.
- Smooth progress-bar changes.
- Press/selection feedback for answer cards and buttons.
- Listening pulse / waveform for microphone states.
- Processing and recognized-state feedback.
- Subtle hover/lift effects for admin and marketing cards.
- `prefers-reduced-motion` support.

The intended experience is **Clinical Companion visual design + Duolingo-quality guided interaction**, not a visual clone of Duolingo and not a motion-heavy entertainment site.
