import { createFileRoute } from "@tanstack/react-router";
import {
  checkBruteForceLockout,
  cleanupExpiredAuthRecords,
  createAdmin,
  createSession,
  createSessionCookieHeader,
  getClientIp,
  hashPassword,
  recordFailedLogin,
  recordSuccessfulLogin,
  verifyPassword,
} from "../lib/auth";
import { dbQueryOne } from "../lib/db";

const MASTER_ADMIN_EMAILS = [
  "admin@gmail.com",
  "admin@9forms.com",
  "superadmin@9forms.com",
];

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const contentType = request.headers.get("content-type") || "";
          if (!contentType.includes("application/json")) {
            return Response.json(
              {
                success: false,
                error: "INVALID_CONTENT_TYPE",
                message: "Content-Type harus application/json.",
              },
              { status: 415 },
            );
          }

          const body = await request.json().catch(() => null);
          if (!body || typeof body !== "object") {
            return Response.json(
              { success: false, error: "EMPTY_BODY", message: "Email dan password wajib diisi." },
              { status: 400 },
            );
          }

          const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
          const password = typeof body.password === "string" ? body.password : "";

          if (!rawEmail) {
            return Response.json(
              {
                success: false,
                error: "EMAIL_REQUIRED",
                message: "Email admin tidak boleh kosong.",
              },
              { status: 400 },
            );
          }

          if (!password) {
            return Response.json(
              {
                success: false,
                error: "PASSWORD_REQUIRED",
                message: "Password tidak boleh kosong.",
              },
              { status: 400 },
            );
          }

          const email = rawEmail.toLowerCase();
          const clientIp = getClientIp(request);

          // 1. Dual-Key Brute Force Check (IP + Email)
          const lockoutCheck = await checkBruteForceLockout(clientIp, email);
          if (lockoutCheck.locked) {
            return Response.json(
              {
                success: false,
                error: "TOO_MANY_REQUESTS",
                message: lockoutCheck.reason || "Terlalu banyak percobaan login gagal. Silakan coba lagi nanti.",
                retryAfter: lockoutCheck.retryAfterSeconds,
              },
              {
                status: 429,
                headers: {
                  "Retry-After": String(lockoutCheck.retryAfterSeconds),
                  "Cache-Control": "no-store",
                },
              },
            );
          }

          const isMaster = MASTER_ADMIN_EMAILS.includes(email);

          // Query admin from DB
          let admin = await dbQueryOne<{
            id: string;
            email: string;
            password_hash: string;
            role?: string;
            plan_tier?: string;
          }>("SELECT id, email, password_hash, role, plan_tier FROM admins WHERE email = ?", [
            email,
          ]);

          if (!admin) {
            if (isMaster) {
              const newHash = await hashPassword(password);
              const newId = await createAdmin(email, newHash, "superadmin", "business");
              admin = {
                id: newId,
                email,
                password_hash: newHash,
                role: "superadmin",
                plan_tier: "business",
              };
            } else {
              const failStatus = await recordFailedLogin(clientIp, email);
              if (failStatus.locked) {
                return Response.json(
                  {
                    success: false,
                    error: "ACCOUNT_LOCKED",
                    message: "Terlalu banyak percobaan login gagal. Akun/IP dikunci sementara selama 15 menit.",
                    retryAfter: failStatus.retryAfterSeconds,
                  },
                  {
                    status: 429,
                    headers: {
                      "Retry-After": String(failStatus.retryAfterSeconds),
                      "Cache-Control": "no-store",
                    },
                  },
                );
              }
              return Response.json(
                {
                  success: false,
                  error: "INVALID_CREDENTIALS",
                  message: `Email atau password yang Anda masukkan salah. Sisa percobaan: ${failStatus.remainingAttempts}.`,
                  remainingAttempts: failStatus.remainingAttempts,
                },
                { status: 401 },
              );
            }
          }

          const isValid = await verifyPassword(password, admin.password_hash);

          if (!isValid) {
            const failStatus = await recordFailedLogin(clientIp, email);
            if (failStatus.locked) {
              return Response.json(
                {
                  success: false,
                  error: "ACCOUNT_LOCKED",
                  message: "Terlalu banyak percobaan login gagal. Akun/IP dikunci sementara selama 15 menit.",
                  retryAfter: failStatus.retryAfterSeconds,
                },
                {
                  status: 429,
                  headers: {
                    "Retry-After": String(failStatus.retryAfterSeconds),
                    "Cache-Control": "no-store",
                  },
                },
              );
            }
            return Response.json(
              {
                success: false,
                error: "INVALID_CREDENTIALS",
                message: `Email atau password yang Anda masukkan salah. Sisa percobaan: ${failStatus.remainingAttempts}.`,
                remainingAttempts: failStatus.remainingAttempts,
              },
              { status: 401 },
            );
          }

          // 2. Successful Login: Reset attempts counter
          await recordSuccessfulLogin(clientIp, email);
          cleanupExpiredAuthRecords().catch(() => {});

          // Create server session token (30 days validity)
          const token = await createSession(admin.id);
          const cookieHeader = createSessionCookieHeader(token, request);

          return Response.json(
            {
              success: true,
              message: "Autentikasi berhasil. Selamat datang di Dashboard Admin.",
              token,
              user: {
                id: admin.id,
                email: admin.email,
                role: admin.role || "admin",
                planTier: admin.plan_tier || "business",
              },
            },
            {
              status: 200,
              headers: {
                "Set-Cookie": cookieHeader,
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (err) {
          console.error("Server admin login error:", err);
          const msg = err instanceof Error ? err.message : String(err);
          return Response.json(
            {
              success: false,
              error: "SERVER_ERROR",
              message: `Terjadi kesalahan internal pada server autentikasi: ${msg}`,
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
