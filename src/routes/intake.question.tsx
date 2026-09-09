import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Mic, MicOff, Quote, ShieldCheck, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import {
  copy,
  fetchFormByIdAsync,
  getActiveFormId,
  getFormById,
  getStoredAnswers,
  getStoredLanguage,
  getStoredQuestionIndex,
  isVoiceAutoMode,
  localeFor,
  matchOptionTranscript,
  newPatientForm,
  parseScaleTranscript,
  setActiveFormId,
  setPatientName,
  setStoredAnswers,
  setStoredLanguage,
  setStoredQuestionIndex,
  setVoiceAutoMode,
  type Answers,
  type Language,
  type Question,
} from "../lib/patientform";

export const Route = createFileRoute("/intake/question")({
  validateSearch: (search: Record<string, unknown>) => ({
    form: (search["form"] as string) || undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pertanyaan — 9forms.com" },
      {
        name: "description",
        content: "Formulir interaktif terpandu dengan navigasi otomatis dan pengenalan suara.",
      },
    ],
  }),
  component: QuestionPage,
});

function QuestionPage() {
  const { form: formParam } = Route.useSearch();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [activeForm, setActiveForm] = useState(() => {
    const fId = formParam || getActiveFormId();
    return getFormById(fId);
  });

  const [index, setIndex] = useState(() => {
    const stored = getStoredQuestionIndex();
    return Math.min(stored, Math.max(0, activeForm.questions.length - 1));
  });

  const [answers, setAnswers] = useState<Answers>(() => getStoredAnswers());
  const [voiceMappedLabel, setVoiceMappedLabel] = useState("");
  const [voiceIssue, setVoiceIssue] = useState("");
  const [voiceAuto, setVoiceAuto] = useState(() => isVoiceAutoMode());
  const [justSelected, setJustSelected] = useState<string | number | null>(null);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceAutoStartTimerRef = useRef<NodeJS.Timeout | null>(null);

  const question = activeForm.questions[index] ?? activeForm.questions[0];
  const t = copy[language];
  const isLastQuestion = index >= activeForm.questions.length - 1;

  useEffect(() => {
    const fId = formParam || getActiveFormId();
    if (formParam) setActiveFormId(formParam);
    setLanguage(getStoredLanguage());
    setAnswers(getStoredAnswers());

    fetchFormByIdAsync(fId).then((resolved) => {
      setActiveForm(resolved);
      setIndex((prev) => Math.min(prev, Math.max(0, resolved.questions.length - 1)));
    });
  }, [formParam]);

  const answer = question ? answers[question.id] : undefined;
  const isAnswered = question
    ? question.optional || (answer !== undefined && answer !== "")
    : false;

  // Smooth auto-advance transition
  const triggerAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    autoAdvanceTimerRef.current = setTimeout(() => {
      setJustSelected(null);
      if (index >= activeForm.questions.length - 1) {
        if (privacyConsent) {
          navigate({ to: "/intake/complete", search: { form: activeForm.id } });
        }
      } else {
        const next = index + 1;
        setIndex(next);
        setStoredQuestionIndex(next);
        setVoiceMappedLabel("");
        setVoiceIssue("");
      }
    }, 650);
  }, [index, activeForm.questions.length, navigate, activeForm.id, privacyConsent]);

  const updateAnswer = useCallback(
    (value: string | number, autoAdvance = true) => {
      if (!question) return;
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      setVoiceIssue("");
      setJustSelected(value);
      setAnswers((current) => {
        const next = { ...current, [question.id]: value };
        setStoredAnswers(next);
        return next;
      });

      const isNameQuestion =
        question.id.toLowerCase().includes("name") ||
        question.id === "q_np_name" ||
        question.id === "q_ef_name" ||
        question.id === "patient_name";

      if (typeof value === "string" && isNameQuestion && value.trim()) {
        setPatientName(value.trim());
      }

      if (autoAdvance) {
        triggerAutoAdvance();
      }
    },
    [question, triggerAutoAdvance],
  );

  const handleVoiceFinal = useCallback(
    (transcript: string) => {
      setVoiceIssue("");
      if (!question) return;

      if (question.type === "text" || question.id.includes("name")) {
        const cleaned = transcript.trim();
        updateAnswer(cleaned, false);
        setVoiceMappedLabel(cleaned);
        const isNameQuestion =
          question.id.toLowerCase().includes("name") ||
          question.id === "q_np_name" ||
          question.id === "q_ef_name" ||
          question.id === "patient_name";
        if (cleaned && isNameQuestion) {
          setPatientName(cleaned);
        }
        return;
      }

      if (question.type === "scale") {
        const parsed = parseScaleTranscript(transcript, language, question.max ?? 10);
        if (parsed === null) {
          setVoiceIssue(
            language === "id"
              ? "Sebutkan angka 0 sampai 10."
              : language === "zh"
                ? "请说0到10之间的数字。"
                : "Please say a number from 0 to 10.",
          );
          return;
        }
        updateAnswer(parsed, true);
        setVoiceMappedLabel(String(parsed));
        return;
      }

      const matches = matchOptionTranscript(question, transcript, language);
      if (matches.length >= 1 && matches[0]) {
        const chosen = matches[0];
        updateAnswer(chosen.value, true);
        setVoiceMappedLabel(chosen.label[language]);
      } else {
        setVoiceIssue(
          language === "id"
            ? `Ucapan "${transcript}" belum cocok. Silakan sentuh salah satu pilihan di bawah.`
            : `Could not match "${transcript}". Please tap an option below.`,
        );
      }
    },
    [language, question, updateAnswer],
  );

  const voice = useSpeechRecognition({
    locale: localeFor(language),
    onFinal: handleVoiceFinal,
    keepAlive: true,
  });

  // Persistent voice mode: automatically activate mic on each question
  useEffect(() => {
    voice.reset();
    setVoiceMappedLabel("");
    setVoiceIssue("");
    setJustSelected(null);

    if (voiceAuto) {
      if (voiceAutoStartTimerRef.current) clearTimeout(voiceAutoStartTimerRef.current);
      voiceAutoStartTimerRef.current = setTimeout(() => {
        try {
          voice.start();
        } catch {
          // ignore
        }
      }, 150);
    }

    return () => {
      if (voiceAutoStartTimerRef.current) clearTimeout(voiceAutoStartTimerRef.current);
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, [index, voiceAuto]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleVoiceMode = () => {
    if (!voice.supported) {
      setVoiceIssue(
        language === "id"
          ? "Fitur input suara tidak didukung di browser ini. Silakan gunakan Google Chrome atau Microsoft Edge."
          : language === "zh"
            ? "当前浏览器不支持语音输入，请使用 Chrome 或 Edge 浏览器。"
            : "Voice input is not supported on this browser. Please use Chrome or Edge.",
      );
      return;
    }

    const nextMode = !voiceAuto;
    setVoiceAuto(nextMode);
    setVoiceAutoMode(nextMode);
    if (nextMode) {
      setVoiceIssue("");
      voice.start();
    } else {
      voice.stop();
      voice.reset();
    }
  };

  const setLang = (next: Language) => {
    setLanguage(next);
    setStoredLanguage(next);
  };

  const goBack = () => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    voice.stop();
    if (index <= 0) {
      navigate({ to: "/intake", search: { form: activeForm.id } });
    } else {
      const prev = index - 1;
      setIndex(prev);
      setStoredQuestionIndex(prev);
    }
  };

  const goNextManual = () => {
    if (!isAnswered) return;
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    voice.stop();
    if (index >= activeForm.questions.length - 1) {
      navigate({ to: "/intake/complete", search: { form: activeForm.id } });
    } else {
      const next = index + 1;
      setIndex(next);
      setStoredQuestionIndex(next);
    }
  };

  const progressPercent = ((index + 1) / activeForm.questions.length) * 100;
  const stepNumber = String(index + 1).padStart(2, "0");
  const totalNumber = String(activeForm.questions.length).padStart(2, "0");

  if (!question) return null;

  return (
    <PatientShell
      language={language}
      onLanguage={setLang}
      onBack={goBack}
      progress={progressPercent}
      theme={activeForm.theme}
    >
      <div
        className="patient-card question-card sleek-question-card patient-enter"
        key={question.id}
      >
        {/* Top bar with Use Voice button */}
        <div className="sleek-q-header">
          <div />
          <button
            type="button"
            className={`sleek-voice-toggle ${voiceAuto && voice.supported ? "active" : ""} ${!voice.supported ? "opacity-60 cursor-not-allowed" : ""}`}
            onClick={toggleVoiceMode}
            disabled={!voice.supported}
            title={
              !voice.supported
                ? language === "id"
                  ? "Fitur suara tidak didukung di browser ini (Gunakan Chrome/Edge)"
                  : language === "zh"
                    ? "当前浏览器不支持语音功能（请使用Chrome/Edge）"
                    : "Voice input is not supported in this browser (Use Chrome/Edge)"
                : voiceAuto
                  ? language === "id"
                    ? "Mode Suara Aktif"
                    : language === "zh"
                      ? "语音模式已开启"
                      : "Voice Mode Active"
                  : language === "id"
                    ? "Aktifkan Mode Suara"
                    : language === "zh"
                      ? "开启语音模式"
                      : "Enable Voice Mode"
            }
          >
            {voiceAuto && voice.supported ? (
              <>
                <span className="sleek-live-dot" />
                <span>
                  {language === "id"
                    ? "Suara Aktif"
                    : language === "zh"
                      ? "语音开启"
                      : "Voice Active"}
                </span>
              </>
            ) : (
              <>
                <MicOff size={16} strokeWidth={2.3} />
                <span>
                  {!voice.supported
                    ? language === "id"
                      ? "Suara Tidak Didukung"
                      : language === "zh"
                        ? "不支持语音"
                        : "Voice Unsupported"
                    : language === "id"
                      ? "Pakai Suara"
                      : language === "zh"
                        ? "使用语音"
                        : "Use Voice"}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Clean, high-legibility prompt */}
        <div className="sleek-q-body">
          <h1 className="sleek-q-title">{question.prompt[language]}</h1>
          {question.helper && <p className="sleek-q-helper">{question.helper[language]}</p>}
        </div>

        {/* Subtle, sleek voice status line */}
        {voiceAuto && (
          <div className="sleek-voice-status" aria-live="polite">
            <Volume2 size={15} className="text-blue-500 animate-pulse" />
            <span className="sleek-voice-status-text">
              {voice.state === "listening"
                ? language === "id"
                  ? "Mendengarkan ucapan Anda..."
                  : language === "zh"
                    ? "正在聆听您的回答..."
                    : "Listening to your voice..."
                : voice.state === "recognized" || voiceMappedLabel
                  ? `"${voiceMappedLabel || voice.transcript}"`
                  : language === "id"
                    ? "Mikrofon aktif — siap mendengarkan"
                    : language === "zh"
                      ? "麦克风已开启 — 请随时作答"
                      : "Mic active — speak anytime"}
            </span>
          </div>
        )}

        {/* Question Options Input */}
        <SleekQuestionInput
          question={question}
          language={language}
          value={answer}
          justSelected={justSelected}
          onSelect={(val, autoAdvance) => updateAnswer(val, autoAdvance)}
          onSubmit={goNextManual}
        />

        {voiceIssue && (
          <div className="sleek-voice-issue">
            <Quote size={14} />
            <span>{voiceIssue}</span>
          </div>
        )}

        {/* Consent & Medical Data Privacy Box on Last Question */}
        {isLastQuestion && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs text-slate-700 leading-relaxed">
                {language === "id"
                  ? "Saya menyetujui pengumpulan dan pemrosesan data kesehatan ini untuk keperluan triase klinis & pendaftaran."
                  : language === "zh"
                    ? "我同意诊所收集并处理上述健康信息，用于就诊分流与登记。"
                    : "I agree to the collection and processing of this health information for clinical triage and registration."}
              </span>
            </label>

            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-xs text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
              >
                <ShieldCheck size={13} />
                <span>
                  {language === "id"
                    ? "Lihat Kebijakan Privasi & Retensi Medis →"
                    : language === "zh"
                      ? "查看医疗数据隐私与保存政策 →"
                      : "View Medical Privacy & Retention Policy →"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Action Button: Required on Last Question for Consent Confirmation, or for Text Questions */}
        {(question.type === "text" || isLastQuestion) && (
          <div className="sleek-text-action-wrap mt-4">
            <button
              type="button"
              className="sleek-primary-btn"
              disabled={(!isAnswered && !question.optional) || (isLastQuestion && !privacyConsent)}
              onClick={goNextManual}
            >
              <span>
                {isLastQuestion
                  ? language === "id"
                    ? "Selesai & Kirim"
                    : language === "zh"
                      ? "完成并提交"
                      : "Finish & Submit"
                  : language === "id"
                    ? "Lanjut"
                    : language === "zh"
                      ? "继续"
                      : "Continue"}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Privacy Policy & Retention Modal Dialog */}
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[85vh] text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0" />
                  <span>
                    {language === "id"
                      ? "Kebijakan Privasi & Retensi Data Medis"
                      : language === "zh"
                        ? "医疗数据隐私与留存政策"
                        : "Medical Data Privacy & Retention Policy"}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 leading-none"
                >
                  &times;
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <div>
                  <strong className="text-slate-800 block mb-1">
                    {language === "id"
                      ? "1. Enkripsi & Keamanan Data (Encryption at Rest)"
                      : language === "zh"
                        ? "1. 数据加密与安全存储"
                        : "1. Data Encryption & Security"}
                  </strong>
                  <p>
                    {language === "id"
                      ? "Semua data klinis dan jawaban yang Anda kirimkan dienkripsi dengan standar AES-256-GCM saat disimpan di database server kami."
                      : language === "zh"
                        ? "您提交的所有临床信息均采用行业标准 AES-256-GCM 进行端到端加密存储。"
                        : "All clinical answers you submit are encrypted at rest using AES-256-GCM industry standards."}
                  </p>
                </div>

                <div>
                  <strong className="text-slate-800 block mb-1">
                    {language === "id"
                      ? "2. Hak Akses Terbatas (Authorized Medical Access)"
                      : language === "zh"
                        ? "2. 严格的医护访问权限"
                        : "2. Authorized Access Only"}
                  </strong>
                  <p>
                    {language === "id"
                      ? "Hanya staf medis dan dokter yang berwenang di klinik yang dapat membaca rekam triase Anda melalui portal terotentikasi."
                      : language === "zh"
                        ? "仅限本诊所持证医护人员及授权管理员可查阅您的预检分诊记录。"
                        : "Only authorized medical staff and physicians at the clinic can access your triage record via secure authentication."}
                  </p>
                </div>

                <div>
                  <strong className="text-slate-800 block mb-1">
                    {language === "id"
                      ? "3. Retensi & Privasi Perangkat Bersama"
                      : language === "zh"
                        ? "3. 共享设备数据即时清除"
                        : "3. Retention & Device Isolation"}
                  </strong>
                  <p>
                    {language === "id"
                      ? "Data sementara di browser langsung dihapus otomatis setelah pengiriman selesai untuk menjaga kerahasiaan saat menggunakan tablet/kiosk klinik bersama."
                      : language === "zh"
                        ? "提交完成后，本地浏览器缓存将立即自动彻底销毁，确保在诊所公用设备上无信息残留。"
                        : "Draft responses are purged from local browser memory immediately upon submission to ensure complete privacy on shared clinic devices."}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition text-xs"
                >
                  {language === "id"
                    ? "Saya Mengerti"
                    : language === "zh"
                      ? "我知道了"
                      : "I Understand"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PatientShell>
  );
}

function SleekQuestionInput({
  question,
  language,
  value,
  justSelected,
  onSelect,
  onSubmit,
}: {
  question: Question;
  language: Language;
  value: string | number | undefined;
  justSelected: string | number | null;
  onSelect: (val: string | number, autoAdvance: boolean) => void;
  onSubmit?: () => void;
}) {
  if (question.type === "choice" || question.type === "yesno") {
    return (
      <div className="sleek-options-stack">
        {question.options?.map((option, idx) => {
          const isSelected = value === option.value;
          const isFadingNext = justSelected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={`sleek-option-card ${isSelected ? "selected" : ""} ${isFadingNext ? "just-answered" : ""}`}
              onClick={() => onSelect(option.value, true)}
            >
              <span className="sleek-option-tag">{String.fromCharCode(65 + idx)}</span>
              <span className="sleek-option-text">{option.label[language]}</span>
              {isSelected && (
                <span className="sleek-check-icon">
                  <Check size={18} strokeWidth={2.8} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "scale") {
    const max = question.max ?? 10;
    const numeric = typeof value === "number" ? value : 5;

    return (
      <div className="sleek-scale-container">
        {/* Clean Rating Header */}
        <div className="sleek-scale-hero">
          <span className="sleek-scale-big-num">{numeric}</span>
          <span className="sleek-scale-badge">
            {numeric === 0
              ? language === "id"
                ? "Tidak Nyeri"
                : language === "zh"
                  ? "无痛"
                  : "No Pain"
              : numeric >= 8
                ? language === "id"
                  ? "Nyeri Berat"
                  : language === "zh"
                    ? "重度疼痛"
                    : "Severe Pain"
                : language === "id"
                  ? "Nyeri Sedang"
                  : language === "zh"
                    ? "中度疼痛"
                    : "Moderate Pain"}
          </span>
        </div>

        {/* 1-Tap Sleek Number Grid */}
        <div className="sleek-scale-grid">
          {Array.from({ length: max + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`sleek-scale-btn ${numeric === i ? "active" : ""} ${justSelected === i ? "just-answered" : ""}`}
              onClick={() => onSelect(i, true)}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="sleek-scale-endpoints">
          <span>
            {language === "id" ? "0 = Bebas Nyeri" : language === "zh" ? "0 = 无痛" : "0 = No pain"}
          </span>
          <span>
            {language === "id"
              ? "10 = Sangat Sakit"
              : language === "zh"
                ? "10 = 最严重疼痛"
                : "10 = Worst pain"}
          </span>
        </div>
      </div>
    );
  }

  // Text input with Form wrapper and Enter key handler
  return (
    <form
      className="sleek-text-container"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <input
        type="text"
        className="sleek-input-field"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onSelect(e.target.value, false)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit?.();
          }
        }}
        placeholder={
          language === "id"
            ? "Ketik jawaban atau sebutkan lewat suara…"
            : language === "zh"
              ? "输入内容或直接语音作答…"
              : "Type answer or speak aloud…"
        }
        autoFocus
      />
    </form>
  );
}
