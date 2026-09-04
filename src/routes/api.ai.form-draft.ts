import { createFileRoute } from "@tanstack/react-router";
import { aiConversationSchema, aiDraftFormSchema, extractJsonObject } from "../lib/ai-draft";

const DEFAULT_BASE_URL = "https://api.pesatrouter.com/v1";
const DEFAULT_MODEL = "pesat-flash";

const SYSTEM_PROMPT = `You are PatientForm's clinical form drafting assistant for Spring Hope Orthopaedic Clinic.
Your job is to help clinic staff DRAFT patient assessment questionnaires. You do not diagnose, prescribe, or make clinical decisions.

Return ONLY valid JSON, no markdown, no commentary, matching exactly this shape:
{
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

Rules:
- 4 to 10 questions unless the staff explicitly asks otherwise; never exceed 12.
- Keep language patient-friendly, concise, non-diagnostic and appropriate for an orthopaedic clinic.
- Include multilingual EN / Bahasa Indonesia / Simplified Chinese text for every title, description, prompt, helper and option label.
- Use choice for multiple-choice, yesno for binary questions, scale for 0-10 rating, text for notes.
- For yesno use exactly two options with values "yes" and "no".
- For scale set max to 10 and omit options.
- For text omit options and scoring.
- Scores are draft configuration only and MUST be reviewed by clinic staff before publishing.
- Never include names, real patient records, diagnoses, or treatment claims.
- Do not wrap JSON in code fences.`;

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

          let formPayload: unknown;
          try {
            formPayload = JSON.parse(extractJsonObject(content));
          } catch (error) {
            console.error("PesatRouter returned non-JSON form draft", error);
            return json(
              {
                success: false,
                error: "AI_INVALID_DRAFT",
                message:
                  "AI generated a draft that could not be validated. Please try a more specific request.",
              },
              502,
            );
          }

          const form = aiDraftFormSchema.safeParse(formPayload);
          if (!form.success) {
            console.error(
              "PesatRouter draft schema validation failed",
              form.error.issues.map((issue) => issue.path.join(".")),
            );
            return json(
              {
                success: false,
                error: "AI_INVALID_DRAFT",
                message: "AI generated an incomplete form draft. Please try again.",
              },
              502,
            );
          }

          return json({
            success: true,
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
