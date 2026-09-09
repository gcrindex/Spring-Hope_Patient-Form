import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest } from "../lib/auth";
import { dbExecute, dbQuery, dbQueryOne } from "../lib/db";

export const Route = createFileRoute("/api/forms")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const formId = url.searchParams.get("id");

          // Public access to single form schema for intake runner
          if (formId) {
            const row = await dbQueryOne<{
              id: string;
              title: string;
              schema_json: string;
            }>("SELECT id, title, schema_json FROM forms WHERE id = ?", [formId.trim()]);

            if (row) {
              try {
                const schema = JSON.parse(row.schema_json);
                return Response.json(
                  { success: true, form: schema },
                  { headers: { "Cache-Control": "no-store" } },
                );
              } catch (e) {
                console.error("Failed to parse form schema", e);
              }
            } else {
              return Response.json(
                {
                  success: false,
                  error: "NOT_FOUND",
                  message: "Formulir kustom tidak ditemukan di server.",
                },
                { status: 404 },
              );
            }
          }

          // List all forms
          const rows = await dbQuery<{
            id: string;
            title: string;
            schema_json: string;
            created_at: string;
            updated_at: string;
          }>(
            "SELECT id, title, schema_json, created_at, updated_at FROM forms ORDER BY updated_at DESC",
          );

          const forms = rows.map((r) => {
            try {
              return JSON.parse(r.schema_json);
            } catch {
              return { id: r.id, title: { en: r.title, id: r.title, zh: r.title }, questions: [] };
            }
          });

          return Response.json(
            { success: true, forms },
            { headers: { "Cache-Control": "no-store" } },
          );
        } catch (err) {
          console.error("Failed to fetch forms", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Failed to fetch forms." },
            { status: 500 },
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          if (!user) {
            return Response.json(
              { success: false, error: "UNAUTHORIZED", message: "Admin authentication required." },
              { status: 401 },
            );
          }

          const body = await request.json().catch(() => null);
          if (!body || typeof body !== "object" || !body.id) {
            return Response.json(
              { success: false, error: "INVALID_BODY", message: "Invalid form data." },
              { status: 400 },
            );
          }

          const formId = String(body.id).trim();
          const title =
            typeof body.title === "string"
              ? body.title
              : body.title?.en || body.title?.id || "Custom Form";
          const schemaJson = JSON.stringify(body);

          const existing = await dbQueryOne("SELECT id FROM forms WHERE id = ?", [formId]);
          if (existing) {
            await dbExecute(
              "UPDATE forms SET title = ?, schema_json = ?, updated_at = datetime('now') WHERE id = ?",
              [title, schemaJson, formId],
            );
          } else {
            await dbExecute(
              "INSERT INTO forms (id, title, schema_json, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))",
              [formId, title, schemaJson],
            );
          }

          return Response.json({ success: true, id: formId, message: "Form saved successfully." });
        } catch (err) {
          console.error("Failed to save form", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Failed to save form." },
            { status: 500 },
          );
        }
      },
    },
  },
});
