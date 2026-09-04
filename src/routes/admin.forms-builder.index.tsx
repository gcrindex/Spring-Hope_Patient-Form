import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  Copy,
  GripVertical,
  Mic,
  MoreHorizontal,
  Plus,
  Save,
  Send,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminShell } from "../components/admin-shell";
import { kneePainForm, getStoredLanguage, onLanguageChange, type Language, type Question, type QuestionType } from "../lib/patientform";
import type { AIDraftForm } from "../lib/ai-draft";
import { AdminAuthGuard } from "../components/admin-auth-guard";

export const Route = createFileRoute("/admin/forms-builder/")({
  head: () => ({ meta: [{ title: "Form Builder — Spring Hope" }] }),
  component: () => (
    <AdminAuthGuard>
      <FormsBuilder />
    </AdminAuthGuard>
  ),
});

const typeLabels: Record<QuestionType, string> = {
  choice: "Multiple choice",
  yesno: "Yes / No",
  scale: "0–10 scale",
  text: "Free text",
};

function FormsBuilder() {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [formTitle, setFormTitle] = useState(() => kneePainForm.title[getStoredLanguage()] ?? kneePainForm.title.en);
  const [questions, setQuestions] = useState<Question[]>(kneePainForm.questions);
  const [selectedId, setSelectedId] = useState(questions[0]?.id ?? "");
  const selected = questions.find((question) => question.id === selectedId) ?? questions[0];
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    return onLanguageChange((l) => {
      setLanguage(l);
      setFormTitle(kneePainForm.title[l] ?? kneePainForm.title.en);
    });
  }, []);

  useEffect(() => {
    const raw = window.sessionStorage.getItem("pf_ai_form_draft");
    if (!raw) return;
    try {
      const draft = JSON.parse(raw) as AIDraftForm;
      if (!draft?.questions?.length) return;
      setFormTitle(draft.title.en);
      setQuestions(draft.questions as Question[]);
      setSelectedId(draft.questions[0].id);
      window.sessionStorage.removeItem("pf_ai_form_draft");
    } catch {
      window.sessionStorage.removeItem("pf_ai_form_draft");
    }
  }, []);

  const changePrompt = (value: string) =>
    setQuestions((current) =>
      current.map((question) =>
        question.id === selected.id
          ? { ...question, prompt: { ...question.prompt, en: value } }
          : question,
      ),
    );
  const addQuestion = () => {
    const id = `q_custom_${Date.now()}`;
    const question: Question = {
      id,
      type: "text",
      prompt: { en: "New question", id: "Pertanyaan baru", zh: "新问题" },
      optional: true,
    };
    setQuestions((current) => [...current, question]);
    setSelectedId(id);
  };
  const remove = (id: string) => {
    const next = questions.filter((question) => question.id !== id);
    setQuestions(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? "");
  };

  return (
    <AdminShell
      title={formTitle}
      eyebrow="Forms / Builder"
      activeNav="forms"
      actions={
        <>
          <button
            type="button"
            className="admin-soft-button"
            onClick={() => {
              setSaved(true);
              window.setTimeout(() => setSaved(false), 1400);
            }}
          >
            {saved ? <Check size={16} /> : <Save size={16} />} {saved ? "Saved" : "Save draft"}
          </button>
          <Link to="/admin/forms-builder/publish" className="admin-primary-button">
            <Send size={16} /> Publish
          </Link>
        </>
      }
    >
      <div className="builder-meta-row">
        <div>
          <span className="status-dot-pill">
            <i /> Published
          </span>
          <span>Last updated just now</span>
        </div>
        <div>
          <Mic size={15} />
          <span>Voice answering enabled</span>
        </div>
      </div>

      <div className="builder-layout">
        <section className="builder-question-list">
          <div className="builder-list-head">
            <div>
              <span className="panel-kicker">Assessment structure</span>
              <h2>{questions.length} questions</h2>
            </div>
            <button type="button" className="admin-icon-button">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="question-list-scroll">
            {questions.map((question, index) => (
              <button
                type="button"
                key={question.id}
                className={`builder-question-row ${selected?.id === question.id ? "active" : ""}`}
                onClick={() => setSelectedId(question.id)}
              >
                <GripVertical size={16} className="drag-handle" />
                <span className="question-index">{index + 1}</span>
                <div className="min-w-0 flex-1 text-left">
                  <strong>{question.prompt.en}</strong>
                  <small>
                    {typeLabels[question.type]}
                    {question.optional ? " · Optional" : ""}
                  </small>
                </div>
                <ChevronDown size={15} className="rotate-[-90deg]" />
              </button>
            ))}
          </div>
          <button type="button" className="builder-add-question" onClick={addQuestion}>
            <Plus size={17} /> Add question
          </button>
        </section>

        {selected && (
          <section className="builder-editor">
            <div className="builder-editor-head">
              <div>
                <span className="panel-kicker">Question settings</span>
                <h2>Edit question</h2>
              </div>
              <div className="flex items-center gap-1">
                <button className="admin-icon-button" type="button">
                  <Copy size={16} />
                </button>
                <button
                  className="admin-icon-button admin-icon-danger"
                  type="button"
                  onClick={() => remove(selected.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <label className="builder-field">
              <span>Question</span>
              <textarea
                rows={3}
                value={selected.prompt.en}
                onChange={(event) => changePrompt(event.target.value)}
              />
            </label>
            <div className="builder-field-grid">
              <label className="builder-field">
                <span>Question type</span>
                <div className="builder-select">
                  {typeLabels[selected.type]} <ChevronDown size={15} />
                </div>
              </label>
              <label className="builder-field">
                <span>Required</span>
                <div className="builder-toggle-row">
                  <button
                    type="button"
                    className={`builder-switch ${!selected.optional ? "on" : ""}`}
                  >
                    <span />
                  </button>
                  <small>{selected.optional ? "Optional" : "Required"}</small>
                </div>
              </label>
            </div>
            {(selected.type === "choice" || selected.type === "yesno") && (
              <div className="builder-options">
                <div className="builder-field-title">
                  <span>Answer options</span>
                  <small>Score</small>
                </div>
                {selected.options?.map((option, index) => (
                  <div className="builder-option-row" key={option.value}>
                    <span className="builder-option-letter">{String.fromCharCode(65 + index)}</span>
                    <input value={option.label.en} readOnly />
                    <input className="score-input" value={option.score} readOnly />
                  </div>
                ))}
              </div>
            )}
            {selected.type === "scale" && (
              <div className="builder-scale-config">
                <div>
                  <span>Minimum</span>
                  <strong>0</strong>
                </div>
                <div>
                  <span>Maximum</span>
                  <strong>{selected.max ?? 10}</strong>
                </div>
                <div>
                  <span>Scoring</span>
                  <strong>Value × 3</strong>
                </div>
              </div>
            )}
            <div className="builder-voice-setting">
              <div className="voice-settings-icon">
                <Mic size={18} />
              </div>
              <div className="flex-1">
                <strong>Voice answering</strong>
                <p>Patients can speak this answer. The transcript is shown before continuing.</p>
              </div>
              <button type="button" className="builder-switch on">
                <span />
              </button>
            </div>
          </section>
        )}

        <aside className="builder-preview">
          <div className="builder-preview-head">
            <div>
              <span className="panel-kicker">Live preview</span>
              <h2>Patient view</h2>
            </div>
            <Smartphone size={18} />
          </div>
          <div className="builder-phone">
            <div className="builder-phone-island" />
            <div className="builder-phone-content">
              <div className="preview-logo">
                <span /> Spring Hope <small>EN</small>
              </div>
              <div className="preview-progress">
                <i
                  style={{
                    width: `${Math.max(14, ((questions.findIndex((q) => q.id === selected?.id) + 1) / questions.length) * 100)}%`,
                  }}
                />
              </div>
              <span className="preview-kicker">
                QUESTION {questions.findIndex((q) => q.id === selected?.id) + 1} OF{" "}
                {questions.length}
              </span>
              <h3>{selected?.prompt.en}</h3>
              {selected?.helper && <p>{selected.helper.en}</p>}
              <PreviewInput question={selected} />
              <div className="preview-voice">
                <Mic size={15} />
                <span>Answer by voice</span>
              </div>
              <button>Continue</button>
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}

function PreviewInput({ question }: { question: Question }) {
  if (question.type === "choice" || question.type === "yesno")
    return (
      <div className="preview-options">
        {question.options?.slice(0, 4).map((option, index) => (
          <div key={option.value} className={index === 0 ? "selected" : ""}>
            <i>{index === 0 ? <Check size={10} /> : String.fromCharCode(65 + index)}</i>
            <span>{option.label.en}</span>
          </div>
        ))}
      </div>
    );
  if (question.type === "scale")
    return (
      <div className="preview-scale">
        <strong>5</strong>
        <div>
          <span />
        </div>
        <small>
          <span>No pain</span>
          <span>Worst</span>
        </small>
      </div>
    );
  return <div className="preview-textarea">Type or dictate your answer…</div>;
}
