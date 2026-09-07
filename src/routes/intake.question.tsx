import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Mic, MicOff, Quote, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import {
  copy,
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
    form: (search.form as string) || undefined,
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
  const activeForm = useMemo(() => {
    const fId = formParam || getActiveFormId();
    return getFormById(fId);
  }, [formParam]);

  const [index, setIndex] = useState(() => {
    const stored = getStoredQuestionIndex();
    return Math.min(stored, Math.max(0, activeForm.questions.length - 1));
  });

  const [answers, setAnswers] = useState<Answers>(() => getStoredAnswers());
  const [voiceMappedLabel, setVoiceMappedLabel] = useState("");
  const [voiceIssue, setVoiceIssue] = useState("");
  const [voiceAuto, setVoiceAuto] = useState(() => isVoiceAutoMode());
  const [justSelected, setJustSelected] = useState<string | number | null>(null);

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceAutoStartTimerRef = useRef<NodeJS.Timeout | null>(null);

  const question = activeForm.questions[index] ?? activeForm.questions[0];
  const t = copy[language];

  useEffect(() => {
    if (formParam) setActiveFormId(formParam);
    setLanguage(getStoredLanguage());
    setIndex((prev) => Math.min(prev, activeForm.questions.length - 1));
    setAnswers(getStoredAnswers());
  }, [formParam, activeForm]);

  const answer = answers[question?.id];
  const isAnswered = question?.optional || (answer !== undefined && answer !== "");

  // Smooth auto-advance transition
  const triggerAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);

    autoAdvanceTimerRef.current = setTimeout(() => {
      setJustSelected(null);
      if (index >= activeForm.questions.length - 1) {
        navigate({ to: "/intake/complete", search: { form: activeForm.id } });
      } else {
        const next = index + 1;
        setIndex(next);
        setStoredQuestionIndex(next);
        setVoiceMappedLabel("");
        setVoiceIssue("");
      }
    }, 650);
  }, [index, activeForm.questions.length, navigate, activeForm.id]);

  const updateAnswer = useCallback(
    (value: string | number, autoAdvance = true) => {
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

      if (
        typeof value === "string" &&
        (question.id.includes("name") || question.type === "text") &&
        value.trim()
      ) {
        setPatientName(value.trim());
      }

      if (autoAdvance) {
        triggerAutoAdvance();
      }
    },
    [question?.id, question?.type, triggerAutoAdvance],
  );

  const handleVoiceFinal = useCallback(
    (transcript: string) => {
      setVoiceIssue("");
      if (!question) return;

      if (question.type === "text" || question.id.includes("name")) {
        const cleaned = transcript.trim();
        updateAnswer(cleaned, false);
        setVoiceMappedLabel(cleaned);
        if (cleaned) {
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
      if (matches.length >= 1) {
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
            className={`sleek-voice-toggle ${voiceAuto ? "active" : ""}`}
            onClick={toggleVoiceMode}
            title={voiceAuto ? (language === "id" ? "Mode Suara Aktif" : language === "zh" ? "语音模式已开启" : "Voice Mode Active") : (language === "id" ? "Aktifkan Mode Suara" : language === "zh" ? "开启语音模式" : "Enable Voice Mode")}
          >
            {voiceAuto ? (
              <>
                <span className="sleek-live-dot" />
                <span>{language === "id" ? "Suara Aktif" : language === "zh" ? "语音开启" : "Voice Active"}</span>
              </>
            ) : (
              <>
                <MicOff size={16} strokeWidth={2.3} />
                <span>{language === "id" ? "Pakai Suara" : language === "zh" ? "使用语音" : "Use Voice"}</span>
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
        />

        {voiceIssue && (
          <div className="sleek-voice-issue">
            <Quote size={14} />
            <span>{voiceIssue}</span>
          </div>
        )}

        {/* Only show manual advance button for free-text inputs */}
        {question.type === "text" && (
          <div className="sleek-text-action-wrap">
            <button
              type="button"
              className="sleek-primary-btn"
              disabled={!isAnswered && !question.optional}
              onClick={goNextManual}
            >
              <span>
                {index === activeForm.questions.length - 1
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
}: {
  question: Question;
  language: Language;
  value: string | number | undefined;
  justSelected: string | number | null;
  onSelect: (val: string | number, autoAdvance: boolean) => void;
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
          <span>{language === "id" ? "0 = Bebas Nyeri" : language === "zh" ? "0 = 无痛" : "0 = No pain"}</span>
          <span>{language === "id" ? "10 = Sangat Sakit" : language === "zh" ? "10 = 最严重疼痛" : "10 = Worst pain"}</span>
        </div>
      </div>
    );
  }

  // Text input
  return (
    <div className="sleek-text-container">
      <input
        type="text"
        className="sleek-input-field"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onSelect(e.target.value, false)}
        placeholder={
          language === "id" ? "Ketik jawaban atau sebutkan lewat suara…" : language === "zh" ? "输入内容或直接语音作答…" : "Type answer or speak aloud…"
        }
        autoFocus
      />
    </div>
  );
}
