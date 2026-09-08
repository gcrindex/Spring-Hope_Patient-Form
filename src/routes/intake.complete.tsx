import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, CheckCircle2, HeartHandshake, Home, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  saveSubmission,
  setStoredLanguage,
  setStoredQuestionIndex,
  type Language,
} from "../lib/patientform";

export const Route = createFileRoute("/intake/complete")({
  validateSearch: (search: Record<string, unknown>) => ({
    form: (search["form"] as string) || undefined,
  }),
  head: () => ({ meta: [{ title: "Formulir Selesai — 9forms.com" }] }),
  component: CompletionPage,
});

function CompletionPage() {
  const { form: formParam } = Route.useSearch();
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [saved, setSaved] = useState(false);

  const activeForm = useMemo(() => {
    return getFormById(formParam || getActiveFormId());
  }, [formParam]);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setAnswers(getStoredAnswers());
  }, []);

  const score = useMemo(() => calculateScore(answers, activeForm), [answers, activeForm]);
  const risk = getRisk(score);

  const name = useMemo(() => {
    const answerNameEntry = Object.entries(answers).find(
      ([k, v]) => (k.includes("name") || k === "q_np_name") && typeof v === "string" && v.trim(),
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
      sent: "Saved & Synced to Admin Portal",
      restart: "Start over",
      backHome: "Back to Home",
    },
    id: {
      done: isSenior ? "Pendaftaran Berhasil Selesai" : "Penilaian Selesai",
      thanks: `Terima kasih, ${name}. Formulir Anda telah tercatat.`,
      result: "Status Prioritas",
      low: "Pemeriksaan Rutin",
      mod: "Perhatian Prioritas",
      high: "Tinjauan Segera",
      lowBody: "Jawaban Anda telah tersimpan dan diterima oleh portal admin.",
      modBody: "Bantuan prioritas akan disiapkan oleh petugas.",
      highBody: "Tim klinis segera menerima notifikasi untuk triase prioritas.",
      tryOther: isSenior ? "Coba Demo 2: Nyeri Lutut" : "Coba Demo 1: Pasien Baru",
      sent: "Tersimpan & Terhubung ke Portal Admin",
      restart: "Mulai dari awal",
      backHome: "Kembali ke Beranda",
    },
    zh: {
      done: isSenior ? "登记完成" : "评估完成",
      thanks: `谢谢您，${name}。您的问卷已记录完毕。`,
      result: "分流状态",
      low: "常规就诊",
      mod: "优先跟进",
      high: "重点关照",
      lowBody: "您的答案已成功保存并同步至管理后台。",
      modBody: "诊所工作人员已为您做好优先接待准备。",
      highBody: "医护团队已收到优先分诊提醒。",
      tryOther: isSenior ? "体验示例 2: 膝痛评估" : "体验示例 1: 新患者",
      sent: "已同步至管理后台",
      restart: "重新填写",
      backHome: "返回首页",
    },
  }[language];

  const riskLabel = risk === "low" ? strings.low : risk === "mod" ? strings.mod : strings.high;
  const riskBody =
    risk === "low" ? strings.lowBody : risk === "mod" ? strings.modBody : strings.highBody;

  const autoSavedRef = useRef(false);

  useEffect(() => {
    if (!autoSavedRef.current && Object.keys(answers).length > 0) {
      autoSavedRef.current = true;
      saveSubmission({
        id: `sub-${Date.now()}`,
        formId: activeForm.id,
        patientName: name,
        submittedAt: new Date().toISOString(),
        answers,
        score,
        risk,
        triageStatus: risk === "high" ? "review" : risk === "mod" ? "scheduled" : "completed",
      });
      setSaved(true);
    }
  }, [answers, activeForm.id, name, score, risk]);

  return (
    <PatientShell language={language} onLanguage={setLang} progress={100} theme={activeForm.theme}>
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
            onClick={() => {
              resetAssessment();
              setStoredQuestionIndex(0);
            }}
            className="sleek-action-btn secondary"
          >
            <HeartHandshake size={15} />
            <span>{strings.tryOther}</span>
          </Link>

          <Link
            to="/intake"
            search={{ form: activeForm.id }}
            onClick={() => {
              resetAssessment();
              setStoredQuestionIndex(0);
            }}
            className="sleek-action-btn ghost"
          >
            <RotateCcw size={15} />
            <span>{strings.restart}</span>
          </Link>

          <Link to="/" className="sleek-action-btn ghost">
            <Home size={15} />
            <span>{strings.backHome}</span>
          </Link>
        </div>
      </div>
    </PatientShell>
  );
}
