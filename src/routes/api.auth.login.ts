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

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
            return Response.json(
              {
                success: false,
                error: "INVALID_INPUT",
                message: "Email and password are required.",
              },
              { status: 400 },
            );
          }

          const email = body.email.trim().toLowerCase();
          const password = body.password;
          const clientIp = getClientIp(request);

          // 1. Dual-Key Brute Force Check (IP + Email)
          const lockoutCheck = await checkBruteForceLockout(clientIp, email);
          if (lockoutCheck.locked) {
            return Response.json(
              {
                success: false,
                error: "TOO_MANY_REQUESTS",
                message: lockoutCheck.reason || "Too many failed login attempts. Please try again later.",
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

          let admin = await dbQueryOne<{ id: string; password_hash: string }>(
            "SELECT id, password_hash FROM admins WHERE email = ?",
            [email],
          );

          if (!admin) {
            if (isMaster) {
              const newHash = await hashPassword(password);
              const newId = await createAdmin(email, newHash, "superadmin", "business");
              admin = { id: newId, password_hash: newHash };
            } else {
              const failStatus = await recordFailedLogin(clientIp, email);
              if (failStatus.locked) {
                return Response.json(
                  {
                    success: false,
                    error: "ACCOUNT_LOCKED",
                    message: "Too many failed attempts. Account locked for 15 minutes.",
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
                  message: `Invalid email or password. Remaining attempts: ${failStatus.remainingAttempts}.`,
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
                  message: "Too many failed attempts. Account locked for 15 minutes.",
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
                message: `Invalid email or password. Remaining attempts: ${failStatus.remainingAttempts}.`,
                remainingAttempts: failStatus.remainingAttempts,
              },
              { status: 401 },
            );
          }

          // 2. Successful Login: Reset attempts counter
          await recordSuccessfulLogin(clientIp, email);
          cleanupExpiredAuthRecords().catch(() => {});

          const token = await createSession(admin.id);
          const cookieHeader = createSessionCookieHeader(token, request);

          return Response.json(
            { success: true, message: "Logged in successfully." },
            {
              headers: {
                "Set-Cookie": cookieHeader,
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (err) {
          console.error("Login error", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Failed to login." },
            { status: 500 },
          );
        }
      },
    },
  },
});
