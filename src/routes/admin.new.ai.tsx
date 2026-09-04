import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Check,
  LoaderCircle,
  Mic,
  RotateCcw,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { AdminShell } from "../components/admin-shell";
import { AdminAuthGuard } from "../components/admin-auth-guard";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import type { AIDraftForm } from "../lib/ai-draft";

export const Route = createFileRoute("/admin/new/ai")({
  head: () => ({ meta: [{ title: "AI Form Assistant — Spring Hope" }] }),
  component: () => (
    <AdminAuthGuard>
      <AIAssistant />
    </AdminAuthGuard>
  ),
});

type ChatMessage = { role: "user" | "assistant"; content: string };
type ApiResult =
  | { success: true; form: AIDraftForm; provider: string; model: string }
  | { success: false; error: string; message: string };

const suggestions = [
  "Create a short post-surgery knee follow-up with pain, swelling and mobility questions.",
  "Create a shoulder pain assessment with 7 questions and a 0–10 pain scale.",
  "Create a hip function screening form for an initial clinic visit.",
];

function AIAssistant() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Tell me what assessment you need. I’ll create a multilingual draft for you to review before publishing.",
    },
  ]);
  const [draft, setDraft] = useState<AIDraftForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onVoiceFinal = useCallback((transcript: string) => {
    setInput((current) => [current, transcript].filter(Boolean).join(current ? " " : ""));
  }, []);
  const voice = useSpeechRecognition({ locale: "en-SG", onFinal: onVoiceFinal });

  const send = async (override?: string) => {
    const content = (override ?? input).trim();
    if (!content || loading) return;
    setError("");
    setDraft(null);
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    voice.reset();

    try {
      const response = await fetch("/api/ai/form-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "chat", messages: nextMessages.slice(-10) }),
      });
      const result = (await response.json()) as ApiResult;
      if (!response.ok || !result.success) {
        const message = result.success ? "AI Assistant is unavailable." : result.message;
        setError(message);
        setMessages((current) => [...current, { role: "assistant", content: message }]);
        return;
      }
      setDraft(result.form);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Draft ready: ${result.form.title.en}. Review the questions before using it.`,
        },
      ]);
    } catch {
      const message = "Couldn’t reach AI Assistant. Check the server configuration and try again.";
      setError(message);
      setMessages((current) => [...current, { role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  };

  const useDraft = () => {
    if (!draft) return;
    window.sessionStorage.setItem("pf_ai_form_draft", JSON.stringify(draft));
    navigate({ to: "/admin/forms-builder" });
  };

  const voiceStatus = useMemo(() => {
    if (voice.state === "listening") return "Listening… speak your form idea.";
    if (voice.state === "processing") return "Turning speech into text…";
    if (voice.state === "error")
      return voice.error === "permission-denied"
        ? "Microphone permission is blocked. You can keep typing."
        : "Voice input isn’t available right now. You can keep typing.";
    return "Speak or type your prompt";
  }, [voice.error, voice.state]);

  return (
    <AdminShell
      title="AI Form Assistant"
      eyebrow="Forms / New / AI-Assisted"
      actions={
        <Link to="/admin/new" className="admin-soft-button">
          <ArrowLeft size={16} /> Creation methods
        </Link>
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
              <p>
                AI prepares the structure. Clinical staff must review wording, scoring and
                suitability before publishing.
              </p>
            </div>
          </div>

          <div className="ai-suggestion-row">
            {suggestions.map((item) => (
              <button key={item} type="button" onClick={() => send(item)} disabled={loading}>
                {item}
              </button>
            ))}
          </div>

          <div className="ai-chat-scroll">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`ai-message ai-message-${message.role}`}
              >
                <span>{message.role === "assistant" ? <Sparkles size={15} /> : "You"}</span>
                <p>{message.content}</p>
              </div>
            ))}
            {loading && (
              <div className="ai-message ai-message-assistant">
                <span>
                  <LoaderCircle size={15} className="ai-spin" />
                </span>
                <p>Building the draft…</p>
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
              onChange={(event) => setInput(event.target.value)}
              placeholder="Example: Create an 8-question shoulder pain assessment for an initial consultation…"
            />
            <div className="ai-composer-bottom">
              <div className="ai-voice-status">
                <Mic size={15} />
                <span>{voiceStatus}</span>
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
                  <Send size={16} /> Generate
                </button>
              </div>
            </div>
            {voice.transcript && <div className="ai-live-transcript">“{voice.transcript}”</div>}
            {voice.state === "error" && voice.error !== "not-supported" && (
              <button type="button" className="ai-retry-voice" onClick={voice.start}>
                <RotateCcw size={14} /> Try microphone again
              </button>
            )}
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
              <p>Use chat or the microphone. The AI result is never published automatically.</p>
            </div>
          ) : (
            <>
              <p className="ai-draft-description">{draft.description.en}</p>
              <div className="ai-draft-questions">
                {draft.questions.map((question, index) => (
                  <article key={question.id}>
                    <span>{index + 1}</span>
                    <div>
                      <strong>{question.prompt.en}</strong>
                      <small>
                        {labelType(question.type)}
                        {question.optional ? " · Optional" : ""}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
              <div className="ai-review-warning">
                <AlertCircle size={17} />
                <span>
                  Review question wording, translations and scoring before publishing this
                  AI-generated draft.
                </span>
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

function labelType(type: string) {
  if (type === "yesno") return "Yes / No";
  if (type === "scale") return "0–10 scale";
  if (type === "text") return "Free text";
  return "Multiple choice";
}
