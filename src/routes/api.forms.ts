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

          // List all forms with tenant filtering
          const user = await authenticateRequest(request);
          const isSuperAdmin =
            user &&
            (user.role === "superadmin" ||
              user.email === "admin@gmail.com" ||
              user.email === "superadmin@9forms.com");

          let rows: Array<{
            id: string;
            title: string;
            schema_json: string;
            created_at: string;
            updated_at: string;
          }> = [];

          if (isSuperAdmin || !user) {
            rows = await dbQuery<{
              id: string;
              title: string;
              schema_json: string;
              created_at: string;
              updated_at: string;
            }>(
              "SELECT id, title, schema_json, created_at, updated_at FROM forms ORDER BY updated_at DESC",
            );
          } else {
            rows = await dbQuery<{
              id: string;
              title: string;
              schema_json: string;
              created_at: string;
              updated_at: string;
            }>(
              "SELECT id, title, schema_json, created_at, updated_at FROM forms WHERE user_id = ? OR user_id = ? ORDER BY updated_at DESC",
              [user.adminId, user.email],
            );
          }

          let forms = rows.map((r) => {
            try {
              return JSON.parse(r.schema_json);
            } catch {
              return { id: r.id, title: { en: r.title, id: r.title, zh: r.title }, questions: [] };
            }
          });

          // Seed default template if database is completely empty
          if (forms.length === 0) {
            const { newPatientForm } = await import("../lib/patientform");
            forms = [newPatientForm];
          }

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

          const isSuperAdmin =
            user.role === "superadmin" ||
            user.email === "admin@gmail.com" ||
            user.email === "superadmin@9forms.com";

          const existing = await dbQueryOne<{ id: string; user_id?: string }>(
            "SELECT id, user_id FROM forms WHERE id = ?",
            [formId],
          );
          if (existing) {
            if (!isSuperAdmin && existing.user_id && existing.user_id !== user.adminId && existing.user_id !== user.email) {
              return Response.json(
                { success: false, error: "FORBIDDEN", message: "Anda tidak memiliki izin mengedit form ini." },
                { status: 403 },
              );
            }
            await dbExecute(
              "UPDATE forms SET title = ?, schema_json = ?, updated_at = datetime('now') WHERE id = ?",
              [title, schemaJson, formId],
            );
          } else {
            await dbExecute(
              "INSERT INTO forms (id, title, schema_json, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
              [formId, title, schemaJson, user.adminId],
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

      DELETE: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          if (!user) {
            return Response.json(
              { success: false, error: "UNAUTHORIZED", message: "Admin authentication required." },
              { status: 401 },
            );
          }

          const isSuperAdmin =
            user.role === "superadmin" ||
            user.email === "admin@gmail.com" ||
            user.email === "superadmin@9forms.com";

          const url = new URL(request.url);
          let formId = url.searchParams.get("id") || "";
          if (!formId) {
            const body = await request.json().catch(() => null);
            if (body && body.id) formId = String(body.id).trim();
          }

          if (!formId) {
            return Response.json(
              { success: false, error: "MISSING_ID", message: "Form ID is required." },
              { status: 400 },
            );
          }

          if (isSuperAdmin) {
            await dbExecute("DELETE FROM forms WHERE id = ?", [formId]);
            await dbExecute("DELETE FROM submissions WHERE form_id = ?", [formId]);
          } else {
            await dbExecute(
              "DELETE FROM forms WHERE id = ? AND (user_id = ? OR user_id = ?)",
              [formId, user.adminId, user.email],
            );
            await dbExecute(
              "DELETE FROM submissions WHERE form_id = ? AND (user_id = ? OR user_id = ?)",
              [formId, user.adminId, user.email],
            );
          }

          return Response.json({
            success: true,
            id: formId,
            message: "Form and associated submissions deleted successfully from database.",
          });
        } catch (err) {
          console.error("Failed to delete form", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Failed to delete form." },
            { status: 500 },
          );
        }
      },
    },
  },
});
