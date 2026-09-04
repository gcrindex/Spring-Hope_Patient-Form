import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FilePlus2,
  FileText,
  Search,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminShell, type AdminNavKey } from "../components/admin-shell";
import { AdminAuthGuard } from "../components/admin-auth-guard";
import {
  getSubmissions,
  kneePainForm,
  type Language,
  type Submission,
} from "../lib/patientform";
import { getStoredLanguage, setStoredLanguage } from "../lib/patientform";
import { adminI18n } from "../lib/translations";

export const Route = createFileRoute("/admin/")({
  validateSearch: (search: Record<string, unknown>) => ({
    view: (search.view as string) || "overview",
  }),
  head: () => ({ meta: [{ title: "Clinical Dashboard — Spring Hope" }] }),
  component: () => (
    <AdminAuthGuard>
      <AdminDashboardPage />
    </AdminAuthGuard>
  ),
});

function AdminDashboardPage() {
  const { view } = Route.useSearch();
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => { setLanguage(getStoredLanguage()); }, []);

  const handleLanguageChange = (next: Language) => {
    setStoredLanguage(next);
    setLanguage(next);
  };

  const activeNav: AdminNavKey = view === "overview" || !view
    ? "overview"
    : (view as AdminNavKey);

  if (view === "submissions") return <SubmissionsView language={language} onLanguage={handleLanguageChange} />;
  if (view === "patients") return <PatientsView language={language} onLanguage={handleLanguageChange} />;
  if (view === "analytics") return <AnalyticsView language={language} onLanguage={handleLanguageChange} />;

  return <OverviewView language={language} onLanguage={handleLanguageChange} activeNav={activeNav} />;
}

/* ── Overview View ─────────────────────────────────────── */
function OverviewView({
  language, onLanguage, activeNav,
}: { language: Language; onLanguage: (l: Language) => void; activeNav: AdminNavKey }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  useEffect(() => setSubmissions(getSubmissions()), []);
  const t = adminI18n[language] ?? adminI18n.en;

  const stats = useMemo(() => ({
    total: submissions.length,
    high: submissions.filter((i) => i.risk === "high").length,
    mod: submissions.filter((i) => i.risk === "mod").length,
    low: submissions.filter((i) => i.risk === "low").length,
  }), [submissions]);

  return (
    <AdminShell
      title={t.greeting}
      eyebrow={t.overview}
      activeNav={activeNav}
      language={language}
      onLanguage={onLanguage}
      actions={
        <Link to="/admin/new" className="admin-primary-button">
          <FilePlus2 size={17} /> {t.newForm}
        </Link>
      }
    >
      <div className="admin-intro-row">
        <p>{t.subtitle}</p>
        <div className="admin-date-pill">
          <CalendarDays size={15} /> {t.todayDate}
        </div>
      </div>

      <section className="admin-stat-grid" id="analytics">
        <StatCard icon={ClipboardCheck} label={t.totalSubmissions} value={String(stats.total)} meta="+12%" trend="+12%" />
        <StatCard icon={Users} label={t.highRisk} value={String(stats.high)} meta="" tone="danger" />
        <StatCard icon={TrendingUp} label={t.moderateRisk} value={String(stats.mod)} meta="" tone="warning" />
        <StatCard icon={FileText} label={t.publishedForms} value="1" meta="1 active" tone="brand" />
      </section>

      <div className="admin-two-column">
        <section className="admin-panel admin-panel-large" id="submissions">
          <div className="admin-panel-head">
            <div>
              <span className="panel-kicker">{t.recentSubmissions}</span>
              <h2>{t.recentSubmissions}</h2>
            </div>
            <Link to="/admin" search={{ view: "submissions" }} className="admin-soft-button">
              {t.viewAll} <ArrowRight size={15} />
            </Link>
          </div>
          <div className="submission-table-wrap">
            <table className="submission-table">
              <thead>
                <tr>
                  <th>{t.patient}</th>
                  <th>{t.assessment}</th>
                  <th>{t.submitted}</th>
                  <th>{t.score}</th>
                  <th>{t.risk}</th>
                </tr>
              </thead>
              <tbody>
                {submissions.slice(0, 6).map((submission) => (
                  <tr key={submission.id}>
                    <td>
                      <div className="patient-cell">
                        <span>{initials(submission.patientName)}</span>
                        <div>
                          <strong>{submission.patientName}</strong>
                          <small>{submission.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>{kneePainForm.title[language]}</td>
                    <td>{formatDate(submission.submittedAt)}</td>
                    <td><strong>{submission.score}</strong></td>
                    <td><RiskPill risk={submission.risk} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="admin-panel admin-form-summary">
          <div className="admin-panel-head">
            <div>
              <span className="panel-kicker">{t.publishedForm}</span>
              <h2>{kneePainForm.title[language]}</h2>
            </div>
            <span className="status-dot-pill"><i /> {t.live}</span>
          </div>
          <div className="form-illustration">
            <div className="form-illustration-ring"><ClipboardCheck size={28} /></div>
            <span className="form-illustration-wave wave-a" />
            <span className="form-illustration-wave wave-b" />
          </div>
          <div className="form-summary-list">
            <div><span>{t.questions}</span><strong>{kneePainForm.questions.length}</strong></div>
            <div><span>{t.languages}</span><strong>3</strong></div>
            <div><span>{t.voiceInput}</span><strong className="text-positive">{t.enabled}</strong></div>
          </div>
          <Link to="/admin/forms-builder" className="admin-primary-button admin-primary-button-full">
            {t.manageForm} <ArrowRight size={16} />
          </Link>
        </aside>
      </div>

      <section className="admin-panel admin-ops-strip">
        <div>
          <span className="panel-kicker">{t.clinicalOps}</span>
          <h2>{t.clinicalOpsTitle}</h2>
          <p>{t.clinicalOpsDesc}</p>
        </div>
        <div className="ops-metrics">
          <div><strong>2m 18s</strong><span>{t.avgCompletion}</span></div>
          <div><strong>100%</strong><span>{t.manualFallback}</span></div>
          <div><strong>EN · ID · 中文</strong><span>{t.patientLangs}</span></div>
        </div>
      </section>
    </AdminShell>
  );
}

/* ── Submissions View ──────────────────────────────────── */
function SubmissionsView({ language, onLanguage }: { language: Language; onLanguage: (l: Language) => void }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<"all" | "high" | "mod" | "low">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  useEffect(() => setSubmissions(getSubmissions()), []);
  const t = adminI18n[language] ?? adminI18n.en;

  const filtered = useMemo(() => {
    let list = submissions;
    if (filter !== "all") list = list.filter((s) => s.risk === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.patientName.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }
    return list;
  }, [submissions, filter, search]);

  return (
    <AdminShell title={t.allSubmissions} eyebrow={t.submissions} activeNav="submissions" language={language} onLanguage={onLanguage}>
      <div className="admin-filters-row">
        <div className="admin-search-inline">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPatients} />
        </div>
        <div className="admin-filter-pills">
          {(["all", "high", "mod", "low"] as const).map((key) => (
            <button key={key} type="button" className={`filter-pill ${filter === key ? "active" : ""}`} onClick={() => setFilter(key)}>
              {key === "all" ? t.filterAll : key === "high" ? t.filterHigh : key === "mod" ? t.filterMod : t.filterLow}
              <span className="filter-count">{key === "all" ? submissions.length : submissions.filter((s) => s.risk === key).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="submission-table-wrap">
        <table className="submission-table">
          <thead>
            <tr>
              <th>{t.patient}</th>
              <th>{t.assessment}</th>
              <th>{t.submitted}</th>
              <th>{t.score}</th>
              <th>{t.risk}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((submission) => (
              <tr key={submission.id} className="submission-row" onClick={() => setSelected(submission)}>
                <td>
                  <div className="patient-cell">
                    <span>{initials(submission.patientName)}</span>
                    <div>
                      <strong>{submission.patientName}</strong>
                      <small>{submission.id}</small>
                    </div>
                  </div>
                </td>
                <td>{kneePainForm.title[language]}</td>
                <td>{formatDate(submission.submittedAt)}</td>
                <td><strong>{submission.score}</strong></td>
                <td><RiskPill risk={submission.risk} /></td>
                <td><ArrowRight size={14} className="text-muted" /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-8">{t.noSubmissions}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <SubmissionModal submission={selected} onClose={() => setSelected(null)} t={t} language={language} />
      )}
    </AdminShell>
  );
}

/* ── Submission Detail Modal ───────────────────────────── */
function SubmissionModal({
  submission, onClose, t, language,
}: {
  submission: Submission;
  onClose: () => void;
  t: ReturnType<typeof getAdminT>;
  language: Language;
}) {
  const form = kneePainForm;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="panel-kicker">{t.submissionDetail}</span>
            <h2>{submission.patientName}</h2>
          </div>
          <button type="button" className="admin-icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="modal-meta-row">
            <span>{t.score}: <strong>{submission.score}</strong></span>
            <RiskPill risk={submission.risk} />
          </div>
          <h3>{t.answersBreakdown}</h3>
          <div className="answers-grid">
            {Object.entries(submission.answers).map(([qId, value]) => {
              const question = form.questions.find((q) => q.id === qId);
              if (!question) return null;
              return (
                <div key={qId} className="answer-row">
                  <span className="answer-label">{question.prompt[language]}</span>
                  <span className="answer-value">
                    {typeof value === "number" && question.type === "scale"
                      ? `${value} / ${question.max ?? 10}`
                      : typeof value === "string"
                        ? question.options?.find((o) => o.value === value)?.label[language] ?? value
                        : String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Patients View ─────────────────────────────────────── */
function PatientsView({ language, onLanguage }: { language: Language; onLanguage: (l: Language) => void }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => setSubmissions(getSubmissions()), []);
  const t = adminI18n[language] ?? adminI18n.en;

  const patients = useMemo(() => {
    const byName = new Map<string, Submission>();
    for (const s of submissions) {
      const existing = byName.get(s.patientName);
      if (!existing || new Date(s.submittedAt) > new Date(existing.submittedAt)) {
        byName.set(s.patientName, s);
      }
    }
    let list = Array.from(byName.values());
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.patientName.toLowerCase().includes(q));
    }
    return list;
  }, [submissions, search]);

  return (
    <AdminShell title={t.patientDirectory} eyebrow={t.patients} activeNav="patients" language={language} onLanguage={onLanguage}>
      <p className="admin-subtitle">{t.patientDirectoryDesc}</p>
      <div className="admin-search-inline mb-4">
        <Search size={16} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPatients} />
      </div>
      <div className="submission-table-wrap">
        <table className="submission-table">
          <thead>
            <tr>
              <th>{t.patient}</th>
              <th>{t.score}</th>
              <th>{t.risk}</th>
              <th>{t.lastAssessment}</th>
              <th>{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.patientName}>
                <td>
                  <div className="patient-cell">
                    <span>{initials(p.patientName)}</span>
                    <div>
                      <strong>{p.patientName}</strong>
                      <small>{p.id}</small>
                    </div>
                  </div>
                </td>
                <td><strong>{p.score}</strong></td>
                <td><RiskPill risk={p.risk} /></td>
                <td>{formatDate(p.submittedAt)}</td>
                <td>
                  <span className={`status-pill status-${p.risk === "high" ? "review" : p.risk === "mod" ? "scheduled" : "completed"}`}>
                    {p.risk === "high" ? t.reviewNeeded : p.risk === "mod" ? t.scheduled : t.completed}
                  </span>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr><td colSpan={5} className="text-center text-muted py-8">{t.noSubmissions}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

/* ── Analytics View ────────────────────────────────────── */
function AnalyticsView({ language, onLanguage }: { language: Language; onLanguage: (l: Language) => void }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  useEffect(() => setSubmissions(getSubmissions()), []);
  const t = adminI18n[language] ?? adminI18n.en;

  const stats = useMemo(() => ({
    total: submissions.length,
    high: submissions.filter((s) => s.risk === "high").length,
    mod: submissions.filter((s) => s.risk === "mod").length,
    low: submissions.filter((s) => s.risk === "low").length,
    avgScore: submissions.length
      ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / submissions.length)
      : 0,
  }), [submissions]);

  const maxCount = Math.max(stats.high, stats.mod, stats.low, 1);

  return (
    <AdminShell title={t.analyticsTitle} eyebrow={t.analytics} activeNav="analytics" language={language} onLanguage={onLanguage}>
      <p className="admin-subtitle">{t.analyticsDesc}</p>

      <section className="admin-stat-grid">
        <StatCard icon={ClipboardList} label={t.totalSubmissions} value={String(stats.total)} meta="" />
        <StatCard icon={Users} label={t.highRisk} value={String(stats.high)} tone="danger" meta="" />
        <StatCard icon={TrendingUp} label={t.moderateRisk} value={String(stats.mod)} tone="warning" meta="" />
        <StatCard icon={ClipboardCheck} label={t.avgTriageTime} value="2m 18s" tone="brand" meta="" />
      </section>

      <div className="analytics-two-col">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="panel-kicker">{t.riskDistribution}</span>
              <h2>{t.riskDistribution}</h2>
            </div>
          </div>
          <div className="risk-bars">
            <RiskBar label={t.highRisk} count={stats.high} max={maxCount} color="#ef4444" />
            <RiskBar label={t.moderateRisk} count={stats.mod} max={maxCount} color="#f59e0b" />
            <RiskBar label={t.lowRisk} count={stats.low} max={maxCount} color="#22c55e" />
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="panel-kicker">{t.triageTurnaround}</span>
              <h2>{t.triageTurnaround}</h2>
            </div>
          </div>
          <div className="triage-metrics">
            <div className="triage-card">
              <Clock size={20} />
              <strong>2m 18s</strong>
              <span>{t.avgTriageTime}</span>
            </div>
            <div className="triage-card">
              <CheckCircle2 size={20} />
              <strong>100%</strong>
              <span>{t.manualFallback}</span>
            </div>
            <div className="triage-card">
              <BarChart3 size={20} />
              <strong>{stats.avgScore}</strong>
              <span>Avg Score</span>
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  );
}

/* ── Shared Helpers ────────────────────────────────────── */
type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  meta: string;
  trend?: string;
  tone?: "default" | "danger" | "warning" | "brand";
};

function StatCard({ icon: Icon, label, value, meta, trend, tone = "default" }: StatCardProps) {
  return (
    <article className={`admin-stat-card tone-${tone}`}>
      <div className="stat-icon"><Icon size={19} /></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value-row">
        <strong>{value}</strong>
        {trend && <span>{trend}</span>}
      </div>
      {meta && <p>{meta}</p>}
    </article>
  );
}

function RiskPill({ risk }: { risk: Submission["risk"] }) {
  return (
    <span className={`risk-pill risk-pill-${risk}`}>
      <i />
      {risk === "mod" ? "Moderate" : risk === "high" ? "High" : "Low"}
    </span>
  );
}

function RiskBar({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  return (
    <div className="risk-bar-row">
      <span className="risk-bar-label">{label}</span>
      <div className="risk-bar-track">
        <div className="risk-bar-fill" style={{ width: `${(count / max) * 100}%`, background: color }} />
      </div>
      <span className="risk-bar-count">{count}</span>
    </div>
  );
}

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-SG", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  }).format(new Date(value));
}

// Helper type to avoid TS complaint in SubmissionModal
function getAdminT() {
  return adminI18n.en;
}
