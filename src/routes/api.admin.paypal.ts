import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest } from "../lib/auth";
import { decryptData, encryptData } from "../lib/crypto";
import { dbExecute, dbQueryOne } from "../lib/db";

export interface PaypalConfig {
  mode: "sandbox" | "live";
  clientId: string;
  secretKey: string;
  webhookId?: string;
  merchantEmail?: string;
  updatedAt?: string;
}

export const Route = createFileRoute("/api/admin/paypal")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          const isSuperAdmin =
            user &&
            (user.role === "superadmin" ||
              user.email === "admin@gmail.com" ||
              user.email === "admin@springhope.clinic" ||
              user.email === "superadmin@9forms.com");

          if (!user || !isSuperAdmin) {
            return Response.json(
              {
                success: false,
                error: "FORBIDDEN",
                message: "Akses ditolak. Konfigurasi PayPal hanya untuk Super Administrator.",
              },
              { status: 403 },
            );
          }

          const row = await dbQueryOne<{ value_encrypted: string; updated_at: string }>(
            "SELECT value_encrypted, updated_at FROM system_settings WHERE key = 'paypal_credentials'",
          );

          let config: PaypalConfig = {
            mode: "sandbox",
            clientId: "",
            secretKey: "",
            webhookId: "",
            merchantEmail: "",
          };

          if (row?.value_encrypted) {
            try {
              const decrypted = await decryptData(row.value_encrypted);
              const parsed = JSON.parse(decrypted);
              config = {
                mode: parsed.mode || "sandbox",
                clientId: parsed.clientId || "",
                // Mask Secret Key for security (e.g. "ECa1...9b2z")
                secretKey: parsed.secretKey
                  ? parsed.secretKey.length > 8
                    ? `${parsed.secretKey.slice(0, 4)}••••••••••••••••${parsed.secretKey.slice(-4)}`
                    : "••••••••"
                  : "",
                webhookId: parsed.webhookId || "",
                merchantEmail: parsed.merchantEmail || "",
                updatedAt: row.updated_at,
              };
            } catch (e) {
              console.error("Failed to decrypt paypal credentials", e);
            }
          }

          return Response.json(
            {
              success: true,
              isConfigured: Boolean(config.clientId),
              config,
            },
            { headers: { "Cache-Control": "no-store" } },
          );
        } catch (err) {
          console.error("PayPal config fetch error", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Failed to fetch PayPal config." },
            { status: 500 },
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const user = await authenticateRequest(request);
          const isSuperAdmin =
            user &&
            (user.role === "superadmin" ||
              user.email === "admin@gmail.com" ||
              user.email === "admin@springhope.clinic" ||
              user.email === "superadmin@9forms.com");

          if (!user || !isSuperAdmin) {
            return Response.json(
              {
                success: false,
                error: "FORBIDDEN",
                message: "Akses ditolak. Konfigurasi PayPal hanya untuk Super Administrator.",
              },
              { status: 403 },
            );
          }

          const body = await request.json().catch(() => null);
          if (!body) {
            return Response.json(
              { success: false, error: "INVALID_BODY", message: "Invalid payload." },
              { status: 400 },
            );
          }

          const { action, mode, clientId, secretKey, webhookId, merchantEmail } = body;

	          // 1. SAVE PAYPAL CREDENTIALS
	          if (action === "save") {
	            let finalSecret = String(secretKey || "").trim();

	            // If secretKey was sent masked, keep existing secret
	            if (finalSecret.includes("••••")) {
	              const existingRow = await dbQueryOne<{ value_encrypted: string }>(
	                "SELECT value_encrypted FROM system_settings WHERE key = 'paypal_credentials'",
	              );
	              if (existingRow?.value_encrypted) {
	                const dec = await decryptData(existingRow.value_encrypted);
	                const p = JSON.parse(dec);
	                finalSecret = p.secretKey || "";
	              }
	            }

	            const cleanClientId = String(clientId || "").trim();
	            const cleanMode = mode === "live" ? "live" : "sandbox";
	            const cleanWebhook = String(webhookId || "").trim();
	            const cleanMerchant = String(merchantEmail || "").trim();

	            // If user explicitly saves empty clientId and empty secretKey, clear the secret completely
	            if (!cleanClientId && !finalSecret) {
	              await dbExecute("DELETE FROM system_settings WHERE key = 'paypal_credentials'");
	              return Response.json({
	                success: true,
	                message: "Kredensial PayPal berhasil dikosongkan.",
	              });
	            }

	            const payloadToEncrypt = JSON.stringify({
	              mode: cleanMode,
	              clientId: cleanClientId,
	              secretKey: finalSecret,
	              webhookId: cleanWebhook,
	              merchantEmail: cleanMerchant,
	            });

	            const encrypted = await encryptData(payloadToEncrypt);

            // Upsert into system_settings
            const existing = await dbQueryOne<{ key: string }>(
              "SELECT key FROM system_settings WHERE key = 'paypal_credentials'",
            );
            if (existing) {
              await dbExecute(
                "UPDATE system_settings SET value_encrypted = ?, updated_at = datetime('now') WHERE key = 'paypal_credentials'",
                [encrypted],
              );
            } else {
              await dbExecute(
                "INSERT INTO system_settings (key, value_encrypted, updated_at) VALUES ('paypal_credentials', ?, datetime('now'))",
                [encrypted],
              );
            }

            return Response.json({
              success: true,
              message: "Kredensial PayPal berhasil disimpan & dienkripsi AES-256!",
            });
          }

          // 2. TEST PAYPAL CONNECTION VIA OFFICIAL API
          if (action === "test") {
            let testClientId = String(clientId || "").trim();
            let testSecretKey = String(secretKey || "").trim();
            const testMode = mode === "live" ? "live" : "sandbox";

            if (testSecretKey.includes("••••") || !testSecretKey || !testClientId) {
              const existingRow = await dbQueryOne<{ value_encrypted: string }>(
                "SELECT value_encrypted FROM system_settings WHERE key = 'paypal_credentials'",
              );
              if (existingRow?.value_encrypted) {
                const dec = await decryptData(existingRow.value_encrypted);
                const p = JSON.parse(dec);
                testClientId = testClientId || p.clientId || "";
                testSecretKey = testSecretKey && !testSecretKey.includes("••••") ? testSecretKey : p.secretKey || "";
              }
            }

            if (!testClientId || !testSecretKey) {
              return Response.json(
                {
                  success: false,
                  error: "MISSING_CREDENTIALS",
                  message: "Client ID dan Secret Key wajib diisi untuk menguji koneksi PayPal.",
                },
                { status: 400 },
              );
            }

            const apiHost =
              testMode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

            // Authenticate with PayPal OAuth 2.0 endpoint
            const authHeader = btoa(`${testClientId}:${testSecretKey}`);
            const paypalRes = await fetch(`${apiHost}/v1/oauth2/token`, {
              method: "POST",
              headers: {
                Authorization: `Basic ${authHeader}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: "grant_type=client_credentials",
            });

            const paypalData = await paypalRes.json().catch(() => ({}));

            if (paypalRes.ok && (paypalData as { access_token?: string }).access_token) {
              const expiresIn = (paypalData as { expires_in?: number }).expires_in || 32400;
              return Response.json({
                success: true,
                message: `Koneksi PayPal ${testMode.toUpperCase()} Berhasil! Terotentikasi resmi (Token valid ${Math.round(expiresIn / 3600)} jam).`,
                mode: testMode,
                appId: (paypalData as { app_id?: string }).app_id || "PayPal Verified",
              });
            } else {
              return Response.json(
                {
                  success: false,
                  error: "PAYPAL_AUTH_FAILED",
                  message:
                    (paypalData as { error_description?: string }).error_description ||
                    "Kredensial PayPal ditolak oleh server PayPal. Periksa Client ID & Secret Key Anda.",
                },
                { status: 400 },
              );
            }
          }

          return Response.json(
            { success: false, error: "UNKNOWN_ACTION", message: "Aksi tidak dikenali." },
            { status: 400 },
          );
        } catch (err) {
          console.error("PayPal config mutation error", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Gagal menyimpan konfigurasi PayPal." },
            { status: 500 },
          );
        }
      },
    },
  },
});
