import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest, countAdmins } from "../lib/auth";

export const Route = createFileRoute("/api/auth/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const totalAdmins = await countAdmins();
          const user = await authenticateRequest(request);

          return Response.json(
            {
              isSetup: totalAdmins > 0,
              isAuthenticated: Boolean(user),
              user: user ? { email: user.email } : null,
            },
            {
              headers: { "Cache-Control": "no-store" },
            },
          );
        } catch (err) {
          console.error("Auth status check failed", err);
          return Response.json(
            { error: "INTERNAL_ERROR", message: "Failed to check auth status" },
            { status: 500 },
          );
        }
      },
    },
  },
});
