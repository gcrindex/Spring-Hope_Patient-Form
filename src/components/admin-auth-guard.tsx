import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

const SESSION_KEY = "pf_admin_auth";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const isAuth = sessionStorage.getItem(SESSION_KEY) === "authenticated";

  useEffect(() => {
    if (!isAuth) {
      navigate({ to: "/admin/login" });
    }
  }, [isAuth, navigate]);

  if (!isAuth) return null;

  return <>{children}</>;
}
