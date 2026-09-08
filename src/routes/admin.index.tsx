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
    try {
      const isAuth =
        localStorage.getItem("pf_loggedin") === "1" ||
        sessionStorage.getItem("pf_loggedin") === "1" ||
        document.cookie.indexOf("pf_loggedin=1") !== -1 ||
        localStorage.getItem("pf_admin_auth") === "authenticated" ||
        sessionStorage.getItem("pf_admin_auth") === "authenticated";
      const targetHash = window.location.hash || (isAuth ? "#/dashboard" : "#/login");
      window.location.replace(`/admin.html${targetHash}`);
    } catch {
      window.location.replace("/admin.html");
    }
  }, []);

  return null;
}
