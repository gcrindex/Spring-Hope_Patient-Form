import { useEffect, type ReactNode } from "react";
import { ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { BrandMark } from "./brand";
import { LanguageSwitcher } from "./language-switcher";
import { copy, type Language } from "../lib/patientform";

export function PatientShell({
  children,
  language,
  onLanguage,
  progress,
  onBack,
  stepLabel,
  docTitle,
  theme = "default",
  showBrand = true,
  customLogo,
}: {
  children: ReactNode;
  language: Language;
  onLanguage: (language: Language) => void;
  progress?: number | undefined;
  onBack?: (() => void) | undefined;
  stepLabel?: string | undefined;
  docTitle?: string | undefined;
  theme?: "default" | "elderly-dark" | undefined;
  showBrand?: boolean | undefined;
  customLogo?: string | undefined;
}) {
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = docTitle || copy[language]?.docTitle || "Guided Form — 9forms.com";
    }
  }, [language, docTitle]);

  return (
    <div className="patient-page" data-theme={theme}>
      <header className="patient-header">
        <div className="patient-header-inner">
          <div className="flex items-center gap-3">
            {onBack && (
              <button type="button" className="patient-back" onClick={onBack} aria-label="Back">
                <ArrowLeft size={22} strokeWidth={2.5} />
              </button>
            )}
            {customLogo ? (
              <img
                src={customLogo}
                alt="Logo"
                className="h-[28px] max-w-[140px] object-contain rounded select-none bg-white/10 px-1 py-0.5"
              />
            ) : showBrand ? (
              <BrandMark inverse />
            ) : (
              <div className="inline-flex items-center gap-1.5 text-white/90 font-bold text-sm tracking-tight select-none">
                <span>9forms Intake</span>
              </div>
            )}
          </div>
          <LanguageSwitcher value={language} onChange={onLanguage} compact />
        </div>
        {typeof progress === "number" && (
          <div className="patient-progress-wrap">
            <div className="patient-progress-meta">
              <span className="patient-step-label">{stepLabel || ""}</span>
              <span className="patient-step-percent">{Math.round(progress)}%</span>
            </div>
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
      <footer className="patient-footer-note flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="flex-shrink-0" />
          <span>
            {language === "id"
              ? "Input suara opsional. Pilihan sentuh selalu dapat digunakan."
              : language === "zh"
                ? "语音输入为可选功能，触屏点击随时可用。"
                : "Voice is optional. Manual answers always work."}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-white/50 mt-0.5">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span>256-bit Encrypted</span>
          </span>
          <span>•</span>
          <a
            href="/#privacy"
            target="_blank"
            rel="noreferrer"
            className="text-white/60 hover:text-white underline transition-colors"
          >
            {language === "id" ? "Kebijakan Privasi" : language === "zh" ? "隐私条款" : "Privacy & Terms"}
          </a>
        </div>

        {showBrand && (
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/60 hover:text-white transition-colors duration-150 no-underline mt-0.5"
          >
            <Zap size={11} className="text-amber-400" />
            <span>Powered by 9forms.com</span>
          </a>
        )}
      </footer>
    </div>
  );
}
