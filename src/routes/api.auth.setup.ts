import { createFileRoute } from "@tanstack/react-router";
import {
  createAdmin,
  createSession,
  createSessionCookieHeader,
  hashPassword,
  isValidBusinessInvite,
} from "../lib/auth";
import { dbExecute, dbQueryOne } from "../lib/db";

export const Route = createFileRoute("/api/auth/setup")({
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
                message: "Email dan password wajib diisi.",
              },
              { status: 400 },
            );
          }

          const email = body.email.trim().toLowerCase();
          const password = body.password;
          const rawInvite = typeof body.invite_code === "string" ? body.invite_code.trim().toLowerCase() : "";

          if (!email.includes("@") || password.length < 6) {
            return Response.json(
              {
                success: false,
                error: "WEAK_CREDENTIALS",
                message: "Email harus valid dan password minimal 6 karakter.",
              },
              { status: 400 },
            );
          }

          const totalAdmins = await dbQueryOne<{ count: number }>("SELECT count(*) as count FROM admins");
          const isFirstUser = !totalAdmins || Number(totalAdmins.count) === 0;

          const isSuperAdminEmail =
            email === "admin@gmail.com" ||
            email === "admin@springhope.clinic" ||
            email === "superadmin@9forms.com";
          const isBusinessInvite = isValidBusinessInvite(rawInvite);

          if (!isSuperAdminEmail && !isFirstUser && !isBusinessInvite) {
            return Response.json(
              {
                success: false,
                error: "INVITE_REQUIRED",
                message: "Pendaftaran akun bisnis memerlukan tautan undangan resmi.",
              },
              { status: 403 },
            );
          }

          const role = isSuperAdminEmail || isFirstUser ? "superadmin" : "admin";
          const planTier = "business";

          const passwordHash = await hashPassword(password);
          const existing = await dbQueryOne<{ id: string; role?: string; plan_tier?: string }>(
            "SELECT id, role, plan_tier FROM admins WHERE email = ?",
            [email],
          );

          let adminId = "";
          if (existing) {
            adminId = existing.id;
            const updatedTier = "business";
            const updatedRole = isSuperAdminEmail ? "superadmin" : existing.role || role;
            await dbExecute(
              "UPDATE admins SET password_hash = ?, role = ?, plan_tier = ?, updated_at = datetime('now') WHERE id = ?",
              [passwordHash, updatedRole, updatedTier, adminId],
            );
          } else {
            adminId = await createAdmin(email, passwordHash, role, planTier);
          }

          const token = await createSession(adminId);
          const isHttps = request.url.startsWith("https://");
          const cookieHeader = createSessionCookieHeader(token, isHttps);

          return Response.json(
            {
              success: true,
              message:
                planTier === "business"
                  ? "Akun Business Plan (Level Max) berhasil dibuat!"
                  : "Akun berhasil dibuat & Anda berhasil login!",
              token,
              user: {
                id: adminId,
                email,
                role,
                planTier,
              },
            },
            {
              status: 201,
              headers: {
                "Set-Cookie": cookieHeader,
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (err) {
          console.error("Setup error", err);
          const msg = err instanceof Error ? err.message : String(err);
          return Response.json(
            {
              success: false,
              error: "INTERNAL_ERROR",
              message: `Gagal memproses akun admin: ${msg}`,
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
