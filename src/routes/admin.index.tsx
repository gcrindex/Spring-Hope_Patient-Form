import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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
  component: AdminEmbedPage,
});

function AdminEmbedPage() {
  const [iframeSrc, setIframeSrc] = useState(() => {
    if (typeof window !== "undefined") {
      const isAuth =
        localStorage.getItem("pf_loggedin") === "1" ||
        sessionStorage.getItem("pf_loggedin") === "1" ||
        localStorage.getItem("pf_admin_auth") === "authenticated" ||
        sessionStorage.getItem("pf_admin_auth") === "authenticated";
      const hash = window.location.hash || (isAuth ? "#/dashboard" : "#/login");
      return `/admin.html${hash}`;
    }
    return "/admin.html";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth =
        localStorage.getItem("pf_loggedin") === "1" ||
        sessionStorage.getItem("pf_loggedin") === "1" ||
        localStorage.getItem("pf_admin_auth") === "authenticated" ||
        sessionStorage.getItem("pf_admin_auth") === "authenticated";
      const hash = window.location.hash || (isAuth ? "#/dashboard" : "#/login");
      setIframeSrc(`/admin.html${hash}`);
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        minHeight: "100dvh",
        maxHeight: "100dvh",
        zIndex: 99999,
        overflow: "hidden",
        backgroundColor: "#F4F6F9",
      }}
    >
      <iframe
        src={iframeSrc}
        title="9forms.com — Form Builder Admin"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
      />
    </div>
  );
}
