import { createFileRoute } from "@tanstack/react-router";
import { aiDraftFormSchema, extractJsonObject } from "../lib/ai-draft";

const DEFAULT_BASE_URL = "https://api.pesatrouter.com/v1";
const DEFAULT_MODEL = "pesat-flash";

const SYSTEM_PROMPT = `You are PatientForm's clinical form drafting assistant for Spring Hope Orthopaedic Clinic.
You receive the content description of an uploaded image/photo of a clinical form. Your job is to convert it into a patient assessment form.

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
- 4 to 12 questions based on what you can read from the image.
- If text is unclear, make reasonable clinical assumptions but flag them.
- Include multilingual EN / Bahasa Indonesia / Simplified Chinese.
- Do not diagnose, prescribe, or make clinical decisions.
- Scores are draft configuration only.
- Do not wrap JSON in code fences.`;

export const Route = createFileRoute("/api/ai/extract-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.includes("multipart/form-data")) {
          return json({ success: false, error: "INVALID_CONTENT_TYPE", message: "Send multipart form data." }, 400);
        }

        const apiKey = process.env.PESATROUTER_API_KEY;
        const baseUrl = (process.env.PESATROUTER_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
        const model = process.env.PESATROUTER_MODEL || DEFAULT_MODEL;

        if (!apiKey) {
          return json({ success: false, error: "AI_PROVIDER_NOT_CONFIGURED", message: "AI service is not configured." }, 503);
        }

        try {
          const formData = await request.formData();
          const file = formData.get("file") as File | null;
          if (!file) {
            return json({ success: false, error: "NO_FILE", message: "No file uploaded." }, 400);
          }

          if (file.size > 10 * 1024 * 1024) {
            return json({ success: false, error: "FILE_TOO_LARGE", message: "File must be under 10 MB." }, 400);
          }

          const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
          if (!allowedTypes.includes(file.type)) {
            return json({ success: false, error: "INVALID_FILE_TYPE", message: "Upload a PNG, JPEG, or WebP image." }, 400);
          }

          // Convert to base64 data URI for the AI provider
          const buffer = await file.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          const dataUri = `data:${file.type};base64,${base64}`;

          const response = await fetch(`${baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                {
                  role: "user",
                  content: [
                    { type: "text", text: "Analyze this image of a clinical form and convert it into a structured patient assessment form." },
                    { type: "image_url", image_url: { url: dataUri } },
                  ],
                },
              ],
              temperature: 0.4,
              max_tokens: 4000,
            }),
            signal: AbortSignal.timeout(90_000),
          });

          if (!response.ok) {
            return json({ success: false, error: "AI_PROVIDER_ERROR", message: "AI service returned an error. The model may not support image input." }, 502);
          }

          const data = await response.json() as { choices?: { message?: { content?: string } }[] };
          const content = data.choices?.[0]?.message?.content ?? "";
          const parsed = extractJsonObject(content);
          const formPayload = typeof parsed === "string" ? JSON.parse(parsed) : parsed;

          const form = aiDraftFormSchema.safeParse(formPayload);
          if (!form.success) {
            return json({ success: false, error: "AI_INVALID_DRAFT", message: "AI generated an incomplete form draft. Please try again." }, 502);
          }

          return json({ success: true, form: form.data, provider: "pesatrouter", model });
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return json({ success: false, error: "AI_TIMEOUT", message: "AI took too long. Please try again." }, 504);
          }
          console.error("Image extract error", error);
          return json({ success: false, error: "EXTRACT_FAILED", message: "Could not process this image. Try chat mode instead." }, 500);
        }
      },
    },
  },
});

function json(payload: unknown, status = 200) {
  return Response.json(payload, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}
