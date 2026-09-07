import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Staff Login — 9forms.com" }] }),
  component: AdminLoginRedirect,
});

function AdminLoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/admin" });
  }, [navigate]);

  return null;
}
