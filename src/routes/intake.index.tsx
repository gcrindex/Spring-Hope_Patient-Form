import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Home,
  Image as ImageIcon,
  Mic,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import {
  getPatientName,
  getStoredLanguage,
  kneePainForm,
  resetAssessment,
  savePendingPaper,
  setPatientName,
  setStoredLanguage,
  type Language,
} from "../lib/patientform";

export const Route = createFileRoute("/intake/")({
  head: () => ({
    meta: [
      { title: "Knee Pain Assessment — Spring Hope" },
      {
        name: "description",
        content: "Begin a guided knee pain assessment with optional voice answering.",
      },
    ],
  }),
  component: IntakeStart,
});

function IntakeStart() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [name, setName] = useState("");
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [paperPreview, setPaperPreview] = useState<string | null>(null);
  const [paperConfirmed, setPaperConfirmed] = useState(false);
  const [paperUploading, setPaperUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setName(getPatientName());
  }, []);

  const setLang = (next: Language) => {
    setLanguage(next);
    setStoredLanguage(next);
  };

  const start = () => {
    if (!name.trim()) return;
    setPatientName(name.trim());
    resetAssessment();
    navigate({ to: "/intake/question" });
  };

  const handleSelectPaper = (file: File) => {
    setPaperFile(file);
    setPaperPreview(URL.createObjectURL(file));
  };

  const submitPaper = () => {
    if (!paperFile || !paperConfirmed) return;
    setPaperUploading(true);

    const patient = name.trim() || "Patient (Paper)";
    setPatientName(patient);

    savePendingPaper({
      formId: kneePainForm.id,
      timestamp: new Date().toISOString(),
      patientName: patient,
    });

    setTimeout(() => {
      setPaperUploading(false);
      setShowPaperModal(false);
      navigate({ to: "/intake/complete" });
    }, 600);
  };

  const title = kneePainForm.title[language];
  const description = kneePainForm.description[language];
  const localized = {
    en: {
      badge: "2–3 minute guided assessment",
      intro: "Let's check how your knee has been feeling.",
      name: "What should we call you?",
      placeholder: "Your name",
      start: "Start assessment",
      voice: "Voice is optional",
      voiceBody:
        "Tap the microphone on any question to answer naturally. You'll always be able to review or answer manually.",
      paper: "Already completed a paper form?",
      photo: "Upload photo of completed form",
      privacy: "Microphone access is only requested when you choose voice.",
    },
    id: {
      badge: "Penilaian terpandu 2–3 menit",
      intro: "Mari cek bagaimana kondisi lutut Anda.",
      name: "Siapa nama Anda?",
      placeholder: "Nama Anda",
      start: "Mulai penilaian",
      voice: "Suara bersifat opsional",
      voiceBody:
        "Tekan mikrofon pada pertanyaan untuk menjawab dengan suara. Jawaban tetap bisa ditinjau atau diisi manual.",
      paper: "Sudah mengisi formulir kertas?",
      photo: "Unggah foto formulir yang sudah diisi",
      privacy: "Akses mikrofon hanya diminta saat Anda memilih fitur suara.",
    },
    zh: {
      badge: "2–3分钟引导式评估",
      intro: "让我们了解一下您膝盖的情况。",
      name: "我们该如何称呼您？",
      placeholder: "您的姓名",
      start: "开始评估",
      voice: "语音为可选功能",
      voiceBody: "在任意问题上点击麦克风即可语音回答。您始终可以检查或手动填写。",
      paper: "已经填写纸质表格？",
      photo: "上传已填写的纸质表单照片",
      privacy: "只有在您选择语音时才会请求麦克风权限。",
    },
  }[language];

  return (
    <PatientShell
      language={language}
      onLanguage={setLang}
      onBack={() => navigate({ to: "/" })}
    >
      <div className="patient-card patient-card-start patient-enter">
        <div className="patient-card-header-actions">
          <Link to="/" className="patient-home-pill">
            <Home size={14} /> Beranda
          </Link>
        </div>

        <div className="patient-start-icon">
          <Sparkles size={23} />
        </div>
        <div className="patient-badge">
          <Clock3 size={14} /> {localized.badge}
        </div>
        <h1>{title}</h1>
        <p className="patient-intro-lead">{localized.intro}</p>
        <p className="patient-description">{description}</p>

        <label className="patient-field-label" htmlFor="patient-name">
          {localized.name}
        </label>
        <input
          id="patient-name"
          className="patient-name-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={localized.placeholder}
          autoComplete="name"
          onKeyDown={(event) => event.key === "Enter" && start()}
        />

        <button
          type="button"
          className="patient-primary-action"
          onClick={start}
          disabled={!name.trim()}
        >
          {localized.start}
          <ChevronRight size={19} />
        </button>

        <div className="voice-intro-card">
          <div className="voice-intro-icon">
            <Mic size={20} />
          </div>
          <div>
            <strong>{localized.voice}</strong>
            <p>{localized.voiceBody}</p>
          </div>
        </div>
        <div className="patient-privacy-line">
          <ShieldCheck size={15} /> {localized.privacy}
        </div>

        <div className="patient-paper-divider">
          <span>atau</span>
        </div>

        <button
          type="button"
          className="patient-paper-action-active"
          onClick={() => setShowPaperModal(true)}
        >
          <Camera size={20} />
          <span className="text-left flex-1">
            <strong>{localized.paper}</strong>
            <small>{localized.photo}</small>
          </span>
          <ChevronRight size={16} />
        </button>
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
              <div
                className="paper-upload-box"
                onClick={() => fileInputRef.current?.click()}
              >
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
                Saya menyatakan bahwa foto ini adalah formulir asli yang telah saya isi dengan benar.
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
