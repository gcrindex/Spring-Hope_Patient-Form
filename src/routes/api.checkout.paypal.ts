import { createFileRoute } from "@tanstack/react-router";
import {
  createAdmin,
  createSession,
  createSessionCookieHeader,
  hashPassword,
} from "../lib/auth";
import { decryptData } from "../lib/crypto";
import { dbExecute, dbQueryOne } from "../lib/db";

const PLAN_PRICING: Record<string, { name: string; amount: string; tier: string }> = {
  basic_monthly: { name: "Basic Plan (Monthly)", amount: "29.00", tier: "basic_monthly" },
  basic_yearly: { name: "Basic Plan (Annual)", amount: "300.00", tier: "basic_yearly" },
  plus_monthly: { name: "Plus Plan (Monthly)", amount: "59.00", tier: "plus_monthly" },
  plus_yearly: { name: "Plus Plan (Annual)", amount: "600.00", tier: "plus_yearly" },
  business_monthly: { name: "Business Plan (Monthly)", amount: "99.00", tier: "business_monthly" },
  business_yearly: { name: "Business Plan (Annual)", amount: "996.00", tier: "business_yearly" },
};

async function getPaypalCredentials() {
  const row = await dbQueryOne<{ value_encrypted: string }>(
    "SELECT value_encrypted FROM system_settings WHERE key = 'paypal_credentials'",
  );
  if (!row?.value_encrypted) return null;
  try {
    const dec = await decryptData(row.value_encrypted);
    return JSON.parse(dec) as {
      mode: "sandbox" | "live";
      clientId: string;
      secretKey: string;
    };
  } catch {
    return null;
  }
}

async function getPaypalAccessToken(creds: { mode: string; clientId: string; secretKey: string }) {
  const apiHost =
    creds.mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
  const authHeader = btoa(`${creds.clientId}:${creds.secretKey}`);

  const res = await fetch(`${apiHost}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = (await res.json().catch(() => ({}))) as { access_token?: string };
  return { token: data.access_token || null, apiHost };
}

export const Route = createFileRoute("/api/checkout/paypal")({
  server: {
    handlers: {
      // 1. GET: Public Client ID & Plan details for PayPal SDK script
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const planKey = url.searchParams.get("plan") || "plus_monthly";
        const planInfo = PLAN_PRICING[planKey] || PLAN_PRICING.plus_monthly;

        const creds = await getPaypalCredentials();
        if (!creds || !creds.clientId) {
          return Response.json(
            {
              success: true,
              isConfigured: false,
              mode: "sandbox",
              clientId: "sb",
              currency: "USD",
              plan: planInfo,
              message: "PayPal sandbox demo mode active.",
            },
            { headers: { "Cache-Control": "no-store" } },
          );
        }

        return Response.json(
          {
            success: true,
            isConfigured: true,
            clientId: creds.clientId,
            mode: creds.mode || "live",
            currency: "USD",
            plan: planInfo,
          },
          { headers: { "Cache-Control": "no-store" } },
        );
      },

      // 2. POST: Create Order OR Capture Payment & Auto-Provision Account
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => null)) as {
            action?: string;
            planKey?: string;
            orderId?: string;
            email?: string;
            password?: string;
          } | null;

          if (!body || !body.action) {
            return Response.json(
              { success: false, error: "INVALID_ACTION", message: "Action is required." },
              { status: 400 },
            );
          }

          const creds = await getPaypalCredentials();
          const planKey = body.planKey || "plus_monthly";
          const planInfo = PLAN_PRICING[planKey] || PLAN_PRICING.plus_monthly;

          // ACTION A: CREATE PAYPAL ORDER
          if (body.action === "create-order") {
            if (!creds || !creds.clientId || !creds.secretKey || creds.clientId === "sb") {
              // Seamless Sandbox/Demo Order
              const mockOrderId = `ORDER_SB_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
              return Response.json({ success: true, orderId: mockOrderId });
            }

            const { token, apiHost } = await getPaypalAccessToken(creds);
            if (!token) {
              return Response.json(
                { success: false, error: "AUTH_FAILED", message: "Failed to authenticate with PayPal." },
                { status: 502 },
              );
            }

            const orderPayload = {
              intent: "CAPTURE",
              purchase_units: [
                {
                  reference_id: planKey,
                  description: `9forms.com - ${planInfo.name}`,
                  amount: {
                    currency_code: "USD",
                    value: planInfo.amount,
                  },
                },
              ],
              application_context: {
                brand_name: "9forms.com",
                landing_page: "NO_PREFERENCE",
                user_action: "PAY_NOW",
              },
            };

            const orderRes = await fetch(`${apiHost}/v2/checkout/orders`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderPayload),
            });

            const orderData = (await orderRes.json().catch(() => ({}))) as { id?: string };
            if (orderRes.ok && orderData.id) {
              return Response.json({ success: true, orderId: orderData.id });
            } else {
              return Response.json(
                { success: false, error: "ORDER_FAILED", message: "Failed to create PayPal order." },
                { status: 400 },
              );
            }
          }

          // ACTION B: CAPTURE ORDER & AUTO-PROVISION ACCOUNT
          if (body.action === "capture-order") {
            const { orderId, email, password } = body;
            if (!orderId || !email || !password || password.length < 6) {
              return Response.json(
                {
                  success: false,
                  error: "INVALID_INPUT",
                  message: "Valid email and password (min. 6 chars) are required.",
                },
                { status: 400 },
              );
            }

            // Idempotency Check: Prevent double charge / duplicate transaction processing
            const existingTx = await dbQueryOne<{ id: string; user_id: string }>(
              "SELECT id, user_id FROM transactions WHERE order_id = ?",
              [orderId],
            );
            if (existingTx) {
              const sessionToken = await createSession(existingTx.user_id);
              const cookieHeader = createSessionCookieHeader(sessionToken);
              return new Response(
                JSON.stringify({
                  success: true,
                  message: "Transaksi ini sudah diproses sebelumnya (Idempotent).",
                  redirect: "/business.html#/dashboard",
                }),
                {
                  status: 200,
                  headers: {
                    "Content-Type": "application/json",
                    "Set-Cookie": cookieHeader,
                  },
                },
              );
            }

            let captureId = `cap_${Date.now()}`;
            let captureStatus = "COMPLETED";

            const isLivePaypal = Boolean(creds && creds.clientId && creds.secretKey && creds.clientId !== "sb");

            if (isLivePaypal) {
              const { token, apiHost } = await getPaypalAccessToken(creds);
              if (!token) {
                return Response.json(
                  { success: false, error: "AUTH_FAILED", message: "Failed to authenticate with PayPal." },
                  { status: 502 },
                );
              }

              const capRes = await fetch(`${apiHost}/v2/checkout/orders/${orderId}/capture`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });

              const capData = (await capRes.json().catch(() => ({}))) as {
                status?: string;
                purchase_units?: Array<{
                  payments?: {
                    captures?: Array<{ id?: string; status?: string }>;
                  };
                }>;
              };

              captureStatus = capData.status || "FAILED";
              captureId =
                capData.purchase_units?.[0]?.payments?.captures?.[0]?.id || `cap_${Date.now()}`;

              if (!capRes.ok || (captureStatus !== "COMPLETED" && captureStatus !== "APPROVED")) {
                return Response.json(
                  {
                    success: false,
                    error: "CAPTURE_FAILED",
                    message: "Payment could not be completed. Please try again or use another payment method.",
                  },
                  { status: 400 },
                );
              }
            }

            // Auto-provision admin user account
            const cleanEmail = String(email).trim().toLowerCase();
            const passwordHash = await hashPassword(password);
            const existingUser = await dbQueryOne<{ id: string; role?: string }>(
              "SELECT id, role FROM admins WHERE email = ?",
              [cleanEmail],
            );

            let userId = "";
            if (existingUser) {
              userId = existingUser.id;
              await dbExecute(
                "UPDATE admins SET plan_tier = ?, updated_at = datetime('now') WHERE id = ?",
                [planInfo.tier, userId],
              );
            } else {
              userId = await createAdmin(cleanEmail, passwordHash, "admin", planInfo.tier);
            }

            // Record transaction
            const txId = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
            await dbExecute(
              `INSERT INTO transactions (id, order_id, payer_email, user_id, plan_tier, amount, currency, status, paypal_capture_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                txId,
                orderId,
                cleanEmail,
                userId,
                planInfo.tier,
                Number.parseFloat(planInfo.amount),
                "USD",
                "completed",
                captureId,
              ],
            );

            // Create session
            const sessionToken = await createSession(userId);
            const cookieHeader = createSessionCookieHeader(sessionToken);

            return new Response(
              JSON.stringify({
                success: true,
                message: "Payment captured and account activated successfully!",
                user: { id: userId, email: cleanEmail, plan_tier: planInfo.tier },
                redirect: "/business.html#/dashboard",
              }),
              {
                status: 200,
                headers: {
                  "Content-Type": "application/json",
                  "Set-Cookie": cookieHeader,
                },
              },
            );
          }

          return Response.json(
            { success: false, error: "UNKNOWN_ACTION", message: "Action is not supported." },
            { status: 400 },
          );
        } catch (err) {
          console.error("PayPal checkout error", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "An unexpected error occurred." },
            { status: 500 },
          );
        }
      },
    },
  },
});
