import { useCallback, useEffect, useRef, useState } from "react";

type VoiceState = "idle" | "listening" | "processing" | "recognized" | "error";
type VoiceError = "permission-denied" | "not-supported" | "no-speech" | "generic" | null;

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0?: { transcript?: string; confidence?: number };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorEventLike = { error?: string };

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type UseSpeechRecognitionOptions = {
  locale: string;
  onFinal: (transcript: string, confidence?: number) => void;
};

export function useSpeechRecognition({ locale, onFinal }: UseSpeechRecognitionOptions) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const sessionRef = useRef(0);
  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<VoiceError>(null);

  const speechWindow = typeof window !== "undefined" ? (window as SpeechWindow) : null;
  const Recognition = speechWindow?.SpeechRecognition ?? speechWindow?.webkitSpeechRecognition;
  const supported = Boolean(Recognition);

  const clearCompletionTimer = useCallback(() => {
    if (completionTimerRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearCompletionTimer();
    try {
      recognitionRef.current?.stop();
    } catch {
      // Recognition can already be stopped by the browser.
    }
  }, [clearCompletionTimer]);

  const reset = useCallback(() => {
    sessionRef.current += 1;
    clearCompletionTimer();
    try {
      recognitionRef.current?.abort?.();
    } catch {
      // Recognition can already be stopped by the browser.
    }
    recognitionRef.current = null;
    setState("idle");
    setTranscript("");
    setError(null);
  }, [clearCompletionTimer]);

  const start = useCallback(() => {
    if (!Recognition) {
      setState("error");
      setError("not-supported");
      return;
    }

    sessionRef.current += 1;
    const session = sessionRef.current;
    clearCompletionTimer();

    try {
      recognitionRef.current?.abort?.();
    } catch {
      // Ignore cleanup errors from a previous recognition session.
    }

    const recognition = new Recognition();
    recognition.lang = locale;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 2;
    recognitionRef.current = recognition;

    setTranscript("");
    setError(null);
    setState("listening");

    recognition.onresult = (event) => {
      if (session !== sessionRef.current) return;

      let interim = "";
      let final = "";
      let confidence = 0;
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const text = result?.[0]?.transcript ?? "";
        if (result.isFinal) {
          final += text;
          confidence = result?.[0]?.confidence ?? 0;
        } else {
          interim += text;
        }
      }

      const nextTranscript = (final || interim).trim();
      setTranscript(nextTranscript);
      if (final.trim()) {
        setState("processing");
        clearCompletionTimer();
        completionTimerRef.current = window.setTimeout(() => {
          if (session !== sessionRef.current) return;
          completionTimerRef.current = null;
          setState("recognized");
          onFinal(final.trim(), confidence);
        }, 320);
      }
    };

    recognition.onerror = (event) => {
      if (session !== sessionRef.current) return;
      clearCompletionTimer();
      const reason = event.error;
      setState("error");
      if (reason === "not-allowed" || reason === "service-not-allowed")
        setError("permission-denied");
      else if (reason === "no-speech") setError("no-speech");
      else setError("generic");
    };

    recognition.onend = () => {
      if (session !== sessionRef.current) return;
      recognitionRef.current = null;
      setState((current) => (current === "listening" ? "idle" : current));
    };

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setState("error");
      setError("generic");
    }
  }, [Recognition, clearCompletionTimer, locale, onFinal]);

  useEffect(() => () => reset(), [reset]);

  return { supported, state, transcript, error, start, stop, reset, setTranscript };
}
