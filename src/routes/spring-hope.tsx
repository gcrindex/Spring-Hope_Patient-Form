import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Languages,
  Mic,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Upload,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BrandMark } from "../components/brand";
import { LanguageSwitcher } from "../components/language-switcher";
import {
  getStoredLanguage,
  onLanguageChange,
  setStoredLanguage,
  type Language,
} from "../lib/patientform";
import { landingI18n } from "../lib/translations";

export const Route = createFileRoute("/spring-hope")({
  head: () => ({
    meta: [
      { title: "PatientForm — Spring Hope Orthopaedic Clinic (Legacy Landing)" },
      {
        name: "description",
        content:
          "A guided, voice-enabled clinical assessment experience for Spring Hope Orthopaedic Clinic.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    setLanguage(getStoredLanguage());
    return onLanguageChange(setLanguage);
  }, []);

  const handleLang = (next: Language) => {
    setStoredLanguage(next);
    setLanguage(next);
  };

  const t = landingI18n[language] ?? landingI18n.en;

  return (
    <div className="marketing-page">
      <header className="marketing-header">
        <div className="marketing-nav">
          <BrandMark />
          <nav className="marketing-links" aria-label="Main navigation">
            <a href="#experience">{t.navExperience}</a>
            <a href="#voice">{t.navVoice}</a>
            <a href="#workflow">{t.navWorkflow}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher value={language} onChange={handleLang} compact />
            <Link className="button-primary button-nav" to="/intake" search={{ form: undefined }}>
              {t.tryAssessment} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero Section ──────────────────────────────── */}
        <section className="hero-section">
          <div className="hero-aurora hero-aurora-one" />
          <div className="hero-aurora hero-aurora-two" />
          <div className="hero-grid">
            <div className="hero-copy reveal-up">
              <div className="eyebrow-pill">
                <Sparkles size={14} /> {t.badge}
              </div>
              <h1>
                {t.heroH1Pre}
                <span>{t.heroH1Span}</span>
              </h1>
              <p className="hero-lead">{t.heroLead}</p>
              <div className="hero-actions">
                <Link
                  className="button-primary button-lg"
                  to="/intake"
                  search={{ form: undefined }}
                >
                  {t.tryLive} <ArrowRight size={18} />
                </Link>
                <a className="button-secondary button-lg" href="#voice">
                  {t.seeVoice}
                </a>
              </div>
              <div className="hero-trust-row">
                <div>
                  <Check size={15} /> {t.noApp}
                </div>
                <div>
                  <Check size={15} /> {t.languages}
                </div>
                <div>
                  <Check size={15} /> {t.manualFallback}
                </div>
              </div>
            </div>

            <div
              className="hero-product-stage reveal-scale"
              aria-label="PatientForm product preview"
            >
              <div className="hero-note hero-note-top">
                <Waves size={17} />
                <span>
                  <strong>{t.voiceUnderstood}</strong>
                  <small>{t.voiceUnderstoodSub}</small>
                </span>
              </div>
              <div className="phone-shell">
                <div className="phone-island" />
                <div className="phone-ui">
                  <div className="phone-topline">
                    <span className="phone-brand-dot" />
                    <span>Spring Hope</span>
                    <span className="ml-auto text-muted">EN</span>
                  </div>
                  <div className="phone-progress">
                    <span style={{ width: "57%" }} />
                  </div>
                  <div className="phone-question-meta">QUESTION 4 OF 7</div>
                  <h3>
                    {language === "id"
                      ? "Nilai nyeri lutut Anda sekarang"
                      : language === "zh"
                        ? "请评估目前的膝痛"
                        : "Rate your pain right now"}
                  </h3>
                  <p>
                    {language === "id"
                      ? "0 berarti tidak ada nyeri. 10 berarti nyeri terburuk."
                      : language === "zh"
                        ? "0 表示无痛，10 表示剧烈疼痛"
                        : "0 means no pain. 10 means the worst pain you can imagine."}
                  </p>
                  <div className="phone-score">7</div>
                  <div className="phone-scale-track">
                    <span style={{ width: "70%" }} />
                    <i style={{ left: "70%" }} />
                  </div>
                  <div className="phone-scale-labels">
                    <span>
                      {language === "id" ? "Tanpa nyeri" : language === "zh" ? "无痛" : "No pain"}
                    </span>
                    <span>
                      {language === "id"
                        ? "Nyeri terburuk"
                        : language === "zh"
                          ? "最严重疼痛"
                          : "Worst pain"}
                    </span>
                  </div>
                  <div className="phone-voice-live">
                    <div className="mini-voice-orb">
                      <Mic size={18} />
                      <i />
                      <b />
                    </div>
                    <div>
                      <strong>
                        {language === "id"
                          ? 'Saya mendengar "tujuh"'
                          : language === "zh"
                            ? '识别到 "七"'
                            : 'I heard "seven"'}
                      </strong>
                      <small>
                        {language === "id"
                          ? "Gunakan jawaban ini atau ubah"
                          : language === "zh"
                            ? "确认使用或修改"
                            : "Use this answer or change it"}
                      </small>
                    </div>
                  </div>
                  <button className="phone-continue">
                    {language === "id" ? "Lanjut" : language === "zh" ? "继续" : "Continue"}{" "}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
              <div className="hero-note hero-note-bottom">
                <ShieldCheck size={17} />
                <span>
                  <strong>{t.patientInControl}</strong>
                  <small>{t.patientInControlSub}</small>
                </span>
              </div>
            </div>
          </div>

          <div className="hero-proof-strip">
            <div>
              <span>{t.p1Number}</span>
              <strong>{t.p1Title}</strong>
              <small>{t.p1Sub}</small>
            </div>
            <div>
              <span>{t.p2Number}</span>
              <strong>{t.p2Title}</strong>
              <small>{t.p2Sub}</small>
            </div>
            <div>
              <span>{t.p3Number}</span>
              <strong>{t.p3Title}</strong>
              <small>{t.p3Sub}</small>
            </div>
            <div>
              <span>{t.p4Number}</span>
              <strong>{t.p4Title}</strong>
              <small>{t.p4Sub}</small>
            </div>
          </div>
        </section>

        {/* ── Experience Section ────────────────────────── */}
        <section className="section-shell section-light" id="experience">
          <div className="section-kicker">{t.expKicker}</div>
          <div className="section-title-row">
            <h2>
              {t.expTitle1}
              <br />
              {t.expTitle2}
            </h2>
            <p>{t.expDesc}</p>
          </div>
          <div className="experience-grid">
            <article className="feature-card feature-card-large">
              <div className="feature-card-text-col">
                <div className="feature-icon">
                  <Smartphone size={21} />
                </div>
                <span className="feature-label">{t.f1Label}</span>
                <h3>{t.f1Title}</h3>
                <p>{t.f1Desc}</p>
              </div>
              <div className="mini-question-demo">
                <strong>
                  {language === "id"
                    ? "Sudah berapa lama Anda mengalami nyeri lutut?"
                    : language === "zh"
                      ? "膝痛持续多久？"
                      : "How long have you had knee pain?"}
                </strong>
                {(language === "id"
                  ? ["Kurang dari 1 bulan", "1–3 bulan", "3–6 bulan"]
                  : language === "zh"
                    ? ["不到 1 个月", "1–3 个月", "3–6 个月"]
                    : ["Less than 1 month", "1–3 months", "3–6 months"]
                ).map((item, i) => (
                  <div key={item} className={i === 1 ? "selected" : ""}>
                    <i>{i === 1 ? <Check size={14} /> : null}</i>
                    {item}
                  </div>
                ))}
              </div>
            </article>
            <article className="feature-card feature-card-blue" id="voice">
              <div className="feature-icon feature-icon-inverse">
                <Mic size={21} />
              </div>
              <span className="feature-label text-white/60">{t.f2Label}</span>
              <h3>
                {t.f2Title1}
                <br />
                {t.f2Title2}
              </h3>
              <p>{t.f2Desc}</p>
              <div className="voice-showcase">
                <div className="voice-showcase-orb">
                  <Mic size={26} />
                  <span />
                  <i />
                </div>
                <div className="voice-wave-bars">
                  {[20, 34, 48, 28, 54, 38, 22, 44, 30].map((h, i) => (
                    <b key={i} style={{ height: h }} />
                  ))}
                </div>
                <small>{t.f2Listening}</small>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-icon">
                <Languages size={21} />
              </div>
              <span className="feature-label">{t.f3Label}</span>
              <h3>{t.f3Title}</h3>
              <p>{t.f3Desc}</p>
              <div className="language-demo">
                <span className="active">English</span>
                <span>Bahasa</span>
                <span>中文</span>
              </div>
            </article>
            <article className="feature-card feature-card-paper">
              <div className="feature-icon">
                <Upload size={21} />
              </div>
              <span className="feature-label">{t.f4Label}</span>
              <h3>{t.f4Title}</h3>
              <p>{t.f4Desc}</p>
              <div className="paper-stack">
                <div />
                <div />
                <div className="paper-front">
                  <Upload size={20} />
                  <span>{t.f4Upload}</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── Workflow Section ──────────────────────────── */}
        <section className="section-shell workflow-section" id="workflow">
          <div className="workflow-heading">
            <div>
              <div className="section-kicker section-kicker-dark">{t.wfKicker}</div>
              <h2>{t.wfTitle}</h2>
            </div>
            <p>{t.wfDesc}</p>
          </div>
          <div className="workflow-grid">
            {[
              { icon: FileText, num: "01", title: t.s1Title, desc: t.s1Desc },
              { icon: Smartphone, num: "02", title: t.s2Title, desc: t.s2Desc },
              { icon: ClipboardCheck, num: "03", title: t.s3Title, desc: t.s3Desc },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.num} className="workflow-card">
                  <div className="workflow-number">{step.num}</div>
                  <div className="workflow-icon">
                    <Icon size={23} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                  <ChevronRight className="workflow-chevron" size={18} />
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── Closing CTA ──────────────────────────────── */}
      <section className="closing-cta">
        <div className="closing-orb closing-orb-one" />
        <div className="closing-orb closing-orb-two" />
        <div className="closing-content">
          <div className="eyebrow-pill eyebrow-pill-dark">
            <Sparkles size={14} /> {t.closingBadge}
          </div>
          <h2>{t.closingTitle}</h2>
          <p>{t.closingDesc}</p>
          <Link className="button-white button-lg" to="/intake" search={{ form: undefined }}>
            {t.closingCta} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="marketing-footer">
        <div className="marketing-footer-inner">
          <BrandMark />
          <p>{t.disclaimer}</p>
          <div className="footer-links">
            <a href="#experience">{t.navExperience}</a>
            <Link to="/">&larr; SpringForm (Landing Baru)</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
