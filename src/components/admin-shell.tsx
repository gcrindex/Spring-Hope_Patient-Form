import type { ReactNode } from "react";
import {
  BarChart3,
  Bell,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BrandMark } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import { adminI18n } from "../lib/translations";
import {
  getStoredLanguage,
  onLanguageChange,
  setStoredLanguage,
  type Language,
} from "../lib/patientform";
import { useState, useEffect } from "react";

export type AdminNavKey =
  "overview" | "forms" | "submissions" | "patients" | "analytics" | "settings";

export function AdminShell({
  title,
  eyebrow,
  children,
  actions,
  activeNav = "overview",
  language: controlledLang,
  onLanguage: controlledOnLang,
}: {
  title: string;
  eyebrow?: string | undefined;
  children: ReactNode;
  actions?: ReactNode | undefined;
  activeNav?: AdminNavKey | undefined;
  language?: Language | undefined;
  onLanguage?: ((lang: Language) => void) | undefined;
}) {
  const [internalLang, setInternalLang] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    // Sync if localStorage changes from another tab/component
    const unsubscribe = onLanguageChange(setInternalLang);
    setInternalLang(getStoredLanguage());
    return unsubscribe;
  }, []);

  const lang = controlledLang ?? internalLang;
  const handleLangChange = (next: Language) => {
    setStoredLanguage(next);
    setInternalLang(next);
    controlledOnLang?.(next);
  };

  const t = adminI18n[lang] ?? adminI18n.en;

  const navItems: Array<{
    key: AdminNavKey;
    label: string;
    icon: typeof LayoutDashboard;
    to: string;
    search?: Record<string, string>;
  }> = [
    { key: "overview", label: t.overview, icon: LayoutDashboard, to: "/admin" },
    { key: "forms", label: t.forms, icon: FileText, to: "/admin/forms-builder" },
    {
      key: "submissions",
      label: t.submissions,
      icon: ClipboardList,
      to: "/admin",
      search: { view: "submissions" },
    },
    { key: "patients", label: t.patients, icon: Users, to: "/admin", search: { view: "patients" } },
    {
      key: "analytics",
      label: t.analytics,
      icon: BarChart3,
      to: "/admin",
      search: { view: "analytics" },
    },
  ];

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div>
          <div className="admin-brand">
            <BrandMark />
          </div>
          <div className="admin-workspace-pill">
            <span className="workspace-dot" /> {t.workspace}
          </div>
          <nav className="admin-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.key;
              return (
                <a
                  key={item.key}
                  href={
                    item.search
                      ? `${item.to}?${new URLSearchParams(item.search).toString()}`
                      : item.to
                  }
                  className={`admin-nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon size={19} />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
        <div className="admin-sidebar-bottom">
          <a
            href="/admin?view=settings"
            className={`admin-nav-item ${activeNav === "settings" ? "active" : ""}`}
          >
            <Settings size={19} />
            <span>{t.settings}</span>
          </a>
          <div className="admin-profile">
            <div className="admin-avatar">MV</div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-extrabold text-ink">Dr. Marcus Vance</div>
              <div className="truncate text-xs text-muted">{t.workspace}</div>
            </div>
            <button
              type="button"
              className="admin-logout-btn"
              onClick={() => {
                sessionStorage.removeItem("pf_admin_auth");
                window.location.href = "/admin/login";
              }}
              title={t.signOut}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-content-shell">
        <header className="admin-topbar">
          <div className="admin-search">
            <Search size={17} />
            <span>{t.searchPlaceholder}</span>
            <kbd>⌘ K</kbd>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher value={lang} onChange={handleLangChange} compact />
            <button
              className="admin-icon-button"
              type="button"
              disabled
              aria-disabled="true"
              title="Notifications are not implemented in this MVP"
            >
              <Bell size={18} />
            </button>
            <div className="admin-status">
              <span /> {t.demoWorkspace}
            </div>
          </div>
        </header>
        <main className="admin-main">
          <div className="admin-heading-row">
            <div>
              <div className="admin-breadcrumb">
                Spring Hope <ChevronRight size={13} /> {eyebrow ?? t.clinicalOps}
              </div>
              <h1>{title}</h1>
            </div>
            {actions && <div className="admin-actions">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
