import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Sparkles, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import {
  elderlyFriendlyForm,
  getActiveFormId,
  getFormById,
  getPatientName,
  getStoredLanguage,
  isVoiceAutoMode,
  kneePainForm,
  newPatientForm,
  resetAssessment,
  setActiveFormId,
  setPatientName,
  setStoredLanguage,
  setStoredQuestionIndex,
  setVoiceAutoMode,
  type Language,
} from "../lib/patientform";

export const Route = createFileRoute("/intake/")({
  validateSearch: (search: Record<string, unknown>) => ({
    form: (search["form"] as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Formulir Terpandu — 9forms.com" },
      {
        name: "description",
        content:
          "Formulir interaktif modern dan ramah lansia dengan input suara dan navigasi otomatis.",
      },
    ],
  }),
  component: IntakeStart,
});

function IntakeStart() {
  const { form: formParam } = Route.useSearch();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [activeForm, setActiveForm] = useState(() => getFormById(formParam || getActiveFormId()));
  const [name, setName] = useState(() => getPatientName());
  const [useVoiceFirst] = useState(() => isVoiceAutoMode());

  useEffect(() => {
    const fId = formParam || getActiveFormId();
    setActiveFormId(fId);
    setActiveForm(getFormById(fId));
    setLanguage(getStoredLanguage());
    setName(getPatientName());
  }, [formParam]);

  const setLang = (next: Language) => {
    setLanguage(next);
    setStoredLanguage(next);
  };

  const switchForm = (formId: string) => {
    setActiveFormId(formId);
    setActiveForm(getFormById(formId));
    resetAssessment();
    setStoredQuestionIndex(0);
    navigate({ to: "/intake", search: { form: formId } });
  };

  const start = (withVoice = false) => {
    resetAssessment();
    if (name && name.trim()) {
      setPatientName(name.trim());
    }
    setVoiceAutoMode(withVoice || useVoiceFirst);
    setStoredQuestionIndex(0);
    navigate({ to: "/intake/question", search: { form: activeForm.id } });
  };

  const isSeniorNewPatient =
    activeForm.id === newPatientForm.id || activeForm.id === elderlyFriendlyForm.id;

  return (
    <PatientShell
      language={language}
      onLanguage={setLang}
      onBack={() => navigate({ to: "/" })}
      theme={activeForm.theme}
    >
      <div className="patient-card patient-card-start patient-enter sleek-form-card">
        {/* Sleek Segmented Switcher for Demos */}
        <div className="sleek-demo-segment" role="tablist" aria-label="Pilih Form Demo">
          <button
            type="button"
            className={`sleek-segment-item ${activeForm.id === newPatientForm.id ? "active" : ""}`}
            onClick={() => switchForm(newPatientForm.id)}
          >
            <HeartHandshake size={15} className="flex-shrink-0" />
            <span>
              {language === "id"
                ? "Demo 1: Pasien Baru"
                : language === "zh"
                  ? "示例 1: 新患者"
                  : "Demo 1: New Patient"}
            </span>
          </button>
          <button
            type="button"
            className={`sleek-segment-item ${activeForm.id === kneePainForm.id ? "active" : ""}`}
            onClick={() => switchForm(kneePainForm.id)}
          >
            <Stethoscope size={15} className="flex-shrink-0" />
            <span>
              {language === "id"
                ? "Demo 2: Nyeri Lutut"
                : language === "zh"
                  ? "示例 2: 膝痛评估"
                  : "Demo 2: Knee Pain"}
            </span>
          </button>
          <button
            type="button"
            className={`sleek-segment-item ${activeForm.id === elderlyFriendlyForm.id ? "active" : ""}`}
            onClick={() => switchForm(elderlyFriendlyForm.id)}
          >
            <Sparkles size={15} className="flex-shrink-0" />
            <span>
              {language === "id"
                ? "Demo 3: Lansia Kontras"
                : language === "zh"
                  ? "示例 3: 长者关怀"
                  : "Demo 3: Senior-Friendly"}
            </span>
          </button>
        </div>

        <div className="sleek-card-hero">
          <h1 className="sleek-main-title">{activeForm.title[language] ?? activeForm.title.en}</h1>

          <p className="sleek-main-desc">
            {isSeniorNewPatient
              ? language === "id"
                ? "Formulir singkat & jelas tanpa mengetik. Cukup sentuh jawaban atau gunakan suara."
                : language === "zh"
                  ? "清晰简短问卷，支持直接触屏点击或语音快速作答。"
                  : "A clean, guided intake. Touch your answer or speak naturally."
              : (activeForm.description[language] ?? activeForm.description.en)}
          </p>
        </div>

        {/* 1 Clean, Bold Start Button */}
        <div className="sleek-action-wrap">
          <button type="button" className="sleek-giant-btn" onClick={() => start(false)}>
            <span>
              {language === "id" ? "Mulai Sekarang" : language === "zh" ? "开始填写" : "Start Now"}
            </span>
            <ArrowRight size={22} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </PatientShell>
  );
}
