import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest } from "../lib/auth";
import { decryptData, encryptData } from "../lib/crypto";
import { dbExecute, dbQuery, dbQueryOne } from "../lib/db";

function sanitizeString(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/[<>]/g, "") // strip angle brackets
    .trim();
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
          const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10) || 1);
          const limit = Math.min(
            100,
            Math.max(1, parseInt(url.searchParams.get("limit") || "15", 10) || 15),
          );
          const offset = (page - 1) * limit;

          // Build dynamic SQL query with parameters
          const conditions: string[] = [];
          const params: unknown[] = [];

          if (formId) {
            conditions.push("form_id = ?");
            params.push(formId);
          }

          if (risk && ["low", "mod", "high"].includes(risk.toLowerCase())) {
            conditions.push("risk_level = ?");
            params.push(risk.toLowerCase());
          }

          if (search) {
            conditions.push("(patient_name LIKE ? OR id LIKE ?)");
            params.push(`%${search}%`, `%${search}%`);
          }

          const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

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
              pagination: {
                page,
                limit,
                total,
                totalPages,
              },
            },
            { headers: { "Cache-Control": "no-store" } },
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

      // POST /api/submissions: Receive public intake data & encrypt medical data at rest
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

          const rawId =
            body.id && typeof body.id === "string"
              ? body.id.trim()
              : `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
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

          await dbExecute(
            "INSERT INTO submissions (id, form_id, patient_name, score, risk_level, data_json, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))",
            [id, formId, patientName, score, riskLevel, encryptedPayload],
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
    },
  },
});
