import { Mic, RotateCcw, Square, Waves } from "lucide-react";
import { copy, type Language } from "../lib/patientform";

type Props = {
  language: Language;
  state: "idle" | "listening" | "processing" | "recognized" | "error";
  transcript: string;
  error: "permission-denied" | "not-supported" | "no-speech" | "generic" | null;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  recognizedLabel?: string;
};

export function VoiceControl({
  language,
  state,
  transcript,
  error,
  onStart,
  onStop,
  onReset,
  recognizedLabel,
}: Props) {
  const t = copy[language];

  if (state === "listening") {
    return (
      <div className="voice-card voice-card-listening" role="status" aria-live="polite">
        <button
          type="button"
          className="voice-orb voice-orb-live"
          onClick={onStop}
          aria-label="Stop listening"
        >
          <Waves size={24} />
          <span className="voice-ring ring-one" />
          <span className="voice-ring ring-two" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-extrabold text-ink">{t.listening}</div>
          <div className="mt-1 text-sm text-muted">{transcript || t.voiceHint}</div>
        </div>
        <button type="button" className="icon-soft-button" onClick={onStop} aria-label="Stop">
          <Square size={16} fill="currentColor" />
        </button>
      </div>
    );
  }

  if (state === "processing") {
    return (
      <div className="voice-card" role="status" aria-live="polite">
        <div className="voice-orb voice-orb-processing">
          <Waves size={24} />
        </div>
        <div>
          <div className="text-sm font-extrabold text-ink">{t.processing}</div>
          <div className="mt-1 text-sm text-muted truncate max-w-[250px]">“{transcript}”</div>
        </div>
      </div>
    );
  }

  if (state === "recognized") {
    return (
      <div className="voice-card voice-card-success" role="status" aria-live="polite">
        <div className="voice-orb voice-orb-success">
          <Mic size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-[0.13em] text-positive">
            {t.heard}
          </div>
          <div className="mt-1 truncate text-sm font-extrabold text-ink">
            “{recognizedLabel || transcript}”
          </div>
        </div>
        <button type="button" className="icon-soft-button" onClick={onReset} aria-label={t.retry}>
          <RotateCcw size={17} />
        </button>
      </div>
    );
  }

  if (state === "error") {
    const message =
      error === "permission-denied"
        ? t.denied
        : error === "not-supported"
          ? t.unsupported
          : t.noSpeech;
    return (
      <div className="voice-card voice-card-error" role="alert">
        <div className="voice-orb voice-orb-error">
          <Mic size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-extrabold text-ink">{message}</div>
          <div className="mt-1 text-xs text-muted">{t.manual}</div>
        </div>
        {error !== "not-supported" && (
          <button type="button" className="small-text-button" onClick={onStart}>
            {t.retry}
          </button>
        )}
      </div>
    );
  }

  return (
    <button type="button" className="voice-trigger group" onClick={onStart}>
      <span className="voice-trigger-icon">
        <Mic size={20} />
      </span>
      <span className="text-left">
        <span className="block text-sm font-extrabold text-ink">{t.voice}</span>
        <span className="mt-0.5 block text-xs text-muted">{t.voiceHint}</span>
      </span>
      <span className="ml-auto flex h-8 items-end gap-[3px]" aria-hidden="true">
        {[10, 16, 22, 14, 18].map((height, index) => (
          <span key={index} className="voice-bar" style={{ height }} />
        ))}
      </span>
    </button>
  );
}
