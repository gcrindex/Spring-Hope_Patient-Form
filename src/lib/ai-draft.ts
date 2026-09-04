import { z } from "zod";

export const localizedTextSchema = z.object({
  en: z.string().min(1).max(500),
  id: z.string().min(1).max(500),
  zh: z.string().min(1).max(500),
});

export const aiDraftOptionSchema = z.object({
  value: z.string().min(1).max(80),
  label: localizedTextSchema,
  score: z.number().finite().min(0).max(100),
});

export const aiDraftQuestionSchema = z.object({
  id: z.string().min(1).max(80),
  type: z.enum(["choice", "yesno", "scale", "text"]),
  prompt: localizedTextSchema,
  helper: localizedTextSchema.optional(),
  options: z.array(aiDraftOptionSchema).max(8).optional(),
  max: z.number().int().min(1).max(10).optional(),
  optional: z.boolean().optional(),
});

export const aiDraftFormSchema = z.object({
  title: localizedTextSchema,
  description: localizedTextSchema,
  questions: z.array(aiDraftQuestionSchema).min(1).max(12),
});

export type AIDraftForm = z.infer<typeof aiDraftFormSchema>;

export const aiConversationSchema = z.object({
  mode: z.literal("chat").default("chat"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      }),
    )
    .min(1)
    .max(12),
});

export function extractJsonObject(input: string) {
  const trimmed = input.trim();
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const start = unfenced.indexOf("{");
  const end = unfenced.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("NO_JSON_OBJECT");
  return unfenced.slice(start, end + 1);
}
