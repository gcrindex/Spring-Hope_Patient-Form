import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest, countAdmins, getBusinessInviteSecret } from "../lib/auth";

export const Route = createFileRoute("/api/admin/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const totalAdmins = await countAdmins();
          const user = await authenticateRequest(request);

          return Response.json(
            {
              success: true,
              isSetup: totalAdmins > 0,
              isAuthenticated: Boolean(user),
              inviteToken: user ? getBusinessInviteSecret() : null,
              user: user
                ? {
                    adminId: user.adminId,
                    email: user.email,
                    role: user.role,
                    planTier: user.planTier,
                  }
                : null,
            },
            {
              headers: { "Cache-Control": "no-store" },
            },
          );
        } catch (err) {
          console.error("Admin status check failed", err);
          return Response.json(
            { success: false, error: "INTERNAL_ERROR", message: "Failed to check admin status." },
            { status: 500 },
          );
        }
      },
    },
  },
});
