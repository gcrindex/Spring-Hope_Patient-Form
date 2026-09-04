import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Mic, ShieldCheck, Waves } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PatientShell } from "../components/patient-shell";
import { VoiceControl } from "../components/voice-control";
import { useSpeechRecognition } from "../hooks/use-speech-recognition";
import { getStoredLanguage, localeFor, setStoredLanguage, type Language } from "../lib/patientform";

export const Route = createFileRoute("/intake/microphone")({
  head: () => ({ meta: [{ title: "Voice check — Spring Hope" }] }),
  component: MicrophoneCheck,
});

function MicrophoneCheck() {
  const [language, setLanguage] = useState<Language>("en");
  const [heard, setHeard] = useState("");
  useEffect(() => setLanguage(getStoredLanguage()), []);
  const onFinal = useCallback((text: string) => setHeard(text), []);
  const voice = useSpeechRecognition({ locale: localeFor(language), onFinal });
  const setLang = (next: Language) => {
    setLanguage(next);
    setStoredLanguage(next);
    setHeard("");
    voice.reset();
  };

  return (
    <PatientShell language={language} onLanguage={setLang}>
      <div className="patient-card microphone-test-card patient-enter">
        <div className="patient-start-icon">
          <Waves size={24} />
        </div>
        <div className="patient-badge">
          <Mic size={14} /> Optional voice check
        </div>
        <h1>Try your microphone</h1>
        <p className="patient-description">
          Say a short phrase to see how voice answering behaves on this browser. Nothing here is
          saved as raw audio.
        </p>
        <VoiceControl
          language={language}
          state={voice.state}
          transcript={voice.transcript}
          error={voice.error}
          onStart={voice.start}
          onStop={voice.stop}
          onReset={() => {
            voice.reset();
            setHeard("");
          }}
          recognizedLabel={heard}
        />
        {heard && (
          <div className="voice-test-result">
            <Check size={17} />
            <span>
              Ready. We heard: <strong>“{heard}”</strong>
            </span>
          </div>
        )}
        <div className="patient-privacy-line">
          <ShieldCheck size={15} /> Browser support varies. Manual answering is always available.
        </div>
        <Link to="/intake" className="patient-primary-action">
          <ArrowLeft size={18} /> Back to assessment
        </Link>
      </div>
    </PatientShell>
  );
}
