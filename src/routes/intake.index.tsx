import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  HeartHandshake,
  HelpCircle,
  Lock,
  Mic,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import {
  elderlyFriendlyForm,
  fetchFormByIdAsync,
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
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    const fId = formParam || getActiveFormId();
    setActiveFormId(fId);
    setLanguage(getStoredLanguage());
    setName(getPatientName());

    const initialForm = getFormById(fId);
    if (initialForm && initialForm.coverPage?.enabled === false) {
      resetAssessment();
      setStoredQuestionIndex(0);
      navigate({ to: "/intake/question", search: { form: initialForm.id }, replace: true });
      return;
    }

    fetchFormByIdAsync(fId).then((resolved) => {
      setActiveForm(resolved);
      // If cover is disabled, immediately redirect to Question 1
      if (resolved.coverPage?.enabled === false) {
        resetAssessment();
        setStoredQuestionIndex(0);
        navigate({ to: "/intake/question", search: { form: resolved.id }, replace: true });
      }
    });
  }, [formParam, navigate]);

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

  const cover = activeForm.coverPage || {};
  const showName = cover.showNameInput ?? true;
  const isNameRequired = cover.nameRequired ?? false;
  const showConsent = cover.showConsent ?? true;

  const start = (withVoice = false) => {
    if (showName && isNameRequired && (!name || !name.trim())) {
      setNameError(
        language === "id"
          ? "Silakan masukkan nama Anda sebelum mulai."
          : language === "zh"
            ? "请在开始前输入您的姓名。"
            : "Please enter your name to proceed.",
      );
      return;
    }
    setNameError("");
    resetAssessment();
    if (name && name.trim()) {
      setPatientName(name.trim());
    }
    setVoiceAutoMode(withVoice || useVoiceFirst);
    setStoredQuestionIndex(0);
    navigate({ to: "/intake/question", search: { form: activeForm.id } });
  };

  const isDemoForm =
    !formParam &&
    (activeForm.id === newPatientForm.id ||
      activeForm.id === kneePainForm.id ||
      activeForm.id === elderlyFriendlyForm.id);

  const isSeniorNewPatient =
    activeForm.id === newPatientForm.id || activeForm.id === elderlyFriendlyForm.id;

  // Localized texts
  const coverTitle =
    cover.title?.[language] ||
    (typeof activeForm.title === "object" && activeForm.title !== null
      ? activeForm.title[language] ?? activeForm.title.en ?? activeForm.title.id
      : String(activeForm.title || ""));

  const coverDesc =
    cover.description?.[language] ||
    (isSeniorNewPatient
      ? language === "id"
        ? "Formulir singkat & jelas tanpa mengetik. Cukup sentuh jawaban atau gunakan suara."
        : language === "zh"
          ? "清晰简短问卷，支持直接触屏点击或语音快速作答。"
          : "A clean, guided intake. Touch your answer or speak naturally."
      : typeof activeForm.description === "object" && activeForm.description !== null
        ? activeForm.description[language] ?? activeForm.description.en ?? activeForm.description.id
        : String(activeForm.description || ""));

  const startBtnText =
    cover.buttonText?.[language] ||
    (language === "id" ? "Mulai Pengisian" : language === "zh" ? "开始填写" : "Start Form");

  const voiceBtnText =
    cover.voiceButtonText?.[language] ||
    (language === "id"
      ? "Mulai dengan Suara"
      : language === "zh"
        ? "语音模式开始"
        : "Start with Voice");

  const consentText =
    cover.consentText?.[language] ||
    (language === "id"
      ? "Saya menyetujui pengisian data ini untuk keperluan evaluasi & pelayanan."
      : language === "zh"
        ? "我同意提交本表单数据用于后续评估与服务支持。"
        : "I agree to submit this information for evaluation & service delivery.");

  const totalQuestions = activeForm.questions?.length || 5;
  const estTime = cover.estimatedMinutes || (totalQuestions <= 3 ? 1 : totalQuestions <= 6 ? 2 : 3);

  return (
    <PatientShell
      language={language}
      onLanguage={setLang}
      onBack={() => navigate({ to: "/" })}
      theme={activeForm.theme}
      customLogo={cover.bannerLogoUrl}
      showBrand={!cover.bannerLogoUrl}
    >
      <div className="patient-card patient-card-start patient-enter sleek-form-card">
        {/* Optional Custom Organization Banner/Logo */}
        {cover.bannerLogoUrl && (
          <div className="flex justify-center mb-4">
            <img
              src={cover.bannerLogoUrl}
              alt="Organization Logo"
              className="max-h-12 w-auto object-contain"
            />
          </div>
        )}

        {/* Sleek Segmented Switcher for Demos (shown only on public default demo page) */}
        {isDemoForm && (
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
        )}

        {/* Smart Metadata Badges */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-3 text-xs font-bold text-slate-500">
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">
            <Clock size={12} className="text-teal-600" />
            <span>~{estTime} min</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">
            <HelpCircle size={12} className="text-sky-600" />
            <span>{totalQuestions} questions</span>
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full text-emerald-700">
            <Lock size={11} className="text-emerald-600" />
            <span>AES-256</span>
          </span>
        </div>

        {/* Cover Hero Content */}
        <div className="sleek-card-hero">
          <h1 className="sleek-main-title">{coverTitle}</h1>
          <p className="sleek-main-desc">{coverDesc}</p>
        </div>

        {/* Optional Patient Name Input */}
        {showName && (
          <div className="w-full my-3 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User size={13} className="text-teal-600" />
                {language === "id"
                  ? "Nama Lengkap Anda"
                  : language === "zh"
                    ? "您的姓名"
                    : "Your Full Name"}
              </span>
              <small className="font-semibold lowercase text-slate-400">
                {isNameRequired
                  ? language === "id"
                    ? "(Wajib)"
                    : language === "zh"
                      ? "(必填)"
                      : "(Required)"
                  : language === "id"
                    ? "(Opsional)"
                    : language === "zh"
                      ? "(选填)"
                      : "(Optional)"}
              </small>
            </label>
            <input
              type="text"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-semibold text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
              placeholder={
                language === "id"
                  ? "Contoh: Budi Santoso"
                  : language === "zh"
                    ? "例如: 张伟"
                    : "e.g. Jane Doe"
              }
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
            />
            {nameError && (
              <p className="text-xs text-red-600 font-semibold mt-1">{nameError}</p>
            )}
          </div>
        )}

        {/* Optional Consent Checkbox */}
        {showConsent && (
          <div className="w-full my-2 text-left">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4 shrink-0"
              />
              <span className="text-xs font-medium text-slate-600 leading-tight">
                {consentText}
              </span>
            </label>
          </div>
        )}

        {/* Dual Start Action Buttons */}
        <div className="sleek-action-wrap mt-4 flex flex-col gap-2.5 w-full">
          <button
            type="button"
            className="sleek-giant-btn"
            disabled={showConsent && !consentAgreed}
            style={{ opacity: showConsent && !consentAgreed ? 0.5 : 1 }}
            onClick={() => start(false)}
          >
            <span>{startBtnText}</span>
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            className="w-full py-2.5 px-4 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            disabled={showConsent && !consentAgreed}
            onClick={() => start(true)}
          >
            <Mic size={15} className="text-emerald-600 animate-pulse" />
            <span>{voiceBtnText}</span>
          </button>
        </div>
      </div>
    </PatientShell>
  );
}
