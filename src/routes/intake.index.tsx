import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  HeartHandshake,
  Home,
  Mic,
  RotateCcw,
  Sparkles,
  Stethoscope,
  UploadCloud,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import {
  getActiveFormId,
  getFormById,
  getPatientName,
  getStoredLanguage,
  isVoiceAutoMode,
  kneePainForm,
  newPatientForm,
  resetAssessment,
  savePendingPaper,
  setActiveFormId,
  setPatientName,
  setStoredLanguage,
  setStoredQuestionIndex,
  setVoiceAutoMode,
  type Language,
} from "../lib/patientform";

export const Route = createFileRoute("/intake/")({
  validateSearch: (search: Record<string, unknown>) => ({
    form: (search.form as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Formulir Pasien — Ramah Lansia & Suara" },
      {
        name: "description",
        content: "Isi formulir pasien dengan mudah lewat suara atau sentuhan layar besar.",
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
  const [useVoiceFirst, setUseVoiceFirst] = useState(() => isVoiceAutoMode());
  const [showNameField, setShowNameField] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [paperPreview, setPaperPreview] = useState<string | null>(null);
  const [paperConfirmed, setPaperConfirmed] = useState(false);
  const [paperUploading, setPaperUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const isSeniorNewPatient = activeForm.id === newPatientForm.id;

  const handleSelectPaper = (file: File) => {
    setPaperFile(file);
    setPaperPreview(URL.createObjectURL(file));
  };

  const submitPaper = () => {
    if (!paperFile || !paperConfirmed) return;
    setPaperUploading(true);

    const patient = name.trim() || (language === "id" ? "Pasien (Kertas)" : "Patient (Paper)");
    setPatientName(patient);

    savePendingPaper({
      formId: activeForm.id,
      timestamp: new Date().toISOString(),
      patientName: patient,
    });

    setTimeout(() => {
      setPaperUploading(false);
      setShowPaperModal(false);
      navigate({ to: "/intake/complete" });
    }, 600);
  };

  return (
    <PatientShell language={language} onLanguage={setLang} onBack={() => navigate({ to: "/" })}>
      <div className="patient-card patient-card-start patient-enter senior-friendly-card">
        {/* Form Switcher Pill for Demo */}
        <div className="demo-toggle-banner">
          <span className="demo-pill-label">Pilih Demo Form:</span>
          <div className="demo-pill-group">
            <button
              type="button"
              className={`demo-pill-btn ${activeForm.id === newPatientForm.id ? "active" : ""}`}
              onClick={() => switchForm(newPatientForm.id)}
            >
              <HeartHandshake size={15} /> Demo 1: Pasien Baru (Lansia)
            </button>
            <button
              type="button"
              className={`demo-pill-btn ${activeForm.id === kneePainForm.id ? "active" : ""}`}
              onClick={() => switchForm(kneePainForm.id)}
            >
              <Stethoscope size={15} /> Demo 2: Nyeri Lutut
            </button>
          </div>
        </div>

        <div className="patient-card-header-actions">
          <Link to="/" className="patient-home-pill">
            <Home size={14} /> Beranda
          </Link>
          <span className="senior-badge">
            <Sparkles size={14} />
            {isSeniorNewPatient
              ? language === "id"
                ? "Desain Ramah Manula & Suara"
                : "Senior-Friendly & Voice UX"
              : language === "id"
                ? "Penilaian Spesifik Lutut"
                : "Knee Clinical Assessment"}
          </span>
        </div>

        <h1 className="senior-main-title">{activeForm.title[language] ?? activeForm.title.en}</h1>

        <p className="senior-main-desc">
          {isSeniorNewPatient
            ? language === "id"
              ? "Formulir singkat tanpa perlu mengetik. Cukup sentuh pilihan jawaban Anda."
              : language === "zh"
                ? "简短问卷无需打字，直接点击选项即可。"
                : "A brief form without typing. Simply tap your answer."
            : (activeForm.description[language] ?? activeForm.description.en)}
        </p>

        {/* 1 Single Obvious Start Button for Seniors */}
        <div className="senior-action-stack">
          <button
            type="button"
            className="patient-giant-action button-touch"
            onClick={() => start(false)}
            style={{
              padding: "20px 28px",
              minHeight: "72px",
              borderRadius: "22px",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "20px",
                fontWeight: 800,
                letterSpacing: "-0.01em",
              }}
            >
              {language === "id" ? "Mulai Sekarang" : language === "zh" ? "开始填写" : "Start Now"}
            </span>
            <ArrowRight size={24} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Modal Upload Foto Formulir Kertas */}
      {showPaperModal && (
        <div className="paper-modal-overlay" onClick={() => setShowPaperModal(false)}>
          <div className="paper-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="paper-modal-head">
              <div>
                <h2>Unggah Formulir Kertas</h2>
                <p>Ambil foto atau pilih file gambar formulir yang sudah Anda isi.</p>
              </div>
              <button
                type="button"
                className="paper-modal-close"
                onClick={() => setShowPaperModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleSelectPaper(f);
              }}
            />

            {!paperPreview ? (
              <div className="paper-upload-box" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud size={36} />
                <strong>Pilih Foto / Ambil dengan Kamera</strong>
                <span>Format PNG, JPG, atau WebP (maks. 10MB)</span>
              </div>
            ) : (
              <div className="paper-preview-area">
                <img src={paperPreview} alt="Pratinjau formulir kertas" />
                <button
                  type="button"
                  className="paper-repick-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <RotateCcw size={14} /> Ambil / Pilih Ulang
                </button>
              </div>
            )}

            <label className="paper-confirm-row">
              <input
                type="checkbox"
                checked={paperConfirmed}
                onChange={(e) => setPaperConfirmed(e.target.checked)}
              />
              <span>
                Saya menyatakan bahwa foto ini adalah formulir asli yang telah saya isi dengan
                benar.
              </span>
            </label>

            <div className="paper-modal-actions">
              <button
                type="button"
                className="admin-soft-button"
                onClick={() => setShowPaperModal(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="patient-primary-action"
                disabled={!paperPreview || !paperConfirmed || paperUploading}
                onClick={submitPaper}
              >
                {paperUploading ? (
                  "Mengunggah formulir…"
                ) : (
                  <>
                    <Check size={18} /> Kirim Formulir Kertas
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PatientShell>
  );
}
