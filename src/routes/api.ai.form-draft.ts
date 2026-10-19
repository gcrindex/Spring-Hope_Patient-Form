import { createFileRoute } from "@tanstack/react-router";
import { aiConversationSchema, aiDraftFormSchema, extractJsonObject } from "../lib/ai-draft";
import { authenticateRequest } from "../lib/auth";
import { getEnv } from "../lib/env";

const DEFAULT_BASE_URL = "https://api.pesatrouter.com/v1";
const DEFAULT_MODEL = "pesat-flash";

const SYSTEM_PROMPT = `You are 9forms.com's intelligent form drafting and consulting assistant.
Your job is to help users brainstorm, design, and draft conversational, multi-industry forms, surveys, questionnaires, evaluations, registrations, and clinical intakes across any field (healthcare, education, HR, events, real estate, retail, sports, hospitality, etc.).

CRITICAL LANGUAGE RULE:
The conversational text in the "message" field MUST strictly match the language of the user's latest message:
- If the user wrote in English -> write the "message" reply in ENGLISH.
- If the user wrote in Indonesian -> write the "message" reply in INDONESIAN.
- If the user wrote in Chinese -> write the "message" reply in CHINESE.
Never reply in Indonesian if the user prompted in English.

TWO INTERACTION MODES:
1. CONSULTATIVE BRAINSTORMING / ADVICE:
Use this when the user is asking open questions, brainstorming ideas, greeting, or discussing what questions or data points are crucial (e.g. "enaknya nanya apa aja ya buat pendaftaran les?", "data apa yang krusial?", "punya saran buat survey kepuasan?").
Provide a warm, expert, concise consultative response. Offer 2 to 4 bullet points of recommended questions or strategies, then invite them naturally:
"Mau saya langsung buatkan draf form lengkapnya berdasarkan poin-poin ini?"
Format:
{
  "type": "chat",
  "message": "Conversational, consultative advice and suggestions in the user's exact language."
}

2. DRAFTING OR REVISING A FORM:
Use this when:
- The user asks to generate, create, or draft a form (e.g. "buatkan form...", or clicking a Quick Prompt).
- The user confirms generation after brainstorming (e.g. "iya bikinin", "gas buatkan", "oke boleh").
- The user asks for a revision or refinement on an existing draft (e.g. "tambahkan pertanyaan nomor WhatsApp", "hapus soal 2", "bikin lebih santai", "tambah opsi baru").
When revising, PRESERVE and UPDATE the previous form structure from the conversation history instead of wiping it out!
Format:
{
  "type": "draft",
  "message": "A short, friendly, natural summary of the draft or the exact revision applied in the user's exact language.",
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

STRICT QUESTION TYPE & FIELD RULES:
- Exactly 4 supported question types: "choice" (multiple choice), "yesno" (binary yes/no), "scale" (0-10 rating), "text" (open short text input, used for names, contact/phone/WhatsApp, feedback, addresses, notes).
- For phone/WhatsApp or contact questions, always use type "text".
- For yesno, exactly two options with values "yes" and "no".
- For scale, set max to 10 and omit options.
- For text, omit options and scoring.
- 4 to 8 questions recommended; maximum 12.
- Provide multilingual text for en, id, and zh for title, description, prompts, helpers, and option labels.
- Return RAW JSON only, without markdown code fences or commentary outside the JSON.`;

export const Route = createFileRoute("/api/ai/form-draft")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await authenticateRequest(request);
        if (!user) {
          return json(
            {
              success: false,
              error: "UNAUTHORIZED",
              message: "Authentication required to use AI form drafting.",
            },
            401,
          );
        }

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

        const apiKey = getEnv("PESATROUTER_API_KEY");
        const baseUrl = (getEnv("PESATROUTER_BASE_URL") || DEFAULT_BASE_URL).replace(
          /\/$/,
          "",
        );
        const model = getEnv("PESATROUTER_MODEL") || DEFAULT_MODEL;

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
              temperature: 0.35,
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
