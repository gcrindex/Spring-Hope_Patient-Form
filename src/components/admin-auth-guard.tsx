import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/status", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { isAuthenticated: false }))
      .then((data) => {
        if (!active) return;
        if (data && data.isAuthenticated) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          navigate({ to: "/admin" });
        }
      })
      .catch(() => {
        if (!active) return;
        setIsAuthorized(false);
        navigate({ to: "/admin" });
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  if (isAuthorized === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Memverifikasi sesi administrator...
      </div>
    );
  }

  if (!isAuthorized) return null;

  return <>{children}</>;
}
