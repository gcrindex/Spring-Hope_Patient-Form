import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "9forms.com — Form Builder Admin" },
      {
        name: "description",
        content: "9forms.com multi-industry form builder and admin portal.",
      },
    ],
  }),
  component: AdminRedirectPage,
});

function AdminRedirectPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth =
        localStorage.getItem("pf_loggedin") === "1" ||
        sessionStorage.getItem("pf_loggedin") === "1" ||
        localStorage.getItem("pf_admin_auth") === "authenticated" ||
        sessionStorage.getItem("pf_admin_auth") === "authenticated";
      const hash = window.location.hash || (isAuth ? "#/dashboard" : "#/login");
      window.location.replace(`/admin.html${hash}`);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#F4F6F9",
        color: "#10233F",
        fontFamily: "Inter, sans-serif",
        fontSize: "14px",
      }}
    >
      Loading Admin Dashboard...
    </div>
  );
}
