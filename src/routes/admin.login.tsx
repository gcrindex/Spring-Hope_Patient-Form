import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { BrandMark } from "../components/brand";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Staff Login — Spring Hope" }] }),
  component: AdminLoginPage,
});

const SESSION_KEY = "pf_admin_auth";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin@gmail.com");
  const [password, setPassword] = useState("springhope");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const authenticate = () => {
    sessionStorage.setItem(SESSION_KEY, "authenticated");
    navigate({ to: "/admin" });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const normalizedUser = username.trim().toLowerCase();
    const isUserValid =
      normalizedUser === "admin" ||
      normalizedUser === "admin@gmail.com" ||
      normalizedUser === "leader" ||
      normalizedUser === "springhope";

    if (isUserValid && password.trim() === "springhope") {
      authenticate();
    } else {
      setError("Username atau password salah. Coba: admin@gmail.com / springhope");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card patient-enter">
        <div className="login-brand">
          <BrandMark />
        </div>
        <div className="login-icon">
          <Lock size={22} />
        </div>
        <h1>Staff Portal</h1>
        <p className="login-subtitle">Masuk untuk mengakses workspace klinis.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="login-field">
            <span>Username / Email</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@gmail.com"
              autoComplete="username"
              required
            />
          </label>
          <label className="login-field">
            <span>Password</span>
            <div className="login-password-wrap">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-submit">
            Sign in
          </button>
        </form>

        <div className="login-bypass-divider">
          <span>atau</span>
        </div>

        <button type="button" className="login-leader-button" onClick={authenticate}>
          <ShieldCheck size={16} /> Masuk Langsung (Hak Akses Leader)
        </button>

        <p className="login-hint">Akun aktif: admin@gmail.com / springhope</p>
      </div>
    </div>
  );
}
