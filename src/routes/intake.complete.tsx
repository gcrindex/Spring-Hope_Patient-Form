import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ClipboardList,
  Home,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import {
  calculateScore,
  getPatientName,
  getRisk,
  getStoredAnswers,
  getStoredLanguage,
  kneePainForm,
  resetAssessment,
  saveSubmission,
  setStoredLanguage,
  type Language,
} from "../lib/patientform";

export const Route = createFileRoute("/intake/complete")({
  head: () => ({ meta: [{ title: "Assessment complete — Spring Hope" }] }),
  component: CompletionPage,
});

function CompletionPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setLanguage(getStoredLanguage());
    setAnswers(getStoredAnswers());
  }, []);
  const score = useMemo(() => calculateScore(answers), [answers]);
  const risk = getRisk(score);
  const name = getPatientName() || "Patient";
  const setLang = (next: Language) => {
    setLanguage(next);
    setStoredLanguage(next);
  };

  const strings = {
    en: {
      done: "Assessment complete",
      thanks: `Thanks, ${name}. Your answers are ready to review.`,
      result: "Your screening result",
      low: "Low Risk",
      mod: "Moderate",
      high: "High Risk",
      lowBody: "Your answers suggest a lower level of concern in this screening.",
      modBody: "Some of your answers may benefit from clinical review and follow-up.",
      highBody: "Your answers include symptoms that should be reviewed by the clinic promptly.",
      next: "Recommended next step",
      lowNext: "Keep your planned appointment and mention any changes in symptoms.",
      modNext:
        "Share this result with Spring Hope so the clinical team can review it before your visit.",
      highNext:
        "Contact Spring Hope for clinical guidance, especially if symptoms are severe or worsening.",
      send: "Send to Spring Hope",
      sent: "Saved for clinic review (demo)",
      disclaimer:
        "This screening is for information only and does not provide a medical diagnosis.",
      review: "Review answers",
      restart: "Start again",
    },
    id: {
      done: "Penilaian selesai",
      thanks: `Terima kasih, ${name}. Jawaban Anda siap ditinjau.`,
      result: "Hasil skrining Anda",
      low: "Risiko Rendah",
      mod: "Sedang",
      high: "Risiko Tinggi",
      lowBody: "Jawaban Anda menunjukkan tingkat perhatian yang lebih rendah dalam skrining ini.",
      modBody: "Beberapa jawaban Anda mungkin perlu ditinjau dan ditindaklanjuti oleh klinik.",
      highBody: "Jawaban Anda mencakup gejala yang perlu segera ditinjau oleh klinik.",
      next: "Langkah yang disarankan",
      lowNext: "Tetap lanjutkan jadwal kunjungan Anda dan sampaikan jika ada perubahan gejala.",
      modNext:
        "Bagikan hasil ini ke Spring Hope agar tim klinik dapat meninjaunya sebelum kunjungan.",
      highNext:
        "Hubungi Spring Hope untuk arahan klinis, terutama bila gejala berat atau memburuk.",
      send: "Kirim ke Spring Hope",
      sent: "Disimpan untuk tinjauan klinik (demo)",
      disclaimer: "Skrining ini hanya untuk informasi dan bukan diagnosis medis.",
      review: "Tinjau jawaban",
      restart: "Mulai lagi",
    },
    zh: {
      done: "评估完成",
      thanks: `谢谢您，${name}。您的答案已准备好查看。`,
      result: "您的筛查结果",
      low: "低风险",
      mod: "中等风险",
      high: "高风险",
      lowBody: "本次筛查中，您的答案显示需要关注的程度较低。",
      modBody: "您的部分答案可能需要临床人员进一步查看和跟进。",
      highBody: "您的答案包含应由诊所尽快查看的症状。",
      next: "建议的下一步",
      lowNext: "按计划就诊，如症状有变化请告知医生。",
      modNext: "将结果分享给 Spring Hope，以便临床团队在就诊前查看。",
      highNext: "请联系 Spring Hope 获取临床建议，尤其是在症状严重或加重时。",
      send: "发送给 Spring Hope",
      sent: "已保存供诊所查看（演示）",
      disclaimer: "本筛查仅供参考，不构成医疗诊断。",
      review: "查看答案",
      restart: "重新开始",
    },
  }[language];

  const riskLabel = risk === "low" ? strings.low : risk === "mod" ? strings.mod : strings.high;
  const riskBody =
    risk === "low" ? strings.lowBody : risk === "mod" ? strings.modBody : strings.highBody;
  const nextBody =
    risk === "low" ? strings.lowNext : risk === "mod" ? strings.modNext : strings.highNext;

  const send = () => {
    saveSubmission({
      id: `sub-${Date.now()}`,
      formId: kneePainForm.id,
      patientName: name,
      submittedAt: new Date().toISOString(),
      answers,
      score,
      risk,
    });
    setSaved(true);
  };

  return (
    <PatientShell language={language} onLanguage={setLang} progress={100}>
      <div className="completion-card patient-enter">
        <div className="patient-card-header-actions">
          <Link to="/" className="patient-home-pill">
            <Home size={14} /> Beranda
          </Link>
        </div>
        <div className="completion-check">
          <Check size={28} strokeWidth={2.6} />
        </div>
        <div className="completion-kicker">{strings.done}</div>
        <h1>{strings.thanks}</h1>
        <div className={`risk-card risk-card-${risk}`}>
          <div className="risk-card-head">
            <div>
              <span>{strings.result}</span>
              <strong>{riskLabel}</strong>
            </div>
            <div className="risk-score">
              <strong>{score}</strong>
              <span>score</span>
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
            <ClipboardList size={20} />
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
          <Link to="/intake/question" className="text-action">
            {strings.review}
          </Link>
          <Link to="/" onClick={() => resetAssessment()} className="text-action">
            <CheckCircle2 size={14} />
            {language === "id" ? "Selesaikan form" : language === "zh" ? "完成表单" : "Finish form"}
          </Link>
          <Link to="/intake" onClick={() => resetAssessment()} className="text-action">
            <RotateCcw size={14} />
            {strings.restart}
          </Link>
        </div>
      </div>
    </PatientShell>
  );
}
