import { createFileRoute } from "@tanstack/react-router";
import { aiConversationSchema, aiDraftFormSchema, extractJsonObject } from "../lib/ai-draft";

const DEFAULT_BASE_URL = "https://api.pesatrouter.com/v1";
const DEFAULT_MODEL = "pesat-flash";

const SYSTEM_PROMPT = `You are PatientForm's clinical form drafting assistant for Spring Hope Orthopaedic Clinic.
Your job is to help clinic staff design and DRAFT patient assessment questionnaires. You do not diagnose, prescribe, or make clinical decisions.

You must respond with valid JSON ONLY (no markdown code blocks, no commentary outside JSON) in one of two formats:

1. For greetings ("halo", "hi", etc.), questions, conversational replies, or clarification requests:
{
  "type": "chat",
  "message": "Conversational reply in the user's language asking how you can help or clarifying form requirements."
}

2. When the user requests a form, describes symptoms/clinic needs, or asks to create/generate an assessment:
{
  "type": "draft",
  "message": "A short friendly summary of the generated draft in the user's language.",
  "form": {
    "title": {"en":"...","id":"...","zh":"..."},
    "description": {"en":"...","id":"...","zh":"..."},
    "questions": [
      {
        "id":"stable-kebab-id",
        "type":"choice|yesno|scale|text",
        "prompt":{"en":"...","id":"...","zh":"..."},
        "helper":{"en":"...","id":"...","zh":"..."},
        "options":[{"value":"stable-value","label":{"en":"...","id":"...","zh":"..."},"score":0}],
        "max":10,
        "optional":false
      }
    ]
  }
}

Rules for drafts:
- 4 to 10 questions unless staff specifies otherwise; never exceed 12.
- Keep language patient-friendly, concise, non-diagnostic and appropriate for an orthopaedic clinic.
- Include multilingual EN / Bahasa Indonesia / Simplified Chinese text for every title, description, prompt, helper and option label.
- Use choice for multiple-choice, yesno for binary questions, scale for 0-10 rating, text for notes.
- For yesno use exactly two options with values "yes" and "no".
- For scale set max to 10 and omit options.
- For text omit options and scoring.
- Scores are draft configuration only and MUST be reviewed by clinic staff before publishing.
- Never include names, real patient records, diagnoses, or treatment claims.
- Return RAW JSON only, no code fences.`;

export const Route = createFileRoute("/api/ai/form-draft")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          return json(
            {
              success: false,
              error: "INVALID_CONTENT_TYPE",
              message: "Expected application/json.",
            },
            415,
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return json(
            { success: false, error: "INVALID_JSON", message: "Invalid JSON request." },
            400,
          );
        }

        const parsed = aiConversationSchema.safeParse(body);
        if (!parsed.success) {
          return json(
            { success: false, error: "INVALID_REQUEST", message: "The form request is invalid." },
            400,
          );
        }

        const apiKey = process.env.PESATROUTER_API_KEY;
        const baseUrl = (process.env.PESATROUTER_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
        const model = process.env.PESATROUTER_MODEL || DEFAULT_MODEL;

        if (!apiKey) {
          return json(
            {
              success: false,
              error: "AI_PROVIDER_NOT_CONFIGURED",
              message: "AI Assistant is not configured on this environment.",
            },
            503,
          );
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30_000);

        try {
          const providerResponse = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [{ role: "system", content: SYSTEM_PROMPT }, ...parsed.data.messages],
              temperature: 0.25,
            }),
            signal: controller.signal,
          });

          if (!providerResponse.ok) {
            console.error("PesatRouter request failed", providerResponse.status);
            return json(
              {
                success: false,
                error: "AI_PROVIDER_ERROR",
                message: "AI Assistant is temporarily unavailable. Please try again.",
              },
              502,
            );
          }

          const providerJson = (await providerResponse.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
          };
          const content = providerJson.choices?.[0]?.message?.content;
          if (!content) {
            return json(
              {
                success: false,
                error: "AI_EMPTY_RESPONSE",
                message: "AI Assistant returned an empty response.",
              },
              502,
            );
          }

          let payload: unknown;
          try {
            payload = JSON.parse(extractJsonObject(content));
          } catch (error) {
            console.error("PesatRouter returned non-JSON response", error);
            return json(
              {
                success: false,
                error: "AI_INVALID_RESPONSE",
                message: "AI Assistant returned an unreadable response. Please try again.",
              },
              502,
            );
          }

          const envelope = payload as { type?: string; message?: unknown; form?: unknown };
          const message =
            typeof envelope.message === "string" && envelope.message.trim()
              ? envelope.message.trim()
              : "";

          // Accept both {type:"draft", form:{...}} and a bare form object (no envelope).
          let formPayload: unknown = null;
          if (envelope.type === "draft" && envelope.form && typeof envelope.form === "object") {
            formPayload = envelope.form;
          } else if (
            payload &&
            typeof payload === "object" &&
            "questions" in payload &&
            "title" in payload
          ) {
            formPayload = payload;
          }

          if (!formPayload) {
            return json({
              success: true,
              type: "chat",
              message:
                message ||
                "Could you describe the assessment you would like me to draft? For example: a knee pain follow-up with a 0-10 pain scale.",
              provider: "pesatrouter",
              model,
            });
          }

          const form = aiDraftFormSchema.safeParse(formPayload);
          if (!form.success) {
            console.error(
              "PesatRouter draft schema validation failed",
              form.error.issues.map((issue) => issue.path.join(".")),
            );
            // Controlled fallback: keep the conversation alive instead of erroring out.
            return json({
              success: true,
              type: "chat",
              message:
                message ||
                "The draft came back incomplete. Could you describe the questions you need in a bit more detail?",
              provider: "pesatrouter",
              model,
            });
          }

          return json({
            success: true,
            type: "draft",
            message:
              message ||
              `Draft ready: ${form.data.title.en}. Review the questions before using it.`,
            form: form.data,
            provider: "pesatrouter",
            model,
          });
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return json(
              {
                success: false,
                error: "AI_TIMEOUT",
                message: "AI Assistant took too long to respond. Please try again.",
              },
              504,
            );
          }
          console.error("AI form draft error", error);
          return json(
            {
              success: false,
              error: "AI_REQUEST_FAILED",
              message: "AI Assistant is temporarily unavailable.",
            },
            502,
          );
        } finally {
          clearTimeout(timeout);
        }
      },
    },
  },
});

function json(payload: unknown, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
