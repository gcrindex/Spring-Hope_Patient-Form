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

          // Ensure superadmin has the 3 canonical landing page forms and legacy test forms are cleaned
          const canonicalIds = ["new-patient-intake", "knee-pain-assessment", "elderly-friendly-intake"];
          const hasCanonical = forms.some((f) => canonicalIds.includes(f.id));

          if (isSuperAdmin && (!hasCanonical || forms.length === 0)) {
            const { newPatientForm, kneePainForm, elderlyFriendlyForm } = await import("../lib/patientform");
            const canonicalForms = [newPatientForm, kneePainForm, elderlyFriendlyForm];
            try {
              await dbExecute(
                "DELETE FROM forms WHERE id NOT IN ('new-patient-intake', 'knee-pain-assessment', 'elderly-friendly-intake')",
              );
              for (const f of canonicalForms) {
                const fTitle = typeof f.title === "string" ? f.title : f.title.en;
                await dbExecute(
                  "INSERT OR REPLACE INTO forms (id, title, schema_json, user_id, created_at, updated_at) VALUES (?, ?, ?, 'admin', datetime('now'), datetime('now'))",
                  [f.id, fTitle, JSON.stringify(f)],
                );
              }
            } catch (dbErr) {
              console.error("Failed to seed canonical forms in DB", dbErr);
            }
            forms = canonicalForms;
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
	          const body = await request.json().catch(() => null);
	          if (!body || typeof body !== "object") {
	            return Response.json(
	              { success: false, error: "INVALID_BODY", message: "Invalid form data." },
	              { status: 400 },
	            );
	          }

	          const isSuperAdmin =
	            user &&
	            (user.role === "superadmin" ||
	              user.email === "admin@gmail.com" ||
	              user.email === "superadmin@9forms.com");

	          if (body.action === "reset-landing-forms") {
	            if (!isSuperAdmin) {
	              return Response.json(
	                { success: false, error: "FORBIDDEN", message: "Akses khusus Super Administrator." },
	                { status: 403 },
	              );
	            }
	            const { newPatientForm, kneePainForm, elderlyFriendlyForm } = await import("../lib/patientform");
	            const canonicalForms = [newPatientForm, kneePainForm, elderlyFriendlyForm];
	            try {
	              await dbExecute("DELETE FROM forms");
	              for (const f of canonicalForms) {
	                const fTitle = typeof f.title === "string" ? f.title : f.title.en;
	                await dbExecute(
	                  "INSERT INTO forms (id, title, schema_json, user_id, created_at, updated_at) VALUES (?, ?, ?, 'admin', datetime('now'), datetime('now'))",
	                  [f.id, fTitle, JSON.stringify(f)],
	                );
	              }
	            } catch (dbErr) {
	              console.error("Failed to reset forms in DB", dbErr);
	            }
	            return Response.json({
	              success: true,
	              message: "Berhasil disinkronkan ke 3 formulir landing page.",
	              forms: canonicalForms,
	            });
	          }

          if (!body.id) {
            return Response.json(
              { success: false, error: "INVALID_BODY", message: "Invalid form ID." },
              { status: 400 },
            );
          }

          const rawId = String(body.id).trim();
          if (!/^[a-zA-Z0-9_-]{2,64}$/.test(rawId)) {
            return Response.json(
              {
                success: false,
                error: "INVALID_ID",
                message: "ID formulir tidak valid (hanya huruf, angka, _ dan -).",
              },
              { status: 400 },
            );
          }

          // Anti-XSS Sanitization & Strict Payload Normalization
          const sanitizeStr = (s: unknown, maxLen = 1000): string => {
            if (typeof s !== "string") return "";
            return s
              .trim()
              .slice(0, maxLen)
              .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
              .replace(/javascript:/gi, "")
              .replace(/on\w+\s*=/gi, "")
              .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
          };

          const sanitizeLoc = (loc: unknown): Record<string, string> | string => {
            if (typeof loc === "string") return sanitizeStr(loc);
            if (typeof loc === "object" && loc !== null) {
              const res: Record<string, string> = {};
              for (const [k, v] of Object.entries(loc as Record<string, unknown>)) {
                if (typeof v === "string") res[k] = sanitizeStr(v);
              }
              return res;
            }
            return "";
          };

          // Normalize & sanitize questions
          if (Array.isArray(body.questions)) {
            body.questions = body.questions.map((q: any, idx: number) => {
              const qId = sanitizeStr(q.id || `q_${idx + 1}`, 64) || `q_${idx + 1}`;
              const validTypes = ["choice", "yesno", "scale", "text"];
              const qType = validTypes.includes(q.type) ? q.type : "choice";
              const prompt = sanitizeLoc(q.prompt);
              const helper = q.helper ? sanitizeLoc(q.helper) : undefined;
              let options = undefined;
              if (Array.isArray(q.options)) {
                options = q.options.map((opt: any, oIdx: number) => ({
                  value: sanitizeStr(opt.value || `opt_${oIdx + 1}`, 64),
                  label: sanitizeLoc(opt.label),
                  score: typeof opt.score === "number" ? opt.score : 0,
                  ...(opt.aliases ? { aliases: opt.aliases } : {}),
                }));
              }
              return {
                ...q,
                id: qId,
                type: qType,
                prompt,
                ...(helper ? { helper } : {}),
                ...(options ? { options } : {}),
              };
            });
          }

          // Normalize & sanitize cover page
          if (body.coverPage && typeof body.coverPage === "object") {
            if (body.coverPage.bannerLogoUrl) {
              const logo = String(body.coverPage.bannerLogoUrl).trim();
              const isSafeUrl =
                logo.startsWith("https://") ||
                logo.startsWith("http://") ||
                /^data:image\/(png|jpeg|webp);base64,/i.test(logo);
              if (!isSafeUrl) {
                body.coverPage.bannerLogoUrl = "";
              }
            }
            if (body.coverPage.title) body.coverPage.title = sanitizeLoc(body.coverPage.title);
            if (body.coverPage.description)
              body.coverPage.description = sanitizeLoc(body.coverPage.description);
          }

          const formId = rawId;
          const title =
            typeof body.title === "string"
              ? sanitizeStr(body.title)
              : typeof body.title === "object" && body.title !== null
                ? sanitizeStr(body.title.en || body.title.id || "Custom Form")
                : "Custom Form";
          body.title = title;
          const schemaJson = JSON.stringify(body);

          let existing: { id: string; user_id?: string } | null = null;
          try {
            existing = await dbQueryOne<{ id: string; user_id?: string }>(
              "SELECT id, user_id FROM forms WHERE id = ?",
              [formId],
            );
          } catch {
            existing = await dbQueryOne<{ id: string }>(
              "SELECT id FROM forms WHERE id = ?",
              [formId],
            );
          }

          if (existing) {
            if (
              !isSuperAdmin &&
              existing.user_id &&
              existing.user_id !== "admin" &&
              existing.user_id !== "public" &&
              user &&
              existing.user_id !== user.adminId &&
              existing.user_id !== user.email
            ) {
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
            const ownerId = user ? user.adminId : "admin";
            try {
              await dbExecute(
                "INSERT INTO forms (id, title, schema_json, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))",
                [formId, title, schemaJson, ownerId],
              );
            } catch {
              await dbExecute(
                "INSERT INTO forms (id, title, schema_json, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))",
                [formId, title, schemaJson],
              );
            }
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
