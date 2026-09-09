import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  HeartHandshake,
  Home,
  Loader2,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import {
  calculateScore,
  getActiveFormId,
  getFormById,
  getPatientName,
  getRisk,
  getStoredAnswers,
  getStoredLanguage,
  kneePainForm,
  newPatientForm,
  resetAssessment,
  setStoredLanguage,
  setStoredQuestionIndex,
  type Language,
  type RiskLevel,
} from "../lib/patientform";

export const Route = createFileRoute("/intake/complete")({
  validateSearch: (search: Record<string, unknown>) => ({
    form: (search["form"] as string) || undefined,
  }),
  head: () => ({ meta: [{ title: "Formulir Selesai — 9forms.com" }] }),
  component: CompletionPage,
});

type CompletedSummary = {
  id: string;
  formId: string;
  patientName: string;
  score: number;
  risk: RiskLevel;
};

type SubmissionState = "submitting" | "success" | "error" | "invalid_session";

function CompletionPage() {
  const { form: formParam } = Route.useSearch();
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [cachedSummary, setCachedSummary] = useState<CompletedSummary | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("submitting");
  const [errorMessage, setErrorMessage] = useState("");

  const activeForm = useMemo(() => {
    return getFormById(formParam || getActiveFormId());
  }, [formParam]);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    const stored = getStoredAnswers();
    setAnswers(stored);

    let summaryFound = false;
    try {
      const raw = sessionStorage.getItem("sh_completed_summary");
      if (raw) {
        const parsed = JSON.parse(raw) as CompletedSummary;
        if (parsed && (parsed.formId === activeForm.id || !formParam)) {
          setCachedSummary(parsed);
          setSubmissionState("success");
          summaryFound = true;
        }
      }
    } catch (e) {
      void e;
    }

    // If answers is empty and no valid completed summary in session -> direct invalid access
    if (!summaryFound && Object.keys(stored).length === 0) {
      setSubmissionState("invalid_session");
    }
  }, [activeForm.id, formParam]);

  const rawScore = useMemo(() => calculateScore(answers, activeForm), [answers, activeForm]);
  const score = cachedSummary ? cachedSummary.score : rawScore;
  const risk = cachedSummary ? cachedSummary.risk : getRisk(score);

  const rawName = useMemo(() => {
    const answerNameEntry = Object.entries(answers).find(
      ([k, v]) =>
        (k.toLowerCase().includes("name") || k === "q_np_name" || k === "q_ef_name") &&
        !k.toLowerCase().includes("notes") &&
        !k.toLowerCase().includes("comment") &&
        typeof v === "string" &&
        v.trim(),
    );
    if (answerNameEntry && typeof answerNameEntry[1] === "string" && answerNameEntry[1].trim()) {
      return answerNameEntry[1].trim();
    }

    const stored = getPatientName();
    if (
      stored &&
      stored.trim() &&
      stored !== "Pasien" &&
      stored !== "Patient" &&
      stored !== "Pasien Baru" &&
      stored !== "新患者"
    ) {
      return stored.trim();
    }

    return language === "id" ? "Pasien" : language === "zh" ? "患者" : "Patient";
  }, [answers, language]);

  const name = cachedSummary ? cachedSummary.patientName : rawName;

  const setLang = (next: Language) => {
    setLanguage(next);
    setStoredLanguage(next);
  };

  const isSenior = activeForm.id === newPatientForm.id;

  const strings = {
    en: {
      done: isSenior ? "Registration Completed" : "Assessment Complete",
      thanks: `Thank you, ${name}. Your response has been recorded.`,
      result: "Priority Status",
      low: "Standard Routine",
      mod: "Priority Attention",
      high: "Urgent Review",
      lowBody: "Your response is saved and received by the portal.",
      modBody: "Priority assistance prepared upon arrival.",
      highBody: "Medical team is notified for priority triage.",
      tryOther: isSenior ? "Try Demo 2: Knee Pain" : "Try Demo 1: New Patient",
      sent: "Saved & Synced to Cloud DB",
      restart: "Start over",
      backHome: "Back to Home",
      submittingTitle: "Saving your response...",
      submittingSubtitle: "Securing clinical data to database",
      errorTitle: "Submission Failed",
      errorDesc: "A network or server issue prevented saving your response. Your answers are safe.",
      retryBtn: "Try Again",
    },
    id: {
      done: isSenior ? "Pendaftaran Berhasil Selesai" : "Penilaian Selesai",
      thanks: `Terima kasih, ${name}. Formulir Anda telah tercatat.`,
      result: "Status Prioritas",
      low: "Pemeriksaan Rutin",
      mod: "Perhatian Prioritas",
      high: "Tinjauan Segera",
      lowBody: "Jawaban Anda telah tersimpan dan diterima oleh server database.",
      modBody: "Bantuan prioritas akan disiapkan oleh petugas.",
      highBody: "Tim klinis segera menerima notifikasi untuk triase prioritas.",
      tryOther: isSenior ? "Coba Demo 2: Nyeri Lutut" : "Coba Demo 1: Pasien Baru",
      sent: "Tersimpan & Terhubung ke Cloud DB",
      restart: "Mulai dari awal",
      backHome: "Kembali ke Beranda",
      submittingTitle: "Menyimpan jawaban Anda...",
      submittingSubtitle: "Mengamankan data klinis ke server database",
      errorTitle: "Gagal Mengirim Formulir",
      errorDesc:
        "Terjadi gangguan jaringan atau server saat menyimpan data. Jawaban Anda tetap aman.",
      retryBtn: "Coba Lagi",
    },
    zh: {
      done: isSenior ? "登记完成" : "评估完成",
      thanks: `谢谢您，${name}。您的问卷已记录完毕。`,
      result: "分流状态",
      low: "常规就诊",
      mod: "优先跟进",
      high: "重点关照",
      lowBody: "您的答案已成功保存并同步至云端数据库。",
      modBody: "诊所工作人员已为您做好优先接待准备。",
      highBody: "医护团队已收到优先分诊提醒。",
      tryOther: isSenior ? "体验示例 2: 膝痛评估" : "体验示例 1: 新患者",
      sent: "已同步至云端数据库",
      restart: "重新填写",
      backHome: "返回首页",
      submittingTitle: "正在保存您的回答...",
      submittingSubtitle: "正在将数据安全同步至云端数据库",
      errorTitle: "提交失败",
      errorDesc: "网络或服务器异常导致无法保存问卷，您的回答仍安全保留在设备中。",
      retryBtn: "重试提交",
    },
  }[language];

  const riskLabel = risk === "low" ? strings.low : risk === "mod" ? strings.mod : strings.high;
  const riskBody =
    risk === "low" ? strings.lowBody : risk === "mod" ? strings.modBody : strings.highBody;

  const performSubmit = useCallback(async () => {
    let subId =
      typeof window !== "undefined" ? sessionStorage.getItem("sh_current_submission_id") : null;
    const isAlreadySubmitted =
      subId &&
      typeof window !== "undefined" &&
      sessionStorage.getItem(`sh_submitted_${subId}`) === "true";

    if (isAlreadySubmitted) {
      setSubmissionState("success");
      return;
    }

    if (Object.keys(answers).length === 0) {
      if (cachedSummary) {
        setSubmissionState("success");
      } else {
        setSubmissionState("invalid_session");
      }
      return;
    }

    setSubmissionState("submitting");
    setErrorMessage("");

    if (!subId) {
      subId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      sessionStorage.setItem("sh_current_submission_id", subId);
    }

    const payload = {
      id: subId,
      formId: activeForm.id,
      patientName: name,
      submittedAt: new Date().toISOString(),
      answers,
      score,
      risk,
      triageStatus: risk === "high" ? "review" : risk === "mod" ? "scheduled" : "completed",
    };

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        sessionStorage.setItem(`sh_submitted_${subId}`, "true");
        const summary = {
          id: subId,
          formId: activeForm.id,
          patientName: name,
          score,
          risk,
        };
        sessionStorage.setItem("sh_completed_summary", JSON.stringify(summary));
        setCachedSummary(summary);
        setSubmissionState("success");

        // Clean local draft answers for patient privacy
        resetAssessment();
      } else {
        setSubmissionState("error");
        setErrorMessage(data.message || strings.errorDesc);
      }
    } catch (err) {
      console.error("Submission failed", err);
      setSubmissionState("error");
      setErrorMessage(strings.errorDesc);
    }
  }, [activeForm.id, answers, cachedSummary, name, risk, score, strings.errorDesc]);

  const autoSavedRef = useRef(false);

  useEffect(() => {
    if (!autoSavedRef.current && Object.keys(answers).length > 0) {
      autoSavedRef.current = true;
      performSubmit();
    }
  }, [answers, performSubmit]);

  const handleClearAndReset = () => {
    try {
      sessionStorage.removeItem("sh_current_submission_id");
      sessionStorage.removeItem("sh_completed_summary");
      resetAssessment();
      setStoredQuestionIndex(0);
    } catch (e) {
      void e;
    }
  };

  return (
    <PatientShell language={language} onLanguage={setLang} progress={100} theme={activeForm.theme}>
      {submissionState === "invalid_session" && (
        <div
          className="patient-card completion-card sleek-completion-card patient-enter text-center py-10"
          role="alert"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <AlertCircle size={36} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {language === "id"
              ? "Sesi Formulir Tidak Ditemukan"
              : language === "zh"
                ? "未找到有效问卷会话"
                : "No Active Session Found"}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-8">
            {language === "id"
              ? "Halaman ini hanya dapat diakses setelah menyelesaikan formulir intake. Silakan mulai pengisian formulir dari awal."
              : language === "zh"
                ? "此页面仅在完成问卷填写后可访问。请从首页开始重新填写。"
                : "This completion page is only accessible after completing the guided intake form."}
          </p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link
              to="/intake"
              search={{ form: activeForm.id }}
              onClick={handleClearAndReset}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition"
            >
              <RotateCcw size={17} />
              <span>
                {language === "id"
                  ? "Mulai Formulir"
                  : language === "zh"
                    ? "开始填写问卷"
                    : "Start Intake Form"}
              </span>
            </Link>
            <Link
              to="/"
              className="w-full py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium text-center hover:bg-slate-50 transition"
            >
              {language === "id"
                ? "Kembali ke Beranda"
                : language === "zh"
                  ? "返回首页"
                  : "Back to Home"}
            </Link>
          </div>
        </div>
      )}

      {submissionState === "submitting" && (
        <div className="patient-card completion-card sleek-completion-card patient-enter text-center py-16">
          <div className="flex justify-center mb-6">
            <Loader2 size={42} className="animate-spin text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{strings.submittingTitle}</h2>
          <p className="text-sm text-slate-500">{strings.submittingSubtitle}</p>
        </div>
      )}

      {submissionState === "error" && (
        <div
          className="patient-card completion-card sleek-completion-card patient-enter"
          role="alert"
        >
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">{strings.errorTitle}</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {errorMessage || strings.errorDesc}
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <button
              type="button"
              onClick={performSubmit}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-blue-700 transition"
            >
              <RefreshCw size={17} />
              <span>{strings.retryBtn}</span>
            </button>
            <Link
              to="/"
              className="w-full py-3 px-6 rounded-xl border border-slate-200 text-slate-600 font-medium text-center hover:bg-slate-50 transition"
            >
              {strings.backHome}
            </Link>
          </div>
        </div>
      )}

      {submissionState === "success" && (
        <div className="patient-card completion-card sleek-completion-card patient-enter">
          {/* Sleek animated checkmark */}
          <div className="sleek-check-bubble">
            <Check size={28} strokeWidth={3} />
          </div>

          <div className="sleek-complete-hero">
            <span className="sleek-kicker-pill">{strings.done}</span>
            <h1 className="sleek-complete-title">{strings.thanks}</h1>
          </div>

          {/* Minimalist sleek summary card */}
          <div className={`sleek-result-box risk-${risk}`}>
            <div className="sleek-result-row">
              <div>
                <span className="sleek-result-sub">{strings.result}</span>
                <strong className="sleek-result-title">{riskLabel}</strong>
              </div>
              <div className="sleek-result-score-badge">
                <strong>{score}</strong>
                <small>pts</small>
              </div>
            </div>
            <p className="sleek-result-desc">{riskBody}</p>
          </div>

          {/* Live sync badge */}
          <div className="sleek-synced-pill">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>{strings.sent}</span>
          </div>

          {/* Clean Action Buttons */}
          <div className="sleek-complete-actions">
            <Link
              to="/intake"
              search={{ form: isSenior ? kneePainForm.id : newPatientForm.id }}
              onClick={handleClearAndReset}
              className="sleek-action-btn secondary"
            >
              <HeartHandshake size={15} />
              <span>{strings.tryOther}</span>
            </Link>

            <Link
              to="/intake"
              search={{ form: activeForm.id }}
              onClick={handleClearAndReset}
              className="sleek-action-btn ghost"
            >
              <RotateCcw size={15} />
              <span>{strings.restart}</span>
            </Link>

            <Link to="/" onClick={handleClearAndReset} className="sleek-action-btn ghost">
              <Home size={15} />
              <span>{strings.backHome}</span>
            </Link>
          </div>
        </div>
      )}
    </PatientShell>
  );
}
