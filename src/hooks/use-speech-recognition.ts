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
  keepAlive?: boolean;
};

export function useSpeechRecognition({
  locale,
  onFinal,
  keepAlive = true,
}: UseSpeechRecognitionOptions) {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const completionTimerRef = useRef<number | null>(null);
  const restartTimerRef = useRef<number | null>(null);
  const shouldListenRef = useRef(false);
  const sessionRef = useRef(0);
  const onFinalRef = useRef(onFinal);
  const localeRef = useRef(locale);

  onFinalRef.current = onFinal;
  localeRef.current = locale;

  const [state, setState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<VoiceError>(null);

  const speechWindow = typeof window !== "undefined" ? (window as SpeechWindow) : null;
  const Recognition = speechWindow?.SpeechRecognition ?? speechWindow?.webkitSpeechRecognition;
  const supported = Boolean(Recognition);

  const clearTimers = useCallback(() => {
    if (completionTimerRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    if (restartTimerRef.current !== null && typeof window !== "undefined") {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    clearTimers();
    try {
      recognitionRef.current?.stop();
    } catch {
      // Ignore cleanup error
    }
    setState("idle");
  }, [clearTimers]);

  const reset = useCallback(() => {
    shouldListenRef.current = false;
    sessionRef.current += 1;
    clearTimers();
    try {
      recognitionRef.current?.abort?.();
    } catch {
      // Ignore cleanup error
    }
    recognitionRef.current = null;
    setState("idle");
    setTranscript("");
    setError(null);
  }, [clearTimers]);

  const launch = useCallback(
    (currentSession: number) => {
      if (!Recognition || !shouldListenRef.current || currentSession !== sessionRef.current) {
        return;
      }

      try {
        recognitionRef.current?.abort?.();
      } catch {
        // cleanup prior instance
      }

      const recognition = new Recognition();
      recognition.lang = localeRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        if (currentSession !== sessionRef.current) return;

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
        if (nextTranscript) {
          setTranscript(nextTranscript);
        }

        if (final.trim()) {
          setState("processing");
          if (completionTimerRef.current !== null && typeof window !== "undefined") {
            window.clearTimeout(completionTimerRef.current);
          }
          completionTimerRef.current = window.setTimeout(() => {
            if (currentSession !== sessionRef.current) return;
            completionTimerRef.current = null;
            setState("recognized");
            onFinalRef.current(final.trim(), confidence);
          }, 200);
        } else if (interim.trim()) {
          if (completionTimerRef.current !== null && typeof window !== "undefined") {
            window.clearTimeout(completionTimerRef.current);
          }
          completionTimerRef.current = window.setTimeout(() => {
            if (currentSession !== sessionRef.current) return;
            completionTimerRef.current = null;
            setState("recognized");
            onFinalRef.current(interim.trim(), confidence || 0.8);
          }, 550);
        }
      };

      recognition.onerror = (event) => {
        if (currentSession !== sessionRef.current) return;
        const reason = event.error;

        if (reason === "not-allowed" || reason === "service-not-allowed") {
          shouldListenRef.current = false;
          setState("error");
          setError("permission-denied");
        } else if (reason === "no-speech") {
          // Normal pause, keep listening state active
        } else if (reason === "aborted") {
          // Expected on navigation
        } else {
          if (!keepAlive) {
            setState("error");
            setError("generic");
          }
        }
      };

      recognition.onend = () => {
        if (currentSession !== sessionRef.current) return;
        recognitionRef.current = null;

        if (shouldListenRef.current && keepAlive) {
          setState("listening");
          if (restartTimerRef.current !== null && typeof window !== "undefined") {
            window.clearTimeout(restartTimerRef.current);
          }
          restartTimerRef.current = window.setTimeout(() => {
            if (shouldListenRef.current && currentSession === sessionRef.current) {
              launch(currentSession);
            }
          }, 100);
        } else {
          setState((current) => (current === "listening" ? "idle" : current));
        }
      };

      try {
        recognition.start();
        setState("listening");
        setError(null);
      } catch {
        if (shouldListenRef.current && keepAlive) {
          restartTimerRef.current = window.setTimeout(() => {
            if (shouldListenRef.current && currentSession === sessionRef.current) {
              launch(currentSession);
            }
          }, 200);
        }
      }
    },
    [Recognition, keepAlive],
  );

  const start = useCallback(() => {
    if (!Recognition) {
      setState("error");
      setError("not-supported");
      return;
    }

    shouldListenRef.current = true;
    sessionRef.current += 1;
    clearTimers();
    setTranscript("");
    setError(null);
    setState("listening");
    launch(sessionRef.current);
  }, [Recognition, clearTimers, launch]);

  useEffect(() => () => reset(), [reset]);

  return { supported, state, transcript, error, start, stop, reset, setTranscript };
}
