import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest, verifyPassword } from "../lib/auth";
import { decryptData, encryptData } from "../lib/crypto";
import { dbExecute, dbQuery, dbQueryOne } from "../lib/db";

function sanitizeString(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/[<>]/g, "") // strip angle brackets
    .trim();
}

/**
 * Excel / LibreOffice / Google Sheets CSV Formula Injection (CWE-1236) Mitigation.
 * Strips dangerous control characters and prepends a single quote `'`
 * if the cell content begins with formula operators (=, +, -, @, \t, \r, %, |)
 * to ensure spreadsheet software treats the value strictly as literal text.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  // Strip null bytes and non-printable control characters except newline and tab
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // Check if string starts with formula characters (=, +, -, @, \t, \r, %, |)
  const trimmed = str.trimStart();
  if (/^[=\+\-@\t\r%|]/.test(trimmed)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanKey = sanitizeString(key).slice(0, 60);
    if (typeof value === "string") {
      result[cleanKey] = sanitizeString(value).slice(0, 2000);
    } else if (typeof value === "number" || typeof value === "boolean") {
      result[cleanKey] = value;
    } else if (value && typeof value === "object") {
      result[cleanKey] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[cleanKey] = sanitizeString(String(value)).slice(0, 500);
    }
  }
  return result;
}

export const Route = createFileRoute("/api/submissions")({
  server: {
    handlers: {
      // GET /api/submissions: Server-side search, filtering, and pagination for admin
      GET: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          if (!user) {
            return Response.json(
              {
                success: false,
                error: "UNAUTHORIZED",
                message: "Akses ditolak: Wajib autentikasi admin.",
              },
              { status: 401 },
            );
          }

          const url = new URL(request.url);
          const search = sanitizeString(url.searchParams.get("search") || "");
          const formId = sanitizeString(url.searchParams.get("formId") || "");
          const risk = sanitizeString(url.searchParams.get("risk") || "");
          const dateFrom = sanitizeString(
            url.searchParams.get("dateFrom") || url.searchParams.get("startDate") || "",
          );
          const dateTo = sanitizeString(
            url.searchParams.get("dateTo") || url.searchParams.get("endDate") || "",
          );
          const isExport =
            url.searchParams.get("export") === "csv" ||
            url.searchParams.get("format") === "csv";

          const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
          const limit = Math.min(
            100,
            Math.max(1, parseInt(url.searchParams.get("limit") || "15", 10) || 15),
          );
          const offset = (page - 1) * limit;

          const isSuperAdmin =
            user.role === "superadmin" ||
            user.email === "admin@gmail.com" ||
            user.email === "superadmin@9forms.com";

          // Validasi IDOR: Staf/tenant hanya bisa mengakses dan mengunduh formulir miliknya
          if (!isSuperAdmin && formId) {
            const formRow = await dbQueryOne<{ user_id: string }>(
              "SELECT user_id FROM forms WHERE id = ?",
              [formId],
            );
            if (
              formRow &&
              formRow.user_id !== user.adminId &&
              formRow.user_id !== user.email &&
              formRow.user_id !== "admin"
            ) {
              return Response.json(
                {
                  success: false,
                  error: "FORBIDDEN",
                  message:
                    "Akses ditolak: Anda tidak memiliki izin untuk mengakses atau mengekspor data formulir ini (IDOR protection).",
                },
                { status: 403 },
              );
            }
          }

          // Build dynamic SQL query with parameterized conditions (anti-SQLi)
          const conditions: string[] = [];
          const params: unknown[] = [];

          if (!isSuperAdmin) {
            conditions.push("(user_id = ? OR user_id = ?)");
            params.push(user.adminId, user.email);
          }

          if (formId) {
            conditions.push("form_id = ?");
            params.push(formId);
          }

          if (risk && ["low", "mod", "high"].includes(risk.toLowerCase())) {
            conditions.push("risk_level = ?");
            params.push(risk.toLowerCase());
          }

          // Parameterized date range filter (YYYY-MM-DD validation)
          if (dateFrom && /^\d{4}-\d{2}-\d{2}$/.test(dateFrom)) {
            conditions.push("date(created_at) >= date(?)");
            params.push(dateFrom);
          }

          if (dateTo && /^\d{4}-\d{2}-\d{2}$/.test(dateTo)) {
            conditions.push("date(created_at) <= date(?)");
            params.push(dateTo);
          }

          // Parameterized instant patient search
          if (search) {
            conditions.push("(patient_name LIKE ? OR id LIKE ?)");
            params.push(`%${search}%`, `%${search}%`);
          }

          const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

          // Handle Server-Side CSV Export with Formula Injection Sanitization
          if (isExport) {
            const exportSql = `SELECT id, form_id, patient_name, score, risk_level, data_json, created_at
                               FROM submissions ${whereClause}
                               ORDER BY created_at DESC
                               LIMIT 5000`;
            const exportRows = await dbQuery<{
              id: string;
              form_id: string;
              patient_name: string;
              score: number;
              risk_level: string;
              data_json: string;
              created_at: string;
            }>(exportSql, params);

            let formQuestions: Array<{ id: string; prompt?: unknown; text?: string }> = [];
            let formTitle = formId || "clinical-export";

            if (formId) {
              const formMeta = await dbQueryOne<{ title: string; schema_json: string }>(
                "SELECT title, schema_json FROM forms WHERE id = ?",
                [formId],
              );
              if (formMeta) {
                formTitle = formMeta.title || formId;
                try {
                  const schema = JSON.parse(formMeta.schema_json);
                  if (Array.isArray(schema.questions)) {
                    formQuestions = schema.questions;
                  }
                } catch {
                  // ignore
                }
              }
            }

            const headers = [
              "Submission ID",
              "Patient Name",
              "Submission Date",
              "Score",
              "Risk Level",
              "Triage Status",
            ];

            formQuestions.forEach((q, idx) => {
              let qPrompt = "";
              if (typeof q.prompt === "object" && q.prompt !== null) {
                const p = q.prompt as Record<string, string>;
                qPrompt = p.en || p.id || p.zh || `Question ${idx + 1}`;
              } else {
                qPrompt = q.text || String(q.prompt || `Question ${idx + 1}`);
              }
              headers.push(qPrompt);
            });

            let csvContent = headers.map(sanitizeCsvCell).join(",") + "\r\n";

            for (const r of exportRows) {
              let parsedData: Record<string, unknown> = {};
              try {
                const dec = await decryptData(r.data_json);
                parsedData = JSON.parse(dec) as Record<string, unknown>;
              } catch {
                parsedData = {};
              }

              const answers = (parsedData["answers"] as Record<string, unknown>) || {};
              const triageStatus =
                (parsedData["triageStatus"] as string) ||
                (r.risk_level === "high"
                  ? "review"
                  : r.risk_level === "mod"
                    ? "scheduled"
                    : "completed");

              const rowCells = [
                r.id,
                r.patient_name,
                r.created_at,
                r.score,
                r.risk_level === "high"
                  ? "High Risk"
                  : r.risk_level === "mod"
                    ? "Moderate"
                    : "Low Risk",
                triageStatus,
              ];

              formQuestions.forEach((q) => {
                const val = answers[q.id];
                let display = "-";
                if (val !== undefined && val !== null && val !== "") {
                  if (typeof val === "object") {
                    display = JSON.stringify(val);
                  } else {
                    display = String(val);
                  }
                }
                rowCells.push(display);
              });

              csvContent += rowCells.map(sanitizeCsvCell).join(",") + "\r\n";
            }

            const cleanSlug = formTitle.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
            const filename = `${cleanSlug}-submissions-${new Date().toISOString().slice(0, 10)}.csv`;

            return new Response(csvContent, {
              status: 200,
              headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Cache-Control": "no-store",
              },
            });
          }

          // Count total matching records for pagination
          const countSql = `SELECT count(*) as total FROM submissions ${whereClause}`;
          const countRow = await dbQueryOne<{ total: number }>(countSql, params);
          const total = countRow ? Number(countRow.total) : 0;
          const totalPages = Math.ceil(total / limit) || 1;

          // Query paginated rows
          const querySql = `SELECT id, form_id, patient_name, score, risk_level, data_json, created_at
                            FROM submissions ${whereClause}
                            ORDER BY created_at DESC
                            LIMIT ? OFFSET ?`;
          const rows = await dbQuery<{
            id: string;
            form_id: string;
            patient_name: string;
            score: number;
            risk_level: string;
            data_json: string;
            created_at: string;
          }>(querySql, [...params, limit, offset]);

          // Compute stats scoped to user/tenant
          const statsWhere = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
          const statsSql = `SELECT count(*) as total,
                    COALESCE(SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END), 0) as high,
                    COALESCE(SUM(CASE WHEN risk_level = 'mod' THEN 1 ELSE 0 END), 0) as mod,
                    COALESCE(SUM(CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END), 0) as low,
                    COALESCE(AVG(score), 0) as avgScore
             FROM submissions ${statsWhere}`;
          const statsRow = await dbQueryOne<{
            total: number;
            high: number;
            mod: number;
            low: number;
            avgScore: number;
          }>(statsSql, params).catch(() => null);

          const stats = {
            total: statsRow ? Number(statsRow.total) || 0 : total,
            high: statsRow ? Number(statsRow.high) || 0 : 0,
            mod: statsRow ? Number(statsRow.mod) || 0 : 0,
            low: statsRow ? Number(statsRow.low) || 0 : 0,
            avgScore: statsRow ? Math.round(Number(statsRow.avgScore) || 0) : 0,
          };

          const submissions = await Promise.all(
            rows.map(async (r) => {
              let parsedData: Record<string, unknown> = {};
              try {
                const decrypted = await decryptData(r.data_json);
                parsedData = JSON.parse(decrypted) as Record<string, unknown>;
              } catch (e) {
                console.warn("Decryption fallback for record:", r.id, e);
                parsedData = {};
              }
              return {
                id: r.id,
                formId: r.form_id,
                patientName: r.patient_name,
                score: r.score,
                risk: r.risk_level,
                submittedAt: r.created_at,
                answers: (parsedData["answers"] as Record<string, unknown>) || {},
                triageStatus:
                  (parsedData["triageStatus"] as string) ||
                  (r.risk_level === "high"
                    ? "review"
                    : r.risk_level === "mod"
                      ? "scheduled"
                      : "completed"),
              };
            }),
          );

          return Response.json(
            {
              success: true,
              submissions,
              stats,
              pagination: {
                page,
                limit,
                total,
                totalPages,
              },
            },
            { status: 200 },
          );
        } catch (err) {
          console.error("Failed to fetch submissions", err);
          return Response.json(
            {
              success: false,
              error: "INTERNAL_ERROR",
              message: "Gagal mengambil data submissions dari database.",
            },
            { status: 500 },
          );
        }
      },

      // POST /api/submissions: Receive public intake data & encrypt medical data at rest OR handle bulk purge
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          if (!body || typeof body !== "object") {
            return Response.json(
              {
                success: false,
                error: "INVALID_BODY",
                message: "Data formulir intake tidak valid.",
              },
              { status: 400 },
            );
          }

          // Handle double-authenticated bulk purge of test/dummy submissions
          if (body.action === "bulk-purge") {
            const user = await authenticateRequest(request);
            if (!user) {
              return Response.json(
                { success: false, error: "UNAUTHORIZED", message: "Wajib autentikasi admin." },
                { status: 401 },
              );
            }

            const isSuperAdmin =
              user.role === "superadmin" ||
              user.email === "admin@gmail.com" ||
              user.email === "superadmin@9forms.com";

            const formId = sanitizeString(body.formId || "");
            const mode = sanitizeString(body.mode || "test_only"); // "test_only" or "all"
            const password = typeof body.password === "string" ? body.password : "";

            if (!password) {
              return Response.json(
                {
                  success: false,
                  error: "PASSWORD_REQUIRED",
                  message: "Password admin wajib dimasukkan untuk konfirmasi penghapusan massal.",
                },
                { status: 400 },
              );
            }

            // Double authentication: Verify admin password against stored hash
            const adminRow = await dbQueryOne<{ id: string; password_hash: string }>(
              "SELECT id, password_hash FROM admins WHERE id = ? OR email = ?",
              [user.adminId, user.email],
            );
            if (!adminRow) {
              return Response.json(
                { success: false, error: "ADMIN_NOT_FOUND", message: "Akun admin tidak ditemukan." },
                { status: 404 },
              );
            }

            const passwordOk = await verifyPassword(password, adminRow.password_hash);
            if (!passwordOk) {
              return Response.json(
                {
                  success: false,
                  error: "INVALID_PASSWORD",
                  message: "Password konfirmasi salah. Penghapusan massal dibatalkan demi keamanan.",
                },
                { status: 403 },
              );
            }

            // IDOR check: Non-superadmin cannot purge submissions for forms of another tenant
            if (!isSuperAdmin && formId) {
              const formRow = await dbQueryOne<{ user_id: string }>(
                "SELECT user_id FROM forms WHERE id = ?",
                [formId],
              );
              if (
                formRow &&
                formRow.user_id !== user.adminId &&
                formRow.user_id !== user.email &&
                formRow.user_id !== "admin"
              ) {
                return Response.json(
                  {
                    success: false,
                    error: "FORBIDDEN",
                    message: "Akses ditolak: Anda tidak memiliki akses ke formulir ini.",
                  },
                  { status: 403 },
                );
              }
            }

            // Build parameterized delete condition
            const deleteConditions: string[] = [];
            const deleteParams: unknown[] = [];

            if (formId) {
              deleteConditions.push("form_id = ?");
              deleteParams.push(formId);
            }

            if (!isSuperAdmin) {
              deleteConditions.push("(user_id = ? OR user_id = ?)");
              deleteParams.push(user.adminId, user.email);
            }

            if (mode === "test_only") {
              deleteConditions.push(
                "(patient_name LIKE '%test%' OR patient_name LIKE '%demo%' OR patient_name LIKE '%dummy%' OR patient_name LIKE '%uji%' OR patient_name LIKE '%sample%' OR patient_name LIKE '%simulasi%' OR patient_name LIKE '%Belum Teridentifikasi%' OR score = 0)",
              );
            }

            const whereSql = deleteConditions.length > 0 ? `WHERE ${deleteConditions.join(" AND ")}` : "";
            const countSql = `SELECT count(*) as total FROM submissions ${whereSql}`;
            const targetRow = await dbQueryOne<{ total: number }>(countSql, deleteParams);
            const totalToDelete = targetRow ? Number(targetRow.total) : 0;

            if (totalToDelete > 0) {
              await dbExecute(`DELETE FROM submissions ${whereSql}`, deleteParams);
            }

            return Response.json({
              success: true,
              deletedCount: totalToDelete,
              message: `Berhasil menghapus ${totalToDelete} data ${mode === "test_only" ? "uji coba" : "submisi"} secara permanen.`,
            });
          }

          const rawId =
            body.id && typeof body.id === "string"
              ? body.id.trim()
              : `sub_${crypto.randomUUID()}`;
          const id = sanitizeString(rawId).slice(0, 64);
          const formId = sanitizeString(
            typeof body.formId === "string" ? body.formId : "new-patient-intake",
          ).slice(0, 64);

          const rawName = typeof body.patientName === "string" ? body.patientName.trim() : "";
          const genericNames = [
            "patient",
            "pasien",
            "pasien baru",
            "新患者",
            "anonymous",
            "null",
            "undefined",
            "",
          ];
          const isInvalidName =
            !rawName || genericNames.includes(rawName.toLowerCase()) || rawName.length < 2;

          const patientName = isInvalidName
            ? "Belum Teridentifikasi (Incomplete)"
            : sanitizeString(rawName).slice(0, 100);

          const score = typeof body.score === "number" ? Math.max(0, Math.min(100, body.score)) : 0;
          const riskLevel = ["low", "mod", "high"].includes(String(body.risk))
            ? String(body.risk)
            : "low";

          const rawAnswers =
            typeof body.answers === "object" && body.answers !== null ? body.answers : {};
          const answers = sanitizeObject(rawAnswers);

          // Idempotency check: if submission id already exists, return ok without duplicate insert
          const existing = await dbQueryOne("SELECT id FROM submissions WHERE id = ?", [id]);
          if (existing) {
            return Response.json({
              success: true,
              id,
              message: "Submission sudah tercatat (idempotent).",
            });
          }

          const isTriageIncomplete = isInvalidName || Object.keys(answers).length === 0;
          const triageStatus = isTriageIncomplete
            ? "incomplete"
            : body.triageStatus ||
              (riskLevel === "high" ? "review" : riskLevel === "mod" ? "scheduled" : "completed");

          const plainData = JSON.stringify({
            answers,
            triageStatus,
            clientTimestamp: body.submittedAt || new Date().toISOString(),
          });

          // AES-GCM 256-bit Encryption at Rest
          const encryptedPayload = await encryptData(plainData);

          // Associate tenant ownership from form record
          const formOwner = await dbQueryOne<{ user_id: string }>(
            "SELECT user_id FROM forms WHERE id = ?",
            [formId],
          );
          const submissionUserId = formOwner?.user_id || "admin";

          await dbExecute(
            "INSERT INTO submissions (id, form_id, patient_name, score, risk_level, data_json, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))",
            [id, formId, patientName, score, riskLevel, encryptedPayload, submissionUserId],
          );

          return Response.json(
            {
              success: true,
              id,
              message: "Data formulir pasien berhasil disimpan dan dienkripsi ke database server.",
            },
            { status: 201 },
          );
        } catch (err) {
          console.error("Failed to save submission", err);
          return Response.json(
            {
              success: false,
              error: "INTERNAL_ERROR",
              message: "Gagal menyimpan data intake ke server database.",
            },
            { status: 500 },
          );
        }
      },

      // PUT /api/submissions: Update submission triage status or notes (Admin only)
      PUT: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          if (!user) {
            return Response.json(
              {
                success: false,
                error: "UNAUTHORIZED",
                message: "Akses ditolak: Wajib autentikasi admin.",
              },
              { status: 401 },
            );
          }

          const body = await request.json().catch(() => null);
          if (!body || typeof body !== "object" || !body.id) {
            return Response.json(
              { success: false, error: "INVALID_BODY", message: "ID submission wajib disertakan." },
              { status: 400 },
            );
          }

          const id = sanitizeString(body.id);
          const existing = await dbQueryOne<{ id: string; data_json: string }>(
            "SELECT id, data_json FROM submissions WHERE id = ?",
            [id],
          );

          if (!existing) {
            return Response.json(
              { success: false, error: "NOT_FOUND", message: "Data submission tidak ditemukan." },
              { status: 404 },
            );
          }

          let dataObj: Record<string, unknown> = {};
          try {
            const dec = await decryptData(existing.data_json);
            dataObj = JSON.parse(dec) as Record<string, unknown>;
          } catch (e) {
            void e;
            dataObj = {};
          }

          if (typeof body.triageStatus === "string") {
            dataObj["triageStatus"] = sanitizeString(body.triageStatus);
          }
          if (typeof body.notes === "string") {
            dataObj["clinicalNotes"] = sanitizeString(body.notes);
          }

          const updatedEncrypted = await encryptData(JSON.stringify(dataObj));
          await dbExecute("UPDATE submissions SET data_json = ? WHERE id = ?", [
            updatedEncrypted,
            id,
          ]);

          return Response.json({
            success: true,
            message: "Status submission berhasil diperbarui.",
          });
        } catch (err) {
          console.error("Failed to update submission", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Gagal memperbarui submission." },
            { status: 500 },
          );
        }
      },

      // DELETE /api/submissions: Delete a patient submission (Admin only)
      DELETE: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          if (!user) {
            return Response.json(
              {
                success: false,
                error: "UNAUTHORIZED",
                message: "Akses ditolak: Wajib autentikasi admin.",
              },
              { status: 401 },
            );
          }

          const url = new URL(request.url);
          let id = url.searchParams.get("id") || "";
          if (!id) {
            const body = await request.json().catch(() => null);
            if (body && body.id) id = String(body.id).trim();
          }

          if (!id) {
            return Response.json(
              { success: false, error: "MISSING_ID", message: "ID submission wajib disertakan." },
              { status: 400 },
            );
          }

          const isSuperAdmin =
            user.role === "superadmin" ||
            user.email === "admin@gmail.com" ||
            user.email === "superadmin@9forms.com";

          if (isSuperAdmin) {
            await dbExecute("DELETE FROM submissions WHERE id = ?", [id]);
          } else {
            await dbExecute(
              "DELETE FROM submissions WHERE id = ? AND (user_id = ? OR user_id = ?)",
              [id, user.adminId, user.email],
            );
          }

          return Response.json({
            success: true,
            id,
            message: "Data submission berhasil dihapus dari database server.",
          });
        } catch (err) {
          console.error("Failed to delete submission", err);
          return Response.json(
            {
              success: false,
              error: "INTERNAL_ERROR",
              message: "Gagal menghapus data submission.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
