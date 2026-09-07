import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  Home,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
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
    form: (search.form as string) || undefined,
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
  const name = getPatientName() || (language === "id" ? "Pasien" : "Patient");

  const setLang = (next: Language) => {
    setLanguage(next);
    setStoredLanguage(next);
  };

  const isSenior = activeForm.id === newPatientForm.id;

  const strings = {
    en: {
      done: isSenior ? "Registration Completed" : "Assessment Complete",
      thanks: `Thank you, ${name}. Your answers have been recorded.`,
      result: "Intake Priority Summary",
      low: "Standard Routine",
      mod: "Priority Attention",
      high: "Urgent Clinical Review",
      lowBody: "Thank you for completing your intake. Our staff will prepare your files.",
      modBody: "Some of your symptoms may require prioritized physical assistance upon arrival.",
      highBody: "Our medical team will review your symptoms promptly to assist with priority care.",
      next: "Next Steps at Clinic",
      lowNext: "Please proceed to reception desk with your ID card.",
      modNext: "Our nurse desk is notified to assist with mobility if needed.",
      highNext: "Priority queue assigned for consultation and triage.",
      send: "Submit to Clinic Portal",
      sent: "Saved & Sent to Clinic (Demo)",
      disclaimer: "This form assists clinical workflow and triage preparation.",
      review: "Review answers",
      restart: "Start over",
    },
    id: {
      done: isSenior ? "Pendaftaran Berhasil Selesai" : "Penilaian Selesai",
      thanks: `Terima kasih, ${name}. Formulir Anda telah berhasil dicatat.`,
      result: "Ringkasan Prioritas Kunjungan",
      low: "Pemeriksaan Rutin",
      mod: "Perhatian Prioritas",
      high: "Tinjauan Segera",
      lowBody: "Terima kasih sudah mengisi. Petugas klinik telah menerima data Anda.",
      modBody: "Beberapa keluhan Anda menandakan perlunya bantuan fisik / kursi roda saat tiba.",
      highBody: "Tim medis akan memprioritaskan pemeriksaan awal untuk Anda.",
      next: "Langkah Selanjutnya di Klinik",
      lowNext: "Silakan menuju meja registrasi depan saat tiba.",
      modNext: "Perawat kami telah diberi notifikasi untuk menyiapkan bantuan jalan.",
      highNext: "Nomor antrean prioritas akan disiapkan oleh petugas.",
      send: "Kirim ke Sistem Klinik",
      sent: "Tersimpan ke Portal Klinik (Demo)",
      disclaimer: "Formulir ini mempermudah registrasi dan triase awal pasien.",
      review: "Tinjau jawaban",
      restart: "Mulai dari awal",
    },
    zh: {
      done: isSenior ? "登记完成" : "评估完成",
      thanks: `谢谢您，${name}。您的信息已记录完毕。`,
      result: "就诊分流建议",
      low: "常规就诊",
      mod: "优先跟进",
      high: "重点关照",
      lowBody: "感谢您完成登记。诊所已收到您的信息。",
      modBody: "根据您的描述，诊所将视情况为您提供行动便利。",
      highBody: "医护人员将为您提供优先分诊评估。",
      next: "下一步指引",
      lowNext: "到达诊所后请前往前台出示身份证件。",
      modNext: "护理人员已收到提醒，必要时为您提供轮椅。",
      highNext: "将为您安排优先分诊队列。",
      send: "提交至诊所系统",
      sent: "已同步至诊所端（演示）",
      disclaimer: "本表单仅用于就诊登记与分流参考。",
      review: "查看答案",
      restart: "重新填写",
    },
  }[language];

  const riskLabel = risk === "low" ? strings.low : risk === "mod" ? strings.mod : strings.high;
  const riskBody =
    risk === "low" ? strings.lowBody : risk === "mod" ? strings.modBody : strings.highBody;
  const nextBody =
    risk === "low" ? strings.lowNext : risk === "mod" ? strings.modNext : strings.highNext;

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

  const send = () => {
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
  };

  return (
    <PatientShell language={language} onLanguage={setLang} progress={100}>
      <div className="completion-card patient-enter senior-complete-card">
        <div className="patient-card-header-actions">
          <Link to="/" className="patient-home-pill">
            <Home size={14} /> Beranda
          </Link>
        </div>
        <div className="completion-check">
          <Check size={32} strokeWidth={3} />
        </div>
        <div className="completion-kicker">{strings.done}</div>
        <h1 className="text-2xl sm:text-3xl font-black text-ink">{strings.thanks}</h1>

        <div className={`risk-card risk-card-${risk} mt-4`}>
          <div className="risk-card-head">
            <div>
              <span>{strings.result}</span>
              <strong>{riskLabel}</strong>
            </div>
            <div className="risk-score">
              <strong>{score}</strong>
              <span>skor</span>
            </div>
          </div>
          <p>{riskBody}</p>
          <div className="risk-meter">
            <span className={risk === "low" ? "active" : ""} />
            <span className={risk === "mod" ? "active" : ""} />
            <span className={risk === "high" ? "active" : ""} />
          </div>
        </div>

        <div className="next-step-card">
          <div className="next-step-icon">
            <ClipboardList size={22} />
          </div>
          <div>
            <strong>{strings.next}</strong>
            <p>{nextBody}</p>
          </div>
        </div>

        <div className="clinical-disclaimer">
          <ShieldAlert size={17} />
          <span>{strings.disclaimer}</span>
        </div>

        <button type="button" className="patient-primary-action" onClick={send} disabled={saved}>
          {saved ? (
            <>
              <CheckCircle2 size={18} />
              {strings.sent}
            </>
          ) : (
            <>
              {strings.send}
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <div className="completion-secondary-actions">
          <Link
            to="/intake"
            search={{ form: isSenior ? kneePainForm.id : newPatientForm.id }}
            onClick={() => {
              resetAssessment();
              setStoredQuestionIndex(0);
            }}
            className="text-action"
          >
            <HeartHandshake size={14} />
            {isSenior ? "Coba Demo 2: Nyeri Lutut" : "Coba Demo 1: Pasien Baru (Lansia)"}
          </Link>
          <Link
            to="/intake"
            search={{ form: activeForm.id }}
            onClick={() => {
              resetAssessment();
              setStoredQuestionIndex(0);
            }}
            className="text-action"
          >
            <RotateCcw size={14} />
            {strings.restart}
          </Link>
          <Link to="/admin" className="text-action text-blue-600 font-bold">
            Lihat di Admin Portal →
          </Link>
        </div>
      </div>
    </PatientShell>
  );
}
