import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest, countAdmins, getBusinessInviteSecret } from "../lib/auth";
import { dbQueryOne } from "../lib/db";

export const Route = createFileRoute("/api/admin/status")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const totalAdmins = await countAdmins();
          const user = await authenticateRequest(request);
          const isSuperAdmin =
            user &&
            (user.role === "superadmin" ||
              user.email === "admin@gmail.com" ||
              user.email === "superadmin@9forms.com");

          let quota = null;
          if (user) {
            const rawTier = isSuperAdmin
              ? "enterprise"
              : (user.planTier || "business_monthly").toLowerCase();
            const isYearly = rawTier.includes("yearly") || rawTier.includes("annual");
            const baseTier = rawTier.replace(/_monthly|_yearly/g, "");

            // Total responses / submissions count
            const subRow = await dbQueryOne<{ count: number }>("SELECT count(*) as count FROM submissions");
            const responsesUsed = subRow ? Number(subRow.count) : 0;

            let responseLimit: number | null = 10000;
            let seatsLimit: number | null = 5;
            let tierName = "Business Plan ($99/mo)";
            let removeBranding = true;

            if (baseTier === "enterprise") {
              responseLimit = null; // Unlimited
              seatsLimit = null; // Unlimited
              tierName = "Enterprise Plan (Custom SLA)";
              removeBranding = true;
            } else if (baseTier === "plus") {
              responseLimit = 1000;
              seatsLimit = 3;
              tierName = isYearly ? "Plus Plan ($50/mo · $600/yr)" : "Plus Plan ($59/mo)";
              removeBranding = true;
            } else if (baseTier === "basic") {
              responseLimit = 100;
              seatsLimit = 1;
              tierName = isYearly ? "Basic Plan ($25/mo · $300/yr)" : "Basic Plan ($29/mo)";
              removeBranding = false;
            } else {
              responseLimit = 10000;
              seatsLimit = 5;
              tierName = isYearly ? "Business Plan ($83/mo · $996/yr · Max)" : "Business Plan ($99/mo · Level Max)";
              removeBranding = true;
            }

            const responsesRemaining =
              responseLimit === null ? null : Math.max(0, responseLimit - responsesUsed);
            const percentageUsed =
              responseLimit === null
                ? 0
                : Math.min(100, Math.round((responsesUsed / responseLimit) * 100));

            quota = {
              tier: baseTier,
              tierName,
              isYearly,
              responsesUsed,
              responseLimit,
              responsesRemaining,
              percentageUsed,
              seatsLimit,
              removeBranding,
            };
          }

          return Response.json(
            {
              success: true,
              isSetup: totalAdmins > 0,
              isAuthenticated: Boolean(user),
              inviteToken: isSuperAdmin ? getBusinessInviteSecret() : null,
              user: user
                ? {
                    adminId: user.adminId,
                    email: user.email,
                    role: isSuperAdmin ? "superadmin" : user.role,
                    planTier: user.planTier,
                  }
                : null,
              quota,
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
