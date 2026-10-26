import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest } from "../lib/auth";
import { decryptData, encryptData } from "../lib/crypto";
import { dbQuery, dbQueryOne } from "../lib/db";
import {
  buildEmrPayload,
  dispatchWebhookWithRetry,
  type EmrConfig,
  validateWebhookUrl,
} from "../lib/emr-webhook";

export const Route = createFileRoute("/api/admin/emr")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          if (!user) {
            return Response.json(
              { success: false, error: "UNAUTHORIZED", message: "Wajib autentikasi admin." },
              { status: 401 },
            );
          }

          // Fetch EMR config
          const row = await dbQueryOne<{ value_encrypted: string; updated_at: string }>(
            "SELECT value_encrypted, updated_at FROM system_settings WHERE key = 'emr_webhook_config'",
          );

          let config: EmrConfig = {
            enabled: false,
            provider: "plato",
            webhookUrl: "",
            webhookSecret: "",
            autoSync: false,
          };

          if (row?.value_encrypted) {
            try {
              const decrypted = await decryptData(row.value_encrypted);
              const parsed = JSON.parse(decrypted);
              config = {
                enabled: Boolean(parsed.enabled),
                provider: parsed.provider || "plato",
                webhookUrl: parsed.webhookUrl || "",
                webhookSecret: parsed.webhookSecret
                  ? parsed.webhookSecret.length > 8
                    ? `${parsed.webhookSecret.slice(0, 4)}••••••••••••••••${parsed.webhookSecret.slice(-4)}`
                    : "••••••••"
                  : "",
                autoSync: Boolean(parsed.autoSync),
                updatedAt: row.updated_at,
              };
            } catch (err) {
              console.warn("Failed to decrypt EMR config", err);
            }
          }

          // Fetch recent 20 logs
          const logs = await dbQuery<{
            id: string;
            webhook_url: string;
            event_type: string;
            status_code: number;
            response_body: string;
            attempt_count: number;
            success: number;
            created_at: string;
          }>("SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 20").catch(() => []);

          return Response.json({
            success: true,
            config,
            logs,
          });
        } catch (err) {
          console.error("EMR GET error", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Gagal memuat konfigurasi EMR." },
            { status: 500 },
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          if (!user) {
            return Response.json(
              { success: false, error: "UNAUTHORIZED", message: "Wajib autentikasi admin." },
              { status: 401 },
            );
          }

          const body = await request.json().catch(() => null);
          if (!body || typeof body !== "object") {
            return Response.json(
              { success: false, error: "INVALID_BODY", message: "Payload request tidak valid." },
              { status: 400 },
            );
          }

          const action = String(body.action || "update-config");

          // ACTION 1: UPDATE CONFIG
          if (action === "update-config") {
            const webhookUrl = String(body.webhookUrl || "").trim();
            const provider = ["plato", "clinicos", "generic"].includes(body.provider)
              ? body.provider
              : "plato";
            const autoSync = Boolean(body.autoSync);
            const enabled = Boolean(body.enabled);

            // SSRF Validation if webhookUrl provided
            if (webhookUrl) {
              const urlCheck = validateWebhookUrl(webhookUrl);
              if (!urlCheck.valid) {
                return Response.json(
                  {
                    success: false,
                    error: "SSRF_VALIDATION_FAILED",
                    message: urlCheck.error || "URL Webhook ditolak oleh sistem keamanan SSRF.",
                  },
                  { status: 400 },
                );
              }
            }

            // Retrieve existing secret if secretKey is masked or omitted
            let secretKey = String(body.webhookSecret || "").trim();
            if (!secretKey || secretKey.includes("••••")) {
              const existingRow = await dbQueryOne<{ value_encrypted: string }>(
                "SELECT value_encrypted FROM system_settings WHERE key = 'emr_webhook_config'",
              );
              if (existingRow) {
                try {
                  const dec = await decryptData(existingRow.value_encrypted);
                  const parsed = JSON.parse(dec);
                  secretKey = parsed.webhookSecret || "";
                } catch {}
              }
            }

            if (!secretKey) {
              // Auto-generate 256-bit hex secret key if none provided
              const randBytes = new Uint8Array(16);
              crypto.getRandomValues(randBytes);
              secretKey = Array.from(randBytes)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            }

            const payloadToEncrypt = JSON.stringify({
              enabled,
              provider,
              webhookUrl,
              webhookSecret: secretKey,
              autoSync,
              updatedAt: new Date().toISOString(),
            });

            const encrypted = await encryptData(payloadToEncrypt);
            const { dbExecute } = await import("../lib/db");
            await dbExecute(
              `INSERT INTO system_settings (key, value_encrypted, updated_at) 
               VALUES ('emr_webhook_config', ?, datetime('now'))
               ON CONFLICT(key) DO UPDATE SET value_encrypted = excluded.value_encrypted, updated_at = datetime('now')`,
              [encrypted],
            );

            return Response.json({
              success: true,
              message: "Konfigurasi EMR Webhook berhasil disimpan.",
            });
          }

          // ACTION 2: TEST PING
          if (action === "test-ping") {
            let targetUrl = String(body.webhookUrl || "").trim();
            let secret = String(body.webhookSecret || "").trim();

            if (!targetUrl || !secret || secret.includes("••••")) {
              const cfgRow = await dbQueryOne<{ value_encrypted: string }>(
                "SELECT value_encrypted FROM system_settings WHERE key = 'emr_webhook_config'",
              );
              if (cfgRow) {
                try {
                  const dec = await decryptData(cfgRow.value_encrypted);
                  const parsed = JSON.parse(dec);
                  if (!targetUrl) targetUrl = parsed.webhookUrl || "";
                  if (!secret || secret.includes("••••")) secret = parsed.webhookSecret || "";
                } catch {}
              }
            }

            if (!targetUrl) {
              return Response.json(
                { success: false, error: "MISSING_URL", message: "URL Webhook wajib diisi." },
                { status: 400 },
              );
            }

            const pingPayload = {
              event: "test.ping",
              timestamp: Math.floor(Date.now() / 1000),
              emr_system: body.provider || "Plato/ClinicOS",
              message: "9forms EMR Webhook Connection Test",
              status: "connected",
            };

            const result = await dispatchWebhookWithRetry(
              targetUrl,
              secret,
              pingPayload,
              "test.ping",
            );

            return Response.json({
              success: result.success,
              statusCode: result.statusCode,
              responseSnippet: result.responseSnippet,
              attempts: result.attempts,
              signature: result.signature,
              error: result.error,
              message: result.success
                ? `Test ping berhasil terkirim ke EMR (HTTP ${result.statusCode}).`
                : `Test ping gagal atau ditolak (HTTP ${result.statusCode}): ${result.error || result.responseSnippet}`,
            });
          }

          // ACTION 3: SYNC SUBMISSION TO EMR
          if (action === "sync-submission") {
            const submissionId = String(body.submissionId || body.id || "").trim();
            if (!submissionId) {
              return Response.json(
                { success: false, error: "MISSING_ID", message: "ID submission wajib disertakan." },
                { status: 400 },
              );
            }

            const subRow = await dbQueryOne<{
              id: string;
              form_id: string;
              patient_name: string;
              score: number;
              risk_level: string;
              data_json: string;
              created_at: string;
            }>("SELECT * FROM submissions WHERE id = ?", [submissionId]);

            if (!subRow) {
              return Response.json(
                { success: false, error: "NOT_FOUND", message: "Data submisi tidak ditemukan." },
                { status: 404 },
              );
            }

            let parsedData: Record<string, unknown> = {};
            try {
              const dec = await decryptData(subRow.data_json);
              parsedData = JSON.parse(dec) as Record<string, unknown>;
            } catch {
              parsedData = {};
            }

            // Retrieve EMR config
            const cfgRow = await dbQueryOne<{ value_encrypted: string }>(
              "SELECT value_encrypted FROM system_settings WHERE key = 'emr_webhook_config'",
            );

            let webhookUrl = "";
            let webhookSecret = "";
            let provider = "plato";

            if (cfgRow?.value_encrypted) {
              try {
                const dec = await decryptData(cfgRow.value_encrypted);
                const parsed = JSON.parse(dec);
                webhookUrl = parsed.webhookUrl || "";
                webhookSecret = parsed.webhookSecret || "";
                provider = parsed.provider || "plato";
              } catch {}
            }

            if (!webhookUrl) {
              return Response.json(
                {
                  success: false,
                  error: "NO_WEBHOOK_CONFIGURED",
                  message:
                    "URL Webhook EMR belum dikonfigurasi. Silakan atur di menu Integrasi & Pengaturan.",
                },
                { status: 400 },
              );
            }

            const emrPayload = buildEmrPayload(
              {
                id: subRow.id,
                formId: subRow.form_id,
                patientName: subRow.patient_name,
                score: subRow.score,
                risk: subRow.risk_level,
                triageStatus: parsedData["triageStatus"] as string,
                submittedAt: subRow.created_at,
                answers: parsedData["answers"] as Record<string, unknown>,
              },
              provider,
            );

            const result = await dispatchWebhookWithRetry(
              webhookUrl,
              webhookSecret,
              emrPayload,
              "patient.intake.completed",
            );

            return Response.json({
              success: result.success,
              statusCode: result.statusCode,
              responseSnippet: result.responseSnippet,
              attempts: result.attempts,
              signature: result.signature,
              error: result.error,
              payload: emrPayload,
              message: result.success
                ? `Data pasien berhasil disinkronkan ke EMR ${provider.toUpperCase()} (HTTP ${result.statusCode}).`
                : `Sinkronisasi ke EMR gagal (HTTP ${result.statusCode}): ${result.error || result.responseSnippet}`,
            });
          }

          // ACTION 4: GET RECENT LOGS
          if (action === "get-logs") {
            const logs = await dbQuery<{
              id: string;
              webhook_url: string;
              event_type: string;
              status_code: number;
              response_body: string;
              attempt_count: number;
              success: number;
              created_at: string;
            }>("SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 25").catch(() => []);

            return Response.json({ success: true, logs });
          }

          return Response.json(
            { success: false, error: "UNKNOWN_ACTION", message: "Aksi tidak dikenali." },
            { status: 400 },
          );
        } catch (err) {
          console.error("EMR POST error", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Gagal memproses request EMR." },
            { status: 500 },
          );
        }
      },
    },
  },
});
