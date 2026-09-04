import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, ChevronRight, Minus, Plus, Quote } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import { VoiceControl } from "../components/voice-control";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import {
  copy,
  getStoredAnswers,
  getStoredLanguage,
  getStoredQuestionIndex,
  kneePainForm,
  localeFor,
  matchOptionTranscript,
  parseScaleTranscript,
  setStoredAnswers,
  setStoredLanguage,
  setStoredQuestionIndex,
  type Answers,
  type Language,
  type Question,
} from "../lib/patientform";

export const Route = createFileRoute("/intake/question")({
  head: () => ({
    meta: [
      { title: "Assessment — Spring Hope" },
      {
        name: "description",
        content: "Complete your knee pain assessment one question at a time.",
      },
    ],
  }),
  component: QuestionPage,
});

function QuestionPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [index, setIndex] = useState(() => Math.min(getStoredQuestionIndex(), kneePainForm.questions.length - 1));
  const [answers, setAnswers] = useState<Answers>(() => getStoredAnswers());
  const [voiceMappedLabel, setVoiceMappedLabel] = useState("");
  const [voiceIssue, setVoiceIssue] = useState("");
  const question = kneePainForm.questions[index];
  const t = copy[language];

  useEffect(() => {
    setLanguage(getStoredLanguage());
    setIndex(Math.min(getStoredQuestionIndex(), kneePainForm.questions.length - 1));
    setAnswers(getStoredAnswers());
  }, []);

  const answer = answers[question.id];
  const isAnswered = question.optional || (answer !== undefined && answer !== "");

  const updateAnswer = useCallback(
    (value: string | number) => {
      setVoiceIssue("");
      setAnswers((current) => {
        const next = { ...current, [question.id]: value };
        setStoredAnswers(next);
        return next;
      });
    },
    [question.id],
  );

  const handleVoiceFinal = useCallback(
    (transcript: string) => {
      setVoiceIssue("");
      if (question.type === "text") {
        const existing =
          typeof answers[question.id] === "string" ? String(answers[question.id]) : "";
        const next = [existing, transcript]
          .filter(Boolean)
          .join(existing ? " " : "")
          .slice(0, 500);
        updateAnswer(next);
        setVoiceMappedLabel(next);
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
        updateAnswer(parsed);
        setVoiceMappedLabel(String(parsed));
        return;
      }
      const matches = matchOptionTranscript(question, transcript, language);
      if (matches.length === 1) {
        updateAnswer(matches[0].value);
        setVoiceMappedLabel(matches[0].label[language]);
      } else {
        setVoiceIssue(
          language === "id"
            ? "Jawaban tidak sesuai pilihan. Silakan pilih dari opsi di atas."
            : language === "zh"
              ? "答案不在选项中，请从上方选择。"
              : "Answer not in the options. Please choose from the options above.",
        );
      }
    },
    [answers, language, question, updateAnswer],
  );

  const voice = useSpeechRecognition({ locale: localeFor(language), onFinal: handleVoiceFinal });

  useEffect(() => {
    voice.reset();
    setVoiceMappedLabel("");
    setVoiceIssue("");
  }, [index, language]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLang = (next: Language) => {
    setLanguage(next);
    setStoredLanguage(next);
  };

  const goBack = () => {
    if (index <= 0) navigate({ to: "/intake" });
    else {
      const next = index - 1;
      setIndex(next);
      setStoredQuestionIndex(next);
    }
  };

  const goNext = () => {
    if (!isAnswered) return;
    voice.reset();
    if (index >= kneePainForm.questions.length - 1) {
      navigate({ to: "/intake/complete" });
      return;
    }
    const next = index + 1;
    setIndex(next);
    setStoredQuestionIndex(next);
  };

  const selectedLabel = useMemo(() => {
    if (question.type === "scale") return answer !== undefined ? String(answer) : "";
    if (question.type === "text") return typeof answer === "string" ? answer : "";
    return question.options?.find((item) => item.value === answer)?.label[language] ?? "";
  }, [answer, language, question]);

  return (
    <PatientShell
      language={language}
      onLanguage={setLang}
      onBack={goBack}
      progress={((index + 1) / kneePainForm.questions.length) * 100}
      stepLabel={`${t.questionOf} ${index + 1} / ${kneePainForm.questions.length}`}
    >
      <div className="question-card patient-enter" key={question.id}>
        <div className="question-topline">
          <span>
            {question.type === "text" && question.optional ? t.optional : "Knee Pain Assessment"}
          </span>
          {selectedLabel && question.type !== "text" && (
            <span className="answer-saved">
              <Check size={13} />{" "}
              {language === "id" ? "Tersimpan" : language === "zh" ? "已记录" : "Saved"}
            </span>
          )}
        </div>
        <h1>{question.prompt[language]}</h1>
        {question.helper && <p className="question-helper">{question.helper[language]}</p>}

        <QuestionInput
          question={question}
          language={language}
          value={answer}
          onChange={updateAnswer}
        />

        <div className="question-voice-section">
          <VoiceControl
            language={language}
            state={voice.state}
            transcript={voice.transcript}
            error={voice.error}
            onStart={() => {
              setVoiceIssue("");
              voice.start();
            }}
            onStop={voice.stop}
            onReset={() => {
              setVoiceIssue("");
              setVoiceMappedLabel("");
              voice.reset();
            }}
            recognizedLabel={voiceMappedLabel || selectedLabel}
          />
          {voiceIssue && (
            <div className="voice-clarify">
              <Quote size={15} />
              <span>{voiceIssue}</span>
            </div>
          )}
        </div>

        <div className="question-actions">
          <button
            type="button"
            className="patient-primary-action"
            disabled={!isAnswered}
            onClick={goNext}
          >
            {index === kneePainForm.questions.length - 1
              ? language === "id"
                ? "Selesaikan"
                : language === "zh"
                  ? "完成评估"
                  : "Finish assessment"
              : t.continue}
            <ChevronRight size={19} />
          </button>
        </div>
      </div>
    </PatientShell>
  );
}

function QuestionInput({
  question,
  language,
  value,
  onChange,
}: {
  question: Question;
  language: Language;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
}) {
  if (question.type === "choice" || question.type === "yesno") {
    return (
      <div className={`answer-options ${question.type === "yesno" ? "answer-options-yesno" : ""}`}>
        {question.options?.map((option, optionIndex) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              className={`answer-option ${selected ? "selected" : ""}`}
              onClick={() => onChange(option.value)}
            >
              <span className="answer-option-key">
                {selected ? (
                  <Check size={16} />
                ) : question.type === "yesno" ? (
                  option.value === "yes" ? (
                    "Y"
                  ) : (
                    "N"
                  )
                ) : (
                  String.fromCharCode(65 + optionIndex)
                )}
              </span>
              <span>{option.label[language]}</span>
              {selected && <span className="ml-auto text-xs font-bold text-brand">✓</span>}
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
      <div className="scale-control">
        <div className="scale-value-row">
          <button
            type="button"
            className="scale-stepper"
            onClick={() => onChange(Math.max(0, numeric - 1))}
          >
            <Minus size={18} />
          </button>
          <div className="scale-value">
            <strong>{numeric}</strong>
            <span>/ {max}</span>
          </div>
          <button
            type="button"
            className="scale-stepper"
            onClick={() => onChange(Math.min(max, numeric + 1))}
          >
            <Plus size={18} />
          </button>
        </div>
        <input
          aria-label="Pain level"
          type="range"
          min={0}
          max={max}
          step={1}
          value={numeric}
          onChange={(event) => onChange(Number(event.target.value))}
          className="clinical-range"
          style={{ "--range-progress": `${(numeric / max) * 100}%` } as React.CSSProperties}
        />
        <div className="scale-label-row">
          <span>
            {language === "id" ? "Tidak nyeri" : language === "zh" ? "无疼痛" : "No pain"}
          </span>
          <span>
            {language === "id" ? "Nyeri terberat" : language === "zh" ? "最严重" : "Worst pain"}
          </span>
        </div>
        <div className="scale-quick-grid">
          {Array.from({ length: 11 }, (_, index) => (
            <button
              key={index}
              type="button"
              className={numeric === index ? "selected" : ""}
              onClick={() => onChange(index)}
            >
              {index}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-answer-wrap">
      <textarea
        rows={5}
        maxLength={500}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={
          language === "id"
            ? "Ketik catatan Anda di sini…"
            : language === "zh"
              ? "在此输入您的备注…"
              : "Type your note here…"
        }
      />
      <span>{typeof value === "string" ? value.length : 0} / 500</span>
    </div>
  );
}
