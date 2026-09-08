import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Bot,
  Check,
  FileText,
  LoaderCircle,
  Mic,
  ScanLine,
  Send,
  Sparkles,
  Upload,
  WandSparkles,
  Wrench,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { AdminShell } from "../components/admin-shell";
import { AdminAuthGuard } from "../components/admin-auth-guard";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import type { AIDraftForm } from "../lib/ai-draft";

export const Route = createFileRoute("/admin/new")({
  head: () => ({ meta: [{ title: "Create New Form — Spring Hope" }] }),
  component: () => (
    <AdminAuthGuard>
      <CreateNewForm />
    </AdminAuthGuard>
  ),
});

type Mode = "chooser" | "ai" | "pdf" | "scan";

function CreateNewForm() {
  const [mode, setMode] = useState<Mode>("chooser");

  if (mode === "ai") return <AICard onBack={() => setMode("chooser")} />;
  if (mode === "pdf") return <PDFCard onBack={() => setMode("chooser")} />;
  if (mode === "scan") return <ScanCard onBack={() => setMode("chooser")} />;

  return <Chooser onPick={setMode} />;
}

/* ── Chooser Grid ──────────────────────────────────────── */
function Chooser({ onPick }: { onPick: (m: Mode) => void }) {
  return (
    <AdminShell
      title="Create New Form"
      eyebrow="Forms / New"
      activeNav="forms"
      actions={
        <Link to="/admin" className="admin-soft-button">
          ← Back to dashboard
        </Link>
      }
    >
      <section className="new-form-hero">
        <div>
          <span className="panel-kicker">Choose a starting point</span>
          <h2>Build the assessment your way.</h2>
          <p>
            Voice is an input method inside the experience — not a separate form type. Patients can
            speak answers on supported questions, and staff can speak prompts inside AI-Assisted.
          </p>
        </div>
        <div className="new-form-voice-note">
          <Mic size={18} />
          <div>
            <strong>Voice-ready by design</strong>
            <span>Manual fallback always remains available.</span>
          </div>
        </div>
      </section>

      <section className="new-form-grid">
        <button
          type="button"
          className="creation-mode-card creation-mode-ai"
          onClick={() => onPick("ai")}
        >
          <div className="creation-mode-head">
            <span className="creation-mode-icon">
              <Bot size={24} />
            </span>
            <span className="creation-mode-badge">PesatRouter</span>
          </div>
          <h3>AI-Assisted</h3>
          <p>
            Describe the assessment in chat or speak your prompt. AI prepares a multilingual draft
            for staff review.
          </p>
          <div className="creation-mode-action">
            Open AI-Assisted <span>→</span>
          </div>
        </button>

        <Link to="/admin/forms-builder" className="creation-mode-card creation-mode-builder">
          <div className="creation-mode-head">
            <span className="creation-mode-icon">
              <Wrench size={24} />
            </span>
            <span className="creation-mode-badge">Manual</span>
          </div>
          <h3>Standard Builder</h3>
          <p>
            Start from a blank assessment and configure questions, scores and patient voice input
            manually.
          </p>
          <div className="creation-mode-action">
            Open Standard Builder <span>→</span>
          </div>
        </Link>

        <button
          type="button"
          className="creation-mode-card creation-mode-upload"
          onClick={() => onPick("pdf")}
        >
          <div className="creation-mode-head">
            <span className="creation-mode-icon">
              <FileText size={24} />
            </span>
            <span className="creation-mode-badge">AI Vision</span>
          </div>
          <h3>Upload PDF</h3>
          <p>
            Import an existing assessment document. AI extracts the content and creates a draft for
            review.
          </p>
          <div className="creation-mode-action">
            Open PDF Upload <span>→</span>
          </div>
        </button>

        <button
          type="button"
          className="creation-mode-card creation-mode-scan"
          onClick={() => onPick("scan")}
        >
          <div className="creation-mode-head">
            <span className="creation-mode-icon">
              <ScanLine size={24} />
            </span>
            <span className="creation-mode-badge">AI Vision</span>
          </div>
          <h3>Scan Image</h3>
          <p>Upload a photo of a paper form. AI reads it and creates an editable draft.</p>
          <div className="creation-mode-action">
            Open Image Scan <span>→</span>
          </div>
        </button>
      </section>
    </AdminShell>
  );
}

/* ── AI Chat Card ──────────────────────────────────────── */
function AICard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "Tell me what assessment you need. I'll create a multilingual draft for you to review before publishing.",
    },
  ]);
  const [draft, setDraft] = useState<AIDraftForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onVoiceFinal = useCallback((t: string) => {
    setInput((c) => [c, t].filter(Boolean).join(c ? " " : ""));
  }, []);
  const voice = useSpeechRecognition({ locale: "en-US", onFinal: onVoiceFinal });

  const send = async (override?: string) => {
    const content = (override ?? input).trim();
    if (!content || loading) return;
    setError("");
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    voice.reset();
    try {
      const res = await fetch("/api/ai/form-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "chat", messages: next.slice(-10) }),
      });
      const result = (await res.json()) as {
        success: boolean;
        type?: "chat" | "draft";
        form?: AIDraftForm;
        message?: string;
      };
      if (!res.ok || !result.success) {
        const msg = result.message || "AI Assistant is unavailable.";
        setError(msg);
        setMessages((c) => [...c, { role: "assistant", content: msg }]);
        return;
      }
      if (result.type === "draft" && result.form) {
        setDraft(result.form);
        setMessages((c) => [
          ...c,
          {
            role: "assistant",
            content:
              result.message || `Draft ready: ${result.form!.title.en}. Review before using.`,
          },
        ]);
      } else {
        setMessages((c) => [
          ...c,
          {
            role: "assistant",
            content: result.message || "Could you describe the assessment you need?",
          },
        ]);
      }
    } catch {
      const msg = "Couldn't reach AI Assistant. Check the server configuration.";
      setError(msg);
      setMessages((c) => [...c, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const useDraft = () => {
    if (!draft) return;
    window.sessionStorage.setItem("pf_ai_form_draft", JSON.stringify(draft));
    navigate({ to: "/admin/forms-builder" });
  };

  return (
    <AdminShell
      title="AI Form Assistant"
      eyebrow="Forms / New / AI-Assisted"
      activeNav="forms"
      actions={
        <button className="admin-soft-button" onClick={onBack}>
          ← Back
        </button>
      }
    >
      <div className="ai-assistant-layout">
        <section className="ai-chat-panel">
          <div className="ai-chat-head">
            <div className="ai-avatar">
              <Bot size={22} />
            </div>
            <div>
              <span className="panel-kicker">PesatRouter · pesat-flash</span>
              <h2>Draft with AI, decide as staff.</h2>
              <p>AI prepares the structure. Clinical staff must review before publishing.</p>
            </div>
          </div>
          <div className="ai-suggestion-row">
            {[
              "Create a short post-surgery knee follow-up with pain, swelling and mobility questions.",
              "Create a shoulder pain assessment with 7 questions and a 0–10 pain scale.",
              "Create a hip function screening form for an initial clinic visit.",
            ].map((s) => (
              <button key={s} type="button" onClick={() => send(s)} disabled={loading}>
                {s}
              </button>
            ))}
          </div>
          <div className="ai-chat-scroll">
            {messages.map((m, i) => (
              <div key={i} className={`ai-message ai-message-${m.role}`}>
                <span>{m.role === "assistant" ? <Sparkles size={15} /> : "You"}</span>
                <p>{m.content}</p>
              </div>
            ))}
            {loading && (
              <div className="ai-message ai-message-assistant">
                <span>
                  <LoaderCircle size={15} className="ai-spin" />
                </span>
                <p>Thinking…</p>
              </div>
            )}
          </div>
          {error && (
            <div className="ai-inline-error">
              <AlertCircle size={17} />
              <span>{error}</span>
            </div>
          )}
          <div className={`ai-composer ${voice.state === "listening" ? "is-listening" : ""}`}>
            <textarea
              rows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: Create an 8-question shoulder pain assessment…"
            />
            <div className="ai-composer-bottom">
              <div className="ai-voice-status">
                <Mic size={15} />
                <span>
                  {voice.state === "listening" ? "Listening…" : "Speak or type your prompt"}
                </span>
              </div>
              <div className="ai-composer-actions">
                {voice.state === "listening" ? (
                  <button type="button" className="admin-soft-button" onClick={voice.stop}>
                    Stop
                  </button>
                ) : (
                  <button
                    type="button"
                    className="admin-soft-button"
                    onClick={() => {
                      setError("");
                      voice.start();
                    }}
                  >
                    <Mic size={16} /> Voice
                  </button>
                )}
                <button
                  type="button"
                  className="admin-primary-button"
                  disabled={!input.trim() || loading}
                  onClick={() => send()}
                >
                  <Send size={16} /> Send
                </button>
              </div>
            </div>
          </div>
        </section>
        <aside className="ai-draft-panel">
          <div className="ai-draft-head">
            <div>
              <span className="panel-kicker">Generated preview</span>
              <h2>{draft?.title.en ?? "Your draft will appear here"}</h2>
            </div>
            {draft && (
              <span className="ai-draft-status">
                <Check size={14} /> Draft
              </span>
            )}
          </div>
          {!draft ? (
            <div className="ai-empty-draft">
              <div>
                <WandSparkles size={30} />
              </div>
              <h3>Describe the assessment</h3>
              <p>Use chat or the microphone.</p>
            </div>
          ) : (
            <>
              <p className="ai-draft-description">{draft.description.en}</p>
              <div className="ai-draft-questions">
                {draft.questions.map((q, i) => (
                  <article key={q.id}>
                    <span>{i + 1}</span>
                    <div>
                      <strong>{q.prompt.en}</strong>
                      <small>
                        {q.type === "yesno"
                          ? "Yes/No"
                          : q.type === "scale"
                            ? "0–10"
                            : q.type === "text"
                              ? "Text"
                              : "Choice"}
                        {q.optional ? " · Optional" : ""}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
              <div className="ai-review-warning">
                <AlertCircle size={17} />
                <span>Review wording, translations and scoring before publishing.</span>
              </div>
              <button
                type="button"
                className="admin-primary-button admin-primary-button-full"
                onClick={useDraft}
              >
                <WandSparkles size={16} /> Use This Form
              </button>
            </>
          )}
        </aside>
      </div>
    </AdminShell>
  );
}

/* ── PDF Upload Card ───────────────────────────────────── */
function PDFCard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<AIDraftForm | null>(null);

  const handleFile = async (file: File) => {
    setError("");
    setDraft(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/ai/extract-pdf", { method: "POST", body: fd });
      const result = (await res.json()) as {
        success: boolean;
        form?: AIDraftForm;
        message?: string;
      };
      if (!res.ok || !result.success) {
        setError(result.message || "Could not process this PDF.");
        return;
      }
      setDraft(result.form!);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const useDraft = () => {
    if (!draft) return;
    window.sessionStorage.setItem("pf_ai_form_draft", JSON.stringify(draft));
    navigate({ to: "/admin/forms-builder" });
  };

  return (
    <AdminShell
      title="Upload PDF"
      eyebrow="Forms / New / PDF Upload"
      activeNav="forms"
      actions={
        <button className="admin-soft-button" onClick={onBack}>
          ← Back
        </button>
      }
    >
      <div className="extract-card">
        {!draft && (
          <div
            className="extract-dropzone"
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("dragover");
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("dragover");
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => {
              const inp = document.createElement("input");
              inp.type = "file";
              inp.accept = ".pdf";
              inp.onchange = () => {
                const f = inp.files?.[0];
                if (f) handleFile(f);
              };
              inp.click();
            }}
          >
            {loading ? (
              <>
                <LoaderCircle size={36} className="ai-spin" />
                <p>Extracting and generating draft…</p>
              </>
            ) : (
              <>
                <Upload size={36} />
                <h3>Drop a PDF here or click to browse</h3>
                <p>Max 10 MB. AI will extract the content and generate a form draft.</p>
              </>
            )}
          </div>
        )}
        {error && (
          <div className="ai-inline-error">
            <AlertCircle size={17} />
            <span>{error}</span>
            <button type="button" onClick={() => setError("")}>
              Dismiss
            </button>
          </div>
        )}
        {draft && (
          <div className="extract-result">
            <div className="ai-draft-head">
              <div>
                <span className="panel-kicker">Extracted draft</span>
                <h2>{draft.title.en}</h2>
              </div>
            </div>
            <p className="ai-draft-description">{draft.description.en}</p>
            <div className="ai-draft-questions">
              {draft.questions.map((q, i) => (
                <article key={q.id}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{q.prompt.en}</strong>
                    <small>{q.type}</small>
                  </div>
                </article>
              ))}
            </div>
            <div className="ai-review-warning">
              <AlertCircle size={17} />
              <span>Review carefully — AI extraction may contain errors.</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="admin-primary-button" onClick={useDraft}>
                <WandSparkles size={16} /> Use This Form
              </button>
              <button
                type="button"
                className="admin-soft-button"
                onClick={() => {
                  setDraft(null);
                  setError("");
                }}
              >
                Upload another
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

/* ── Scan Image Card ───────────────────────────────────── */
function ScanCard({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<AIDraftForm | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError("");
    setDraft(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/ai/extract-image", { method: "POST", body: fd });
      const result = (await res.json()) as {
        success: boolean;
        form?: AIDraftForm;
        message?: string;
      };
      if (!res.ok || !result.success) {
        setError(result.message || "Could not process this image.");
        return;
      }
      setDraft(result.form!);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const useDraft = () => {
    if (!draft) return;
    window.sessionStorage.setItem("pf_ai_form_draft", JSON.stringify(draft));
    navigate({ to: "/admin/forms-builder" });
  };

  return (
    <AdminShell
      title="Scan Image"
      eyebrow="Forms / New / Image Scan"
      activeNav="forms"
      actions={
        <button className="admin-soft-button" onClick={onBack}>
          ← Back
        </button>
      }
    >
      <div className="extract-card">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        {!draft && (
          <div
            className="extract-dropzone"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("dragover");
            }}
            onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("dragover");
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileRef.current?.click()}
          >
            {loading ? (
              <>
                <LoaderCircle size={36} className="ai-spin" />
                <p>Analyzing image and generating draft…</p>
              </>
            ) : (
              <>
                <ScanLine size={36} />
                <h3>Drop an image or click to browse</h3>
                <p>PNG, JPEG, or WebP up to 10 MB. AI reads the form and creates a draft.</p>
              </>
            )}
          </div>
        )}
        {preview && !draft && !loading && (
          <div className="scan-preview">
            <img src={preview} alt="Uploaded form" />
          </div>
        )}
        {error && (
          <div className="ai-inline-error">
            <AlertCircle size={17} />
            <span>{error}</span>
            <button type="button" onClick={() => setError("")}>
              Dismiss
            </button>
          </div>
        )}
        {draft && (
          <div className="extract-result">
            <div className="ai-draft-head">
              <div>
                <span className="panel-kicker">Extracted draft</span>
                <h2>{draft.title.en}</h2>
              </div>
            </div>
            <p className="ai-draft-description">{draft.description.en}</p>
            <div className="ai-draft-questions">
              {draft.questions.map((q, i) => (
                <article key={q.id}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{q.prompt.en}</strong>
                    <small>{q.type}</small>
                  </div>
                </article>
              ))}
            </div>
            <div className="ai-review-warning">
              <AlertCircle size={17} />
              <span>Review carefully — AI extraction may contain errors.</span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="admin-primary-button" onClick={useDraft}>
                <WandSparkles size={16} /> Use This Form
              </button>
              <button
                type="button"
                className="admin-soft-button"
                onClick={() => {
                  setDraft(null);
                  setPreview(null);
                  setError("");
                }}
              >
                Scan another
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
