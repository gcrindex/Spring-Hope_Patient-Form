import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          {
            status: "ok",
            timestamp: new Date().toISOString(),
            pesatRouterConfigured: Boolean(process.env["PESATROUTER_API_KEY"]),
          },
          {
            headers: { "Cache-Control": "no-store" },
          },
        ),
    },
  },
});
