import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartHandshake,
  Home,
  Loader2,
  Printer,
  RefreshCw,
  RotateCcw,
  Share2,
  ShieldCheck,
  Trash2,
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

function maskSensitiveText(text: string): string {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  return words
    .map((w) => {
      if (w.length <= 1) return w;
      if (w.length === 2) return w[0] + "*";
      return w[0] + "*".repeat(w.length - 2) + w[w.length - 1];
    })
    .join(" ");
}

function CompletionPage() {
  const { form: formParam } = Route.useSearch();
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [cachedSummary, setCachedSummary] = useState<CompletedSummary | null>(null);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("submitting");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMasked, setIsMasked] = useState(false);

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
        (k.toLowerCase().includes("name") ||
          k === "q_np_name" ||
          k === "q_ef_name" ||
          k === "q_kp_name" ||
          k === "patient_name" ||
          k === "nama") &&
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

    // Dynamic fallback for custom/AI forms: take the first non-empty text answer
    const textEntry = Object.entries(answers).find(
      ([k, v]) =>
        typeof v === "string" &&
        v.trim().length >= 2 &&
        v.trim().length <= 40 &&
        !v.includes("\n") &&
        !k.toLowerCase().includes("notes") &&
        !k.toLowerCase().includes("comment") &&
        !k.toLowerCase().includes("symptom"),
    );
    if (textEntry && typeof textEntry[1] === "string" && textEntry[1].trim()) {
      return textEntry[1].trim();
    }

    return language === "id" ? "Pasien" : language === "zh" ? "患者" : "Patient";
  }, [answers, language]);

  const name = cachedSummary ? cachedSummary.patientName : rawName;

  const setLang = (next: Language) => {
    setLanguage(next);
    setStoredLanguage(next);
  };

  const isSenior =
    activeForm.id === "elderly-friendly-intake" || activeForm.id === newPatientForm.id;
  const isDemoForm =
    activeForm.id === "new-patient-intake" ||
    activeForm.id === "knee-pain-assessment" ||
    activeForm.id === "elderly-friendly-intake";

  const strings = {
    en: {
      done: isSenior ? "Registration Completed" : "Assessment Complete",
      thanks: `Thank you, ${isMasked ? maskSensitiveText(name) : name}. Your response has been recorded.`,
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
      kioskReset: "Clear Tablet for Next Patient",
      submittingTitle: "Saving your response...",
      submittingSubtitle: "Securing clinical data to database",
      errorTitle: "Submission Failed",
      errorDesc: "A network or server issue prevented saving your response. Your answers are safe.",
      retryBtn: "Try Again",
      printRecord: "Print Record (A4)",
      maskPhi: "Mask PHI Data",
      unmaskPhi: "Show Full Data",
      shareWa: "Share WhatsApp Receipt",
      printAndPurge: "Print & Clear Session",
      docTitle: "PATIENT CLINICAL INTAKE RECORD",
      clinicHeader: "SPRING HOPE HEALTHCARE · ELECTRONIC MEDICAL RECORD SYSTEM",
      refNo: "Submission Ref ID:",
      examDate: "Date & Time:",
      triageHeader: "CLINICAL TRIAGE STATUS",
      qCol: "Clinical Question",
      aCol: "Recorded Answer",
      answersHeader: "SUMMARY OF PATIENT INTAKE RESPONSES",
      docSign: "Attending Doctor / Staff Signature",
      patientSign: "Patient / Guardian Signature",
      maskedNotice: "PHI Masking Active: Patient identity is redacted for non-medical archiving.",
    },
    id: {
      done: isSenior ? "Pendaftaran Berhasil Selesai" : "Penilaian Selesai",
      thanks: `Terima kasih, ${isMasked ? maskSensitiveText(name) : name}. Formulir Anda telah tercatat.`,
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
      kioskReset: "Bersihkan Sesi untuk Pasien Berikutnya",
      submittingTitle: "Menyimpan jawaban Anda...",
      submittingSubtitle: "Mengamankan data klinis ke server database",
      errorTitle: "Gagal Mengirim Formulir",
      errorDesc:
        "Terjadi gangguan jaringan atau server saat menyimpan data. Jawaban Anda tetap aman.",
      retryBtn: "Coba Lagi",
      printRecord: "Cetak Rekam Medis (A4)",
      maskPhi: "Sensor Data PHI",
      unmaskPhi: "Buka Sensor PHI",
      shareWa: "Kirim Bukti ke WhatsApp",
      printAndPurge: "Cetak & Bersihkan Sesi (Kiosk)",
      docTitle: "LEMBAR REKAM MEDIS INTAKE PASIEN",
      clinicHeader: "KLINIK SPRING HOPE · SISTEM REKAM MEDIS ELEKTRONIK",
      refNo: "No. Referensi Submisi:",
      examDate: "Tanggal & Jam:",
      triageHeader: "STATUS TRIASE KLINIS",
      qCol: "Pertanyaan Klinis",
      aCol: "Jawaban Terdaftar",
      answersHeader: "RINGKASAN JAWABAN ASESMEN PASIEN",
      docSign: "Tanda Tangan Dokter / Petugas",
      patientSign: "Tanda Tangan Pasien / Wali",
      maskedNotice: "Mode Sensor PHI Aktif: Nama & data pribadi disamarkan untuk arsip privasi.",
    },
    zh: {
      done: isSenior ? "登记完成" : "评估完成",
      thanks: `谢谢您，${isMasked ? maskSensitiveText(name) : name}。您的问卷已记录完毕。`,
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
      kioskReset: "清除平板缓存（接待下一位患者）",
      submittingTitle: "正在保存您的回答...",
      submittingSubtitle: "正在将数据安全同步至云端数据库",
      errorTitle: "提交失败",
      errorDesc: "网络或服务器异常导致无法保存问卷，您的回答仍安全保留在设备中。",
      retryBtn: "重试提交",
      printRecord: "打印就诊记录 (A4)",
      maskPhi: "隐藏敏感隐私 (PHI)",
      unmaskPhi: "显示完整信息",
      shareWa: "通过 WhatsApp 发送凭证",
      printAndPurge: "打印并清除设备缓存",
      docTitle: "患者临床初诊登记表",
      clinicHeader: "春晖诊疗中心 · 电子病历系统",
      refNo: "提交参考编号:",
      examDate: "就诊日期与时间:",
      triageHeader: "临床分诊优先级状态",
      qCol: "评估项目",
      aCol: "患者回答记录",
      answersHeader: "患者问卷详细回答摘要",
      docSign: "接诊医师 / 医护人员签名",
      patientSign: "患者 / 家属签名",
      maskedNotice: "隐私保护模式已开启：患者身份信息已脱敏加密用于归档。",
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
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("sh_current_submission_id");
        sessionStorage.removeItem("sh_completed_summary");
        sessionStorage.removeItem("sh_answers");
        sessionStorage.removeItem("sh_active_form_id");
        sessionStorage.removeItem("sh_question_index");
        sessionStorage.removeItem("sh_patient_name");
        localStorage.removeItem("sh_answers");
        localStorage.removeItem("sh_question_index");
        localStorage.removeItem("sh_patient_name");
      }
      resetAssessment();
      setStoredQuestionIndex(0);
    } catch (e) {
      void e;
    }
  };

  const displayName = isMasked ? maskSensitiveText(name) : name;

  const clinicalAnswers = useMemo(() => {
    return (activeForm.questions || []).map((q) => {
      const rawVal = answers[q.id];
      let displayVal = "-";
      if (rawVal !== undefined && rawVal !== null) {
        if (q.type === "choice" && Array.isArray(q.options)) {
          const opt = q.options.find((o) => o.value === rawVal || o.score === rawVal);
          displayVal = opt
            ? typeof opt.label === "object"
              ? opt.label[language] || opt.label.en
              : String(opt.label)
            : String(rawVal);
        } else if (q.type === "scale") {
          displayVal = `${rawVal} / ${q.max || 10} pts`;
        } else if (q.type === "yesno") {
          displayVal = rawVal === "yes" || rawVal === true ? "Ya / Yes" : "Tidak / No";
        } else {
          displayVal = String(rawVal);
        }
      }
      const qText = typeof q.prompt === "object" ? q.prompt[language] || q.prompt.en : q.prompt;
      return {
        id: q.id,
        prompt: qText,
        value:
          isMasked &&
          (q.id.toLowerCase().includes("name") ||
            q.id.toLowerCase().includes("phone") ||
            q.type === "text")
            ? maskSensitiveText(displayVal)
            : displayVal,
      };
    });
  }, [activeForm.questions, answers, isMasked, language]);

  const handlePrint = () => {
    window.print();
  };

  const handlePrintAndPurge = () => {
    window.print();
    setTimeout(() => {
      handleClearAndReset();
    }, 1200);
  };

  const handleShareWhatsApp = () => {
    const subId =
      cachedSummary?.id ||
      (typeof window !== "undefined" ? sessionStorage.getItem("sh_current_submission_id") : null) ||
      `REF-${Date.now().toString().slice(-6)}`;
    const formTitle =
      typeof activeForm.title === "object"
        ? activeForm.title[language] || activeForm.title.en
        : activeForm.title;
    // Sanitized confirmation message without medical diagnoses/symptoms
    const msg = encodeURIComponent(
      `Halo Layanan Faskes, saya telah menyelesaikan formulir intake digital.\n\n` +
        `No. Referensi: ${subId}\n` +
        `Nama Pasien: ${displayName}\n` +
        `Formulir: ${formTitle}\n` +
        `Status: Tersimpan di Sistem Rekam Medis Cloud.\n\n` +
        `Mohon konfirmasi pendaftaran. Terima kasih.`,
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank", "noopener,noreferrer");
  };

  return (
    <PatientShell
      language={language}
      onLanguage={setLang}
      progress={100}
      theme={activeForm.theme}
      customLogo={activeForm.coverPage?.bannerLogoUrl}
      showBrand={!activeForm.coverPage?.bannerLogoUrl}
    >
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
          {/* Clinical Letterhead — Kop Surat Resmi Faskes (A4 Print Only) */}
          <div className="print-only clinical-letterhead">
            <div>
              <h2 className="clinical-letterhead-title">{strings.docTitle}</h2>
              <p className="clinical-letterhead-sub">{strings.clinicHeader}</p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div>
                <strong>{strings.refNo}</strong>{" "}
                {cachedSummary?.id ||
                  (typeof window !== "undefined"
                    ? sessionStorage.getItem("sh_current_submission_id")
                    : null) ||
                  `REF-${Date.now().toString().slice(-6)}`}
              </div>
              <div>
                <strong>{strings.examDate}</strong>{" "}
                {new Date().toLocaleDateString(
                  language === "id" ? "id-ID" : language === "zh" ? "zh-CN" : "en-US",
                  { dateStyle: "long", timeStyle: "short" },
                )}
              </div>
            </div>
          </div>

          {/* Sleek animated checkmark (Screen only) */}
          <div className="sleek-check-bubble screen-only">
            <Check size={28} strokeWidth={3} />
          </div>

          <div className="sleek-complete-hero">
            <span className="sleek-kicker-pill">{strings.done}</span>
            <h1 className="sleek-complete-title">{strings.thanks}</h1>
          </div>

          {/* Masking PHI Status Alert */}
          {isMasked && (
            <div className="mb-3 p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium flex items-center gap-2">
              <EyeOff size={14} className="flex-shrink-0" />
              <span>{strings.maskedNotice}</span>
            </div>
          )}

          {/* Standardized Clinical Triage Box (Screen & Print) */}
          <div className={`clinical-print-triage risk-${risk} sleek-result-box mb-4`}>
            <div className="sleek-result-row">
              <div>
                <span className="sleek-result-sub">{strings.triageHeader}</span>
                <strong className="sleek-result-title">{riskLabel}</strong>
              </div>
              <div className="sleek-result-score-badge">
                <strong>{score}</strong>
                <small>pts</small>
              </div>
            </div>
            <p className="sleek-result-desc">{riskBody}</p>
          </div>

          {/* Live sync badge (Screen only) */}
          <div className="sleek-synced-pill screen-only">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>{strings.sent}</span>
          </div>

          {/* Clinical Print Action Toolbar (Screen only) */}
          <div className="screen-only flex flex-wrap gap-2 justify-center my-4 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm"
              title="Cetak lembar rekam medis fisik A4"
            >
              <Printer size={14} />
              <span>{strings.printRecord}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMasked((prev) => !prev)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                isMasked
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
              title="Sensor identitas pasien untuk menjaga kerahasiaan PHI"
            >
              {isMasked ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>{isMasked ? strings.unmaskPhi : strings.maskPhi}</span>
            </button>

            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-sm"
              title="Kirim konfirmasi referensi ke WhatsApp petugas klinik"
            >
              <Share2 size={14} />
              <span>{strings.shareWa}</span>
            </button>
          </div>

          {/* Clinical Answers Table (Print only) */}
          <div className="print-only">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 mt-4">
              {strings.answersHeader}
            </h3>
            <table className="clinical-answers-table">
              <thead>
                <tr>
                  <th style={{ width: "6%" }}>No.</th>
                  <th style={{ width: "54%" }}>{strings.qCol}</th>
                  <th style={{ width: "40%" }}>{strings.aCol}</th>
                </tr>
              </thead>
              <tbody>
                {clinicalAnswers.map((item, idx) => (
                  <tr key={idx}>
                    <td className="text-center font-bold">{idx + 1}</td>
                    <td>{item.prompt}</td>
                    <td className="font-semibold">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Official Signature Lines */}
            <div className="clinical-print-signature">
              <div className="clinical-signature-box">
                <div>{strings.patientSign}</div>
                <div className="clinical-signature-line">({displayName})</div>
              </div>
              <div className="clinical-signature-box">
                <div>{strings.docSign}</div>
                <div className="clinical-signature-line">
                  (...................................................)
                </div>
              </div>
            </div>
          </div>

          {/* Clean Action Navigation Buttons (Screen only) */}
          <div className="sleek-complete-actions screen-only">
            {isDemoForm && (
              <Link
                to="/intake"
                search={{ form: isSenior ? kneePainForm.id : newPatientForm.id }}
                onClick={handleClearAndReset}
                className="sleek-action-btn secondary"
              >
                <HeartHandshake size={15} />
                <span>{strings.tryOther}</span>
              </Link>
            )}

            <Link
              to="/intake"
              search={{ form: activeForm.id }}
              onClick={handleClearAndReset}
              className={`sleek-action-btn ${isDemoForm ? "ghost" : "secondary"}`}
            >
              <RotateCcw size={15} />
              <span>{strings.restart}</span>
            </Link>

            <Link to="/" onClick={handleClearAndReset} className="sleek-action-btn ghost">
              <Home size={15} />
              <span>{strings.backHome}</span>
            </Link>
          </div>

          {/* Shared Kiosk Auto-Purge Protection Button (Screen only) */}
          <div className="screen-only mt-4 pt-3 border-t border-slate-100/80 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handlePrintAndPurge}
              className="text-xs text-slate-600 hover:text-slate-900 transition inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100 border border-slate-200"
              title="Cetak formulir dan langsung bersihkan memori tablet/kiosk"
            >
              <Trash2 size={13} className="text-amber-600" />
              <span>{strings.printAndPurge}</span>
            </button>

            <Link
              to="/intake"
              search={{ form: activeForm.id }}
              onClick={handleClearAndReset}
              className="text-xs text-slate-500 hover:text-blue-600 transition inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100/60"
            >
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>{strings.kioskReset}</span>
            </Link>
          </div>
        </div>
      )}
    </PatientShell>
  );
}
