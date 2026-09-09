import { createFileRoute } from "@tanstack/react-router";
import { createSession, createSessionCookieHeader, verifyPassword } from "../lib/auth";
import { dbQueryOne } from "../lib/db";

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

          // Query admin from DB
          const admin = await dbQueryOne<{ id: string; email: string; password_hash: string }>(
            "SELECT id, email, password_hash FROM admins WHERE email = ?",
            [email],
          );

          if (!admin) {
            return Response.json(
              {
                success: false,
                error: "INVALID_CREDENTIALS",
                message: "Email atau password yang Anda masukkan salah.",
              },
              { status: 401 },
            );
          }

          const isValid = await verifyPassword(password, admin.password_hash);
          if (!isValid) {
            return Response.json(
              {
                success: false,
                error: "INVALID_CREDENTIALS",
                message: "Email atau password yang Anda masukkan salah.",
              },
              { status: 401 },
            );
          }

          // Create server session token (30 days validity)
          const token = await createSession(admin.id);
          const isHttps = request.url.startsWith("https://");
          const cookieHeader = createSessionCookieHeader(token, isHttps);

          return Response.json(
            {
              success: true,
              message: "Autentikasi berhasil. Selamat datang di Dashboard Admin.",
              token,
              user: {
                id: admin.id,
                email: admin.email,
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
