import { createFileRoute } from "@tanstack/react-router";
import { aiDraftFormSchema, extractJsonObject } from "../lib/ai-draft";

const DEFAULT_BASE_URL = "https://api.pesatrouter.com/v1";
const DEFAULT_MODEL = "pesat-flash";

const SYSTEM_PROMPT = `You are PatientForm's clinical form drafting assistant for Spring Hope Orthopaedic Clinic.
You receive the extracted text content of a PDF document. Your job is to convert it into a patient assessment form.

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
- 4 to 12 questions based on the PDF content.
- Keep language patient-friendly, concise, non-diagnostic.
- Include multilingual EN / Bahasa Indonesia / Simplified Chinese for every field.
- Do not diagnose, prescribe, or make clinical decisions.
- Scores are draft configuration only and MUST be reviewed by clinic staff.
- Do not wrap JSON in code fences.`;

export const Route = createFileRoute("/api/ai/extract-pdf")({
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

          // Read the PDF as text — basic extraction (works for simple text-based PDFs)
          const buffer = await file.arrayBuffer();
          const text = await extractPdfText(buffer);

          if (!text || text.trim().length < 20) {
            return json({
              success: false,
              error: "NO_EXTRACTABLE_TEXT",
              message: "Could not extract readable text from this PDF. Try describing the form in chat mode instead.",
            }, 422);
          }

          const truncatedText = text.slice(0, 6000);

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
                { role: "user", content: `Convert this PDF content into a patient assessment form:\n\n${truncatedText}` },
              ],
              temperature: 0.4,
            }),
            signal: AbortSignal.timeout(60_000),
          });

          if (!response.ok) {
            return json({ success: false, error: "AI_PROVIDER_ERROR", message: "AI service returned an error." }, 502);
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
          console.error("PDF extract error", error);
          return json({ success: false, error: "EXTRACT_FAILED", message: "Could not process this PDF. Try chat mode instead." }, 500);
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

/** Basic text extraction from PDF buffer — reads text streams without a heavy library. */
async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const text = new TextDecoder("latin1").decode(bytes);

  // Try to find readable text between stream/endstream blocks
  const textChunks: string[] = [];
  const streamRegex = /stream\r?\n([\s\S]*?)endstream/g;
  let match;
  while ((match = streamRegex.exec(text)) !== null) {
    const block = match[1];
    // Extract text operators: Tj, TJ, '
    const tjMatches = block.match(/\(([^)]*)\)\s*Tj/g);
    if (tjMatches) {
      for (const m of tjMatches) {
        const inner = m.match(/\(([^)]*)\)/);
        if (inner) textChunks.push(inner[1]);
      }
    }
    const tjArrayMatches = block.match(/\[([^\]]*)\]\s*TJ/g);
    if (tjArrayMatches) {
      for (const m of tjArrayMatches) {
        const inner = m.match(/\[([^\]]*)\]/);
        if (inner) {
          const parts = inner[1].match(/\(([^)]*)\)/g);
          if (parts) {
            for (const p of parts) {
              const cleaned = p.replace(/[()]/g, "");
              textChunks.push(cleaned);
            }
          }
        }
      }
    }
  }

  if (textChunks.length > 0) {
    return textChunks.join(" ").replace(/\\n/g, "\n").replace(/\\t/g, " ");
  }

  // Fallback: just return what we can
  return text.slice(0, 8000);
}
