import type { ReactNode } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { BrandMark } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import type { Language } from "../lib/patientform";

export function PatientShell({
  children,
  language,
  onLanguage,
  progress,
  onBack,
  stepLabel,
}: {
  children: ReactNode;
  language: Language;
  onLanguage: (language: Language) => void;
  progress?: number;
  onBack?: () => void;
  stepLabel?: string;
}) {
  return (
    <div className="patient-page">
      <header className="patient-header">
        <div className="patient-header-inner">
          <div className="flex items-center gap-3">
            {onBack && (
              <button type="button" className="patient-back" onClick={onBack} aria-label="Back">
                <ArrowLeft size={22} strokeWidth={2.5} />
              </button>
            )}
            <BrandMark inverse />
          </div>
          <LanguageSwitcher value={language} onChange={onLanguage} compact />
        </div>
        {typeof progress === "number" && (
          <div className="patient-progress-wrap">
            <div className="patient-progress-track">
              <div
                className="patient-progress-fill"
                style={{ width: `${Math.max(4, Math.min(100, progress))}%` }}
              />
            </div>
          </div>
        )}
      </header>
      <main className="patient-main">{children}</main>
      <footer className="patient-footer-note">
        <ShieldCheck size={14} /> Voice is optional. Manual answers always work.
      </footer>
    </div>
  );
}
