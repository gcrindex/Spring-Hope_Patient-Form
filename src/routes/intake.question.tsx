import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
  Mic,
  MicOff,
  Minus,
  Plus,
  Quote,
  Sparkles,
  Volume2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import { VoiceControl } from "../components/voice-control";
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
      { title: "Pertanyaan — Formulir Terpandu" },
      {
        name: "description",
        content: "Formulir interaktif ramah lansia dengan pengenalan suara dan auto-advance.",
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
  const isSeniorForm = activeForm.id === newPatientForm.id;

  useEffect(() => {
    if (formParam) setActiveFormId(formParam);
    setLanguage(getStoredLanguage());
    setIndex((prev) => Math.min(prev, activeForm.questions.length - 1));
    setAnswers(getStoredAnswers());
  }, [formParam, activeForm]);

  const answer = answers[question?.id];
  const isAnswered = question?.optional || (answer !== undefined && answer !== "");

  // Auto next transition with gentle delay so seniors see feedback
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
    }, 700);
  }, [index, activeForm.questions.length, navigate, activeForm.id]);

  const updateAnswer = useCallback(
    (value: string | number, autoAdvance = true) => {
      // Clear any pending advance timer so user can change answer freely
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

      // If user inputs/speaks a name, immediately save it to patientName storage
      if (typeof value === "string" && (question.id.includes("name") || question.type === "text")) {
        if (value.trim()) {
          setPatientName(value.trim());
        }
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
              ? "Sebutkan angka antara 0 sampai 10."
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
            ? `Jawaban "${transcript}" belum cocok. Silakan sentuh salah satu pilihan.`
            : `Could not match "${transcript}". Please tap an option on screen.`,
        );
      }
    },
    [language, question, updateAnswer],
  );

  const voice = useSpeechRecognition({
    locale: localeFor(language),
    onFinal: handleVoiceFinal,
  });

  // Persistent voice mode: automatically activate mic on next question if voiceAuto is true
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
          // ignore already started
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
  const progressLabel = `${t.questionOf} ${index + 1} / ${activeForm.questions.length}`;

  if (!question) return null;

  return (
    <PatientShell
      language={language}
      onLanguage={setLang}
      onBack={goBack}
      progress={progressPercent}
      stepLabel={progressLabel}
    >
      <div className="question-card senior-question-card patient-enter" key={question.id}>
        {/* Top bar with voice mode switch */}
        <div className="senior-top-bar">
          <span className="senior-q-counter">
            {language === "id"
              ? `Pertanyaan ${index + 1} dari ${activeForm.questions.length}`
              : `Question ${index + 1} of ${activeForm.questions.length}`}
          </span>
          <button
            type="button"
            className={`voice-mode-toggle-pill ${voiceAuto ? "active" : ""}`}
            onClick={toggleVoiceMode}
            title={voiceAuto ? "Mode Suara Aktif (Klik untuk matikan)" : "Aktifkan Mode Suara"}
          >
            {voiceAuto ? <Mic size={14} /> : <MicOff size={14} />}
            <span>
              {voiceAuto
                ? language === "id"
                  ? "Suara Aktif"
                  : "Voice On"
                : language === "id"
                  ? "Pakai Suara"
                  : "Use Voice"}
            </span>
          </button>
        </div>

        {/* Big high-contrast prompt */}
        <h1 className="senior-question-title">{question.prompt[language]}</h1>

        {question.helper && <p className="senior-question-helper">{question.helper[language]}</p>}

        {/* Persistent Voice Live Feedback Bar */}
        {voiceAuto && (
          <div className="voice-persistent-banner">
            <div className="voice-orb-mini">
              <Volume2 size={18} className="animate-pulse text-blue-600" />
            </div>
            <div className="text-left flex-1">
              <strong className="text-sm text-blue-900 block">
                {voice.state === "listening"
                  ? language === "id"
                    ? "Mendengarkan... Katakan jawaban Anda"
                    : "Listening... Speak your answer"
                  : voice.state === "recognized"
                    ? language === "id"
                      ? `Mendengar: "${voiceMappedLabel || voice.transcript}"`
                      : `Heard: "${voiceMappedLabel || voice.transcript}"`
                    : language === "id"
                      ? "Mode Suara Aktif — Siap mendengarkan"
                      : "Voice mode active — Ready"}
              </strong>
              <small className="text-xs text-blue-700">
                {language === "id"
                  ? "Setelah terjawab langsung lanjut otomatis"
                  : "Automatically advances once answered"}
              </small>
            </div>
            <button
              type="button"
              className="text-xs text-blue-800 underline font-semibold px-2 py-1"
              onClick={toggleVoiceMode}
            >
              {language === "id" ? "Beralih ke Sentuh" : "Touch only"}
            </button>
          </div>
        )}

        {/* Question Input Choices with Giant Targets */}
        <SeniorQuestionInput
          question={question}
          language={language}
          value={answer}
          justSelected={justSelected}
          onSelect={(val, autoAdvance) => updateAnswer(val, autoAdvance)}
        />

        {/* Regular Voice Control widget if voice auto is off */}
        {!voiceAuto && (
          <div className="question-voice-section mt-5">
            <VoiceControl
              language={language}
              state={voice.state}
              transcript={voice.transcript}
              error={voice.error}
              onStart={() => {
                setVoiceIssue("");
                setVoiceAuto(true);
                setVoiceAutoMode(true);
                voice.start();
              }}
              onStop={voice.stop}
              onReset={() => {
                setVoiceIssue("");
                setVoiceMappedLabel("");
                voice.reset();
              }}
              recognizedLabel={voiceMappedLabel}
            />
          </div>
        )}

        {voiceIssue && (
          <div className="voice-clarify">
            <Quote size={15} />
            <span>{voiceIssue}</span>
          </div>
        )}

        {/* Manual Advance button if needed (e.g. text input or skip optional) */}
        {(question.type === "text" || question.optional || !isSeniorForm) && (
          <div className="question-actions mt-6">
            <button
              type="button"
              className="patient-primary-action"
              disabled={!isAnswered && !question.optional}
              onClick={goNextManual}
            >
              {index === activeForm.questions.length - 1
                ? language === "id"
                  ? "Selesai & Kirim Formulir"
                  : "Finish & Submit"
                : language === "id"
                  ? "Lanjut ke Pertanyaan Berikutnya"
                  : "Continue to Next"}
              <ChevronRight size={19} />
            </button>
          </div>
        )}
      </div>
    </PatientShell>
  );
}

function SeniorQuestionInput({
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
      <div className="senior-options-grid">
        {question.options?.map((option, idx) => {
          const isSelected = value === option.value;
          const isFadingNext = justSelected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={`senior-option-btn ${isSelected ? "selected" : ""} ${isFadingNext ? "just-answered" : ""}`}
              onClick={() => onSelect(option.value, true)}
            >
              <div className="senior-option-bullet">
                {isSelected ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <span>{String.fromCharCode(65 + idx)}</span>
                )}
              </div>
              <span className="senior-option-label">{option.label[language]}</span>
              {isSelected && (
                <span className="senior-auto-check">
                  <Check size={18} />
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
      <div className="senior-scale-box">
        <div className="senior-scale-number-display">
          <span className="scale-num-val">{numeric}</span>
          <span className="scale-num-label">
            {numeric === 0
              ? language === "id"
                ? "Tidak Nyeri"
                : "No Pain"
              : numeric >= 8
                ? language === "id"
                  ? "Nyeri Sangat Berat"
                  : "Severe Pain"
                : language === "id"
                  ? "Tingkat Nyeri Sedang"
                  : "Moderate Pain"}
          </span>
        </div>

        {/* Quick Grid for 1-tap auto advance */}
        <div className="scale-senior-grid">
          {Array.from({ length: max + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`scale-senior-num-btn ${numeric === i ? "selected" : ""} ${justSelected === i ? "just-answered" : ""}`}
              onClick={() => onSelect(i, true)}
            >
              {i}
            </button>
          ))}
        </div>

        <div className="scale-label-row mt-3">
          <span>{language === "id" ? "0 = Bebas Nyeri" : "0 = No pain"}</span>
          <span>{language === "id" ? "10 = Sangat Sakit" : "10 = Worst pain"}</span>
        </div>
      </div>
    );
  }

  // Text input for Senior
  return (
    <div className="senior-text-box">
      <input
        type="text"
        className="senior-text-input"
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onSelect(e.target.value, false)}
        placeholder={
          language === "id"
            ? "Ketik nama atau sebutkan lewat mikrofon…"
            : "Type name or speak into microphone…"
        }
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSelect((value as string) || "", true);
          }
        }}
      />
      <p className="text-xs text-muted mt-2">
        {language === "id"
          ? "Tekan tombol mikrofon di atas untuk mendikte nama Anda secara otomatis."
          : "You can also tap the microphone above to speak your name."}
      </p>
    </div>
  );
}
