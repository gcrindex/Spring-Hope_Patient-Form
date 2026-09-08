import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { httpEquiv: "refresh", content: "0; url=/admin.html#/login" },
      { title: "Staff Login — 9forms.com" },
    ],
  }),
  component: AdminLoginRedirect,
});

function AdminLoginRedirect() {
  useEffect(() => {
    window.location.replace("/admin.html#/login");
  }, []);

  return null;
}
