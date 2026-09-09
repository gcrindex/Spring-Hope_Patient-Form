import { createFileRoute } from "@tanstack/react-router";
import { clearSessionCookieHeader, deleteSession, parseSessionCookie } from "../lib/auth";

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const token = parseSessionCookie(request);
          if (token) {
            await deleteSession(token);
          }

          return Response.json(
            { success: true, message: "Logged out successfully." },
            {
              headers: {
                "Set-Cookie": clearSessionCookieHeader(),
                "Cache-Control": "no-store",
              },
            },
          );
        } catch (err) {
          console.error("Admin logout error", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Failed to logout." },
            { status: 500 },
          );
        }
      },
    },
  },
});
