import { createFileRoute } from "@tanstack/react-router";
import { createSession, createSessionCookieHeader, verifyPassword } from "../lib/auth";
import { dbQueryOne } from "../lib/db";

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

          const admin = await dbQueryOne<{ id: string; password_hash: string }>(
            "SELECT id, password_hash FROM admins WHERE email = ?",
            [email],
          );

          if (!admin) {
            return Response.json(
              {
                success: false,
                error: "INVALID_CREDENTIALS",
                message: "Invalid email or password.",
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
                message: "Invalid email or password.",
              },
              { status: 401 },
            );
          }

          const token = await createSession(admin.id);
          const isHttps = request.url.startsWith("https://");
          const cookieHeader = createSessionCookieHeader(token, isHttps);

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
