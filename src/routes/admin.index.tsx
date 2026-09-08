import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { httpEquiv: "refresh", content: "0; url=/admin.html" },
      { title: "9forms.com — Form Builder Admin" },
    ],
  }),
  component: AdminRedirectPage,
});

function AdminRedirectPage() {
  useEffect(() => {
    window.location.replace("/admin.html");
  }, []);

  return null;
}
