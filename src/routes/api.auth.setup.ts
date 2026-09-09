import { createFileRoute } from "@tanstack/react-router";
import { createAdmin, createSession, createSessionCookieHeader, hashPassword } from "../lib/auth";
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

          const passwordHash = await hashPassword(password);
          const existing = await dbQueryOne<{ id: string }>(
            "SELECT id FROM admins WHERE email = ?",
            [email],
          );

          let adminId = "";
          if (existing) {
            adminId = existing.id;
            await dbExecute(
              "UPDATE admins SET password_hash = ?, updated_at = datetime('now') WHERE id = ?",
              [passwordHash, adminId],
            );
          } else {
            adminId = await createAdmin(email, passwordHash);
          }

          const token = await createSession(adminId);
          const isHttps = request.url.startsWith("https://");
          const cookieHeader = createSessionCookieHeader(token, isHttps);

          return Response.json(
            {
              success: true,
              message: "Akun admin berhasil disimpan & Anda otomatis login!",
              token,
              user: {
                id: adminId,
                email,
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
