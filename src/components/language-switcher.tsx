import { languages, type Language } from "../lib/patientform";

export function LanguageSwitcher({
  value,
  onChange,
  compact = false,
}: {
  value: Language;
  onChange: (language: Language) => void;
  compact?: boolean;
}) {
  return (
    <div className="language-switcher" aria-label="Language selector">
      {languages.map((language) => (
        <button
          key={language.value}
          type="button"
          className={value === language.value ? "active" : ""}
          onClick={() => onChange(language.value)}
          title={language.label}
        >
          {compact ? language.short : language.short}
        </button>
      ))}
    </div>
  );
}
