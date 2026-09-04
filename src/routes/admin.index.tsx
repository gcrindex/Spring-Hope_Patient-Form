import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Edit3,
  FilePlus2,
  FileText,
  Search,
  Trash2,
  TrendingUp,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminShell, type AdminNavKey } from "../components/admin-shell";
import { AdminAuthGuard } from "../components/admin-auth-guard";
import {
  deleteSubmission,
  getSubmissions,
  kneePainForm,
  renamePatient,
  updateTriageStatus,
  type Language,
  type Submission,
  type TriageStatus,
} from "../lib/patientform";
import { getStoredLanguage, onLanguageChange, setStoredLanguage } from "../lib/patientform";
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
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    setLanguage(getStoredLanguage());
    return onLanguageChange(setLanguage);
  }, []);

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
  if (view === "settings") return <SettingsView language={language} onLanguage={handleLanguageChange} />;

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
          <div className="form-summary-action-wrap">
            <Link to="/admin/forms-builder" className="admin-primary-button admin-primary-button-full">
              {t.manageForm} <ArrowRight size={16} />
            </Link>
          </div>
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTriage, setEditingTriage] = useState<{ id: string; current: TriageStatus } | null>(null);

  const refreshSubmissions = () => setSubmissions(getSubmissions());
  useEffect(() => refreshSubmissions(), []);
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

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    deleteSubmission(id);
    setDeletingId(null);
    if (selected?.id === id) setSelected(null);
    refreshSubmissions();
  };

  const handleStatusChange = (id: string, newStatus: TriageStatus) => {
    updateTriageStatus(id, newStatus);
    setEditingTriage(null);
    if (selected && selected.id === id) {
      setSelected({ ...selected, triageStatus: newStatus });
    }
    refreshSubmissions();
  };

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
              <th>{t.status}</th>
              <th style={{ textAlign: "right" }}>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((submission) => {
              const currentStatus: TriageStatus = submission.triageStatus || (submission.risk === "high" ? "review" : submission.risk === "mod" ? "scheduled" : "completed");
              return (
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
                  <td>
                    <button
                      type="button"
                      className={`status-pill status-${currentStatus} status-clickable`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTriage({ id: submission.id, current: currentStatus });
                      }}
                      title={t.changeStatus}
                    >
                      {currentStatus === "review" ? t.reviewNeeded : currentStatus === "scheduled" ? t.scheduled : t.completed} ▾
                    </button>
                  </td>
                  <td>
                    <div className="table-actions-cell" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="table-action-btn action-edit"
                        onClick={() => setEditingTriage({ id: submission.id, current: currentStatus })}
                        title={t.changeStatus}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        className="table-action-btn action-delete"
                        onClick={() => setDeletingId(submission.id)}
                        title={t.deleteAction}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted py-8">{t.noSubmissions}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Submission */}
      {selected && (
        <SubmissionModal
          submission={selected}
          onClose={() => setSelected(null)}
          onDelete={() => handleDelete(selected.id)}
          onStatusChange={(status) => handleStatusChange(selected.id, status)}
          t={t}
          language={language}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {deletingId && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="modal-card modal-card-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{t.deleteAction}</h2>
              <button type="button" className="admin-icon-button" onClick={() => setDeletingId(null)}><X size={18} /></button>
            </div>
            <p className="confirm-body-text">{t.confirmDelete}</p>
            <div className="confirm-modal-actions">
              <button type="button" className="admin-soft-button" onClick={() => setDeletingId(null)}>{t.close}</button>
              <button type="button" className="admin-danger-button" onClick={() => handleDelete(deletingId)}>{t.deleteAction}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Status Triase */}
      {editingTriage && (
        <div className="modal-overlay" onClick={() => setEditingTriage(null)}>
          <div className="modal-card modal-card-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{t.editTriage}</h2>
              <button type="button" className="admin-icon-button" onClick={() => setEditingTriage(null)}><X size={18} /></button>
            </div>
            <div className="status-options-list">
              {(["review", "scheduled", "completed"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`status-option-btn ${editingTriage.current === st ? "active" : ""}`}
                  onClick={() => handleStatusChange(editingTriage.id, st)}
                >
                  <span className={`status-pill status-${st}`}>
                    {st === "review" ? t.reviewNeeded : st === "scheduled" ? t.scheduled : t.completed}
                  </span>
                  {editingTriage.current === st && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

/* ── Submission Detail Modal ───────────────────────────── */
function SubmissionModal({
  submission, onClose, onDelete, onStatusChange, t, language,
}: {
  submission: Submission;
  onClose: () => void;
  onDelete: () => void;
  onStatusChange: (status: TriageStatus) => void;
  t: ReturnType<typeof getAdminT>;
  language: Language;
}) {
  const form = kneePainForm;
  const currentStatus: TriageStatus = submission.triageStatus || (submission.risk === "high" ? "review" : submission.risk === "mod" ? "scheduled" : "completed");

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

          <div className="modal-status-edit-row">
            <span className="text-xs font-bold text-muted">{t.status}:</span>
            <div className="flex gap-2">
              {(["review", "scheduled", "completed"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`status-pill status-${st} ${currentStatus === st ? "ring-2 ring-blue-500 font-black" : "opacity-60"}`}
                  onClick={() => onStatusChange(st)}
                >
                  {st === "review" ? t.reviewNeeded : st === "scheduled" ? t.scheduled : t.completed}
                </button>
              ))}
            </div>
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

          <div className="modal-bottom-actions">
            <button
              type="button"
              className="admin-danger-button modal-delete-btn"
              onClick={() => {
                if (window.confirm(t.confirmDelete)) {
                  onDelete();
                }
              }}
            >
              <Trash2 size={15} /> {t.deleteAction}
            </button>
            <button type="button" className="admin-soft-button" onClick={onClose}>
              {t.close}
            </button>
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTriage, setEditingTriage] = useState<{ id: string; current: TriageStatus } | null>(null);
  const [renamingPatient, setRenamingPatient] = useState<{ oldName: string; currentName: string } | null>(null);

  const refreshSubmissions = () => setSubmissions(getSubmissions());
  useEffect(() => refreshSubmissions(), []);
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

  const handleDeletePatient = (submissionId: string) => {
    deleteSubmission(submissionId);
    setDeletingId(null);
    refreshSubmissions();
  };

  const handleStatusChange = (submissionId: string, newStatus: TriageStatus) => {
    updateTriageStatus(submissionId, newStatus);
    setEditingTriage(null);
    refreshSubmissions();
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renamingPatient || !renamingPatient.currentName.trim()) return;
    renamePatient(renamingPatient.oldName, renamingPatient.currentName.trim());
    setRenamingPatient(null);
    refreshSubmissions();
  };

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
              <th style={{ textAlign: "right" }}>{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => {
              const currentStatus: TriageStatus = p.triageStatus || (p.risk === "high" ? "review" : p.risk === "mod" ? "scheduled" : "completed");
              return (
                <tr key={p.patientName} className="submission-row">
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
                    <button
                      type="button"
                      className={`status-pill status-${currentStatus} status-clickable`}
                      onClick={() => setEditingTriage({ id: p.id, current: currentStatus })}
                      title={t.changeStatus}
                    >
                      {currentStatus === "review" ? t.reviewNeeded : currentStatus === "scheduled" ? t.scheduled : t.completed} ▾
                    </button>
                  </td>
                  <td>
                    <div className="table-actions-cell">
                      <button
                        type="button"
                        className="table-action-btn action-edit"
                        onClick={() => setRenamingPatient({ oldName: p.patientName, currentName: p.patientName })}
                        title={t.editName}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        className="table-action-btn action-delete"
                        onClick={() => setDeletingId(p.id)}
                        title={t.deleteAction}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {patients.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted py-8">{t.noSubmissions}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Ubah Nama Pasien (Sinkron ke Submissions) */}
      {renamingPatient && (
        <div className="modal-overlay" onClick={() => setRenamingPatient(null)}>
          <div className="modal-card modal-card-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{t.editName}</h2>
              <button type="button" className="admin-icon-button" onClick={() => setRenamingPatient(null)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveRename} className="rename-form">
              <label className="rename-field">
                <span>{t.newNameLabel}</span>
                <input
                  type="text"
                  value={renamingPatient.currentName}
                  onChange={(e) => setRenamingPatient({ ...renamingPatient, currentName: e.target.value })}
                  autoFocus
                  required
                />
              </label>
              <div className="confirm-modal-actions mt-4">
                <button type="button" className="admin-soft-button" onClick={() => setRenamingPatient(null)}>{t.close}</button>
                <button type="submit" className="admin-primary-button">{t.saveName}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Pasien */}
      {deletingId && (
        <div className="modal-overlay" onClick={() => setDeletingId(null)}>
          <div className="modal-card modal-card-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{t.deleteAction}</h2>
              <button type="button" className="admin-icon-button" onClick={() => setDeletingId(null)}><X size={18} /></button>
            </div>
            <p className="confirm-body-text">{t.confirmDelete}</p>
            <div className="confirm-modal-actions">
              <button type="button" className="admin-soft-button" onClick={() => setDeletingId(null)}>{t.close}</button>
              <button type="button" className="admin-danger-button" onClick={() => handleDeletePatient(deletingId)}>{t.deleteAction}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Status Triase */}
      {editingTriage && (
        <div className="modal-overlay" onClick={() => setEditingTriage(null)}>
          <div className="modal-card modal-card-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{t.editTriage}</h2>
              <button type="button" className="admin-icon-button" onClick={() => setEditingTriage(null)}><X size={18} /></button>
            </div>
            <div className="status-options-list">
              {(["review", "scheduled", "completed"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`status-option-btn ${editingTriage.current === st ? "active" : ""}`}
                  onClick={() => handleStatusChange(editingTriage.id, st)}
                >
                  <span className={`status-pill status-${st}`}>
                    {st === "review" ? t.reviewNeeded : st === "scheduled" ? t.scheduled : t.completed}
                  </span>
                  {editingTriage.current === st && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
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

/* ── Settings View ─────────────────────────────────────── */
function SettingsView({ language, onLanguage }: { language: Language; onLanguage: (l: Language) => void }) {
  const t = adminI18n[language] ?? adminI18n.en;
  const [displayName, setDisplayName] = useState("Dr. Marcus Vance");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    sessionStorage.setItem("pf_admin_display_name", displayName);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <AdminShell title={t.settings} eyebrow={t.settings} activeNav="settings" language={language} onLanguage={onLanguage}>
      <div className="settings-panel">
        <section className="admin-panel settings-section">
          <div className="admin-panel-head">
            <div>
              <span className="panel-kicker">{t.settings}</span>
              <h2>{language === "id" ? "Pengaturan Workspace" : language === "zh" ? "工作区设置" : "Workspace Settings"}</h2>
            </div>
          </div>
          <div className="settings-body">
            <label className="settings-field">
              <span>{language === "id" ? "Nama Tampilan" : language === "zh" ? "显示名称" : "Display Name"}</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Dr. Marcus Vance"
              />
              <small>{language === "id" ? "Nama yang ditampilkan di sidebar dan dashboard" : language === "zh" ? "侧边栏和仪表板上显示的名称" : "Shown in the sidebar and dashboard"}</small>
            </label>
            <label className="settings-field">
              <span>{language === "id" ? "Bahasa Default" : language === "zh" ? "默认语言" : "Default Language"}</span>
              <div className="settings-lang-row">
                {([
                  { value: "en", label: "English", flag: "🇬🇧" },
                  { value: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
                  { value: "zh", label: "简体中文", flag: "🇨🇳" },
                ] as const).map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    className={`settings-lang-btn ${language === lang.value ? "active" : ""}`}
                    onClick={() => onLanguage(lang.value)}
                  >
                    <span className="settings-lang-flag">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
              <small>{language === "id" ? "Bahasa ini berlaku untuk seluruh halaman admin dan pasien" : language === "zh" ? "此语言适用于所有管理员和患者页面" : "Applies to all admin and patient pages"}</small>
            </label>
            <button type="button" className="admin-primary-button settings-save-btn" onClick={handleSave}>
              {saved
                ? (language === "id" ? "✓ Tersimpan" : language === "zh" ? "✓ 已保存" : "✓ Saved")
                : (language === "id" ? "Simpan Pengaturan" : language === "zh" ? "保存设置" : "Save Settings")}
            </button>
          </div>
        </section>

        <section className="admin-panel settings-section">
          <div className="admin-panel-head">
            <div>
              <span className="panel-kicker">{language === "id" ? "Informasi Sistem" : language === "zh" ? "系统信息" : "System Info"}</span>
              <h2>{language === "id" ? "Tentang PatientForm" : language === "zh" ? "关于 PatientForm" : "About PatientForm"}</h2>
            </div>
          </div>
          <div className="settings-body">
            <div className="settings-info-grid">
              <div className="settings-info-row">
                <span>Versi</span><strong>1.0.0 MVP</strong>
              </div>
              <div className="settings-info-row">
                <span>{language === "id" ? "Mode" : language === "zh" ? "运行模式" : "Mode"}</span>
                <strong>{language === "id" ? "Demo (localStorage)" : language === "zh" ? "演示（本地存储）" : "Demo (localStorage)"}</strong>
              </div>
              <div className="settings-info-row">
                <span>{language === "id" ? "Bahasa" : language === "zh" ? "支持语言" : "Languages"}</span>
                <strong>EN · ID · 中文</strong>
              </div>
              <div className="settings-info-row">
                <span>{language === "id" ? "Siaran Suara" : language === "zh" ? "语音功能" : "Voice Input"}</span>
                <strong>{language === "id" ? "Browser Native (Web Speech)" : language === "zh" ? "浏览器原生（Web Speech）" : "Browser Native (Web Speech)"}</strong>
              </div>
              <div className="settings-info-row">
                <span>{language === "id" ? "Penyimpanan" : language === "zh" ? "数据存储" : "Storage"}</span>
                <strong>{language === "id" ? "Browser Lokal" : language === "zh" ? "浏览器本地" : "Browser Local"}</strong>
              </div>
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
