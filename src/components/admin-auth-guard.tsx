import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const isAuth =
    typeof window !== "undefined" &&
    (localStorage.getItem("pf_loggedin") === "1" ||
      sessionStorage.getItem("pf_loggedin") === "1" ||
      localStorage.getItem("pf_admin_auth") === "authenticated" ||
      sessionStorage.getItem("pf_admin_auth") === "authenticated");

  useEffect(() => {
    if (!isAuth) {
      navigate({ to: "/admin" });
    }
  }, [isAuth, navigate]);

  if (!isAuth) return null;

  return <>{children}</>;
}
