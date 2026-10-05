import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  FileText,
  Languages,
  LayoutDashboard,
  Lock,
  Mic,
  PenLine,
  Share2,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { PlatformMark } from "../components/brand";
import { LanguageSwitcher } from "../components/language-switcher";
import {
  getStoredLanguage,
  onLanguageChange,
  setStoredLanguage,
  type Language,
} from "../lib/patientform";
import { builderI18n } from "../lib/translations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "9forms.com — Smart Conversational Form Builder & AI Workflows" },
      {
        name: "description",
        content:
          "9forms.com is a next-gen conversational form builder: one question at a time, auto-advance navigation, native multilingual voice input, instant risk scoring and automated operations.",
      },
    ],
  }),
  component: BuilderLandingPage,
});

interface CheckoutPlanDetails {
  key: string;
  name: string;
  amount: string;
  periodText: string;
  features: string[];
}

function BuilderLandingPage() {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const [researchOpen, setResearchOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(true);
  const [heroOption, setHeroOption] = useState<number>(0);
  const [heroSubmissions, setHeroSubmissions] = useState<number>(23);

  // Checkout modal state
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<CheckoutPlanDetails | null>(null);

  useEffect(() => {
    setLanguage(getStoredLanguage());
    return onLanguageChange(setLanguage);
  }, []);

  const handleLang = (next: Language) => {
    setStoredLanguage(next);
    setLanguage(next);
  };

  const handleHeroSelect = (idx: number) => {
    setHeroOption(idx);
    setHeroSubmissions((prev) => prev + 1);
  };

  const openCheckout = (planKey: string) => {
    const isAnnual = isYearly;
    const curT = builderI18n[language] ?? builderI18n.en;
    if (planKey === "basic") {
      setSelectedPlan({
        key: isAnnual ? "basic_yearly" : "basic_monthly",
        name: `${curT.tierBasicName} (${isAnnual ? curT.pricingYearly : curT.pricingMonthly})`,
        amount: isAnnual ? "$300.00" : "$29.00",
        periodText: isAnnual ? curT.pricingBasicYearlyNote : curT.pricingMonthlyNote,
        features: [curT.tierBasicF1, curT.tierBasicF2, curT.tierBasicF3],
      });
    } else if (planKey === "plus") {
      setSelectedPlan({
        key: isAnnual ? "plus_yearly" : "plus_monthly",
        name: `${curT.tierPlusName} (${isAnnual ? curT.pricingYearly : curT.pricingMonthly})`,
        amount: isAnnual ? "$600.00" : "$59.00",
        periodText: isAnnual ? curT.pricingPlusYearlyNote : curT.pricingMonthlyNote,
        features: [curT.tierPlusF1, curT.tierPlusF2, curT.tierPlusF3, curT.tierPlusF4],
      });
    } else if (planKey === "business") {
      setSelectedPlan({
        key: isAnnual ? "business_yearly" : "business_monthly",
        name: `${curT.tierBizName} (${isAnnual ? curT.pricingYearly : curT.pricingMonthly})`,
        amount: isAnnual ? "$996.00" : "$99.00",
        periodText: isAnnual ? curT.pricingBizYearlyNote : curT.pricingMonthlyNote,
        features: [
          curT.tierBizF1,
          curT.tierBizF2,
          curT.tierBizF3,
          curT.tierBizF4,
          curT.tierBizF5,
        ],
      });
    }
    setCheckoutOpen(true);
  };

  const t = builderI18n[language] ?? builderI18n.en;

  return (
    <div className="marketing-page">
      {/* ── Fixed Blur Navigation ────────────────────── */}
      <header className="marketing-header">
        <div className="marketing-nav">
          <PlatformMark />
          <nav className="marketing-links" aria-label="Main navigation">
            <a href="#demo">{t.navDemo}</a>
            <a href="#features">{t.navFeatures}</a>
            <a href="#how">{t.howKicker}</a>
            <a href="#admin">{t.adminKicker}</a>
            <a href="#pricing">{t.navPricing}</a>
            <a href="/admin.html" className="nav-admin-link">
              {t.navAdmin}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher value={language} onChange={handleLang} compact />
            <a className="button-primary button-nav" href="#demo">
              {t.navCta} <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── Motionsites Hero Section ─────────────────── */}
        <section className="hero-section">
          <div className="hero-aurora hero-aurora-one" />
          <div className="hero-aurora hero-aurora-two" />
          <div className="hero-grid">
            <div className="hero-copy reveal-up">
              <div className="eyebrow-pill">
                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                <span>{t.badge}</span>
              </div>
              <h1>
                {t.heroH1Pre} <span className="hero-gradient-text">{t.heroH1Span}</span>
              </h1>
              <p className="hero-lead">{t.heroLead}</p>

              <div className="hero-actions">
                <a className="button-primary button-lg hero-glow-btn" href="#demo">
                  {t.heroCtaPrimary} <ArrowRight size={18} />
                </a>
                <a className="button-secondary button-lg" href="/admin.html">
                  {t.heroCtaSecondary}
                </a>
              </div>

              <div className="hero-trust-row">
                <div className="trust-item">
                  <Check size={15} className="trust-check" />
                  <span>{t.trustNoApp}</span>
                </div>
                <div className="trust-item">
                  <Check size={15} className="trust-check" />
                  <span>EN · ID · 中文</span>
                </div>
                <div className="trust-item">
                  <Check size={15} className="trust-check" />
                  <span>{t.trustVoice}</span>
                </div>
              </div>
            </div>

            {/* Interactive Live Hero Card (Motionsites signature) */}
            <div className="sf-hero-mock reveal-scale" aria-label="9forms.com live form preview">
              <div className="sf-responses-note hero-note">
                <div className="pulse-indicator" />
                <BarChart3 size={17} />
                <span>
                  <strong>
                    {heroSubmissions}{" "}
                    {language === "id"
                      ? "jawaban baru"
                      : language === "zh"
                        ? "份新提交"
                        : "new submissions"}
                  </strong>
                  <small>{t.mockResponsesSub}</small>
                </span>
              </div>

              <div className="sf-mock-card">
                <div className="sf-mock-topline">
                  <img
                    src="/logo-white.png?v=9f_v2"
                    alt="9forms"
                    className="h-[20px] w-auto object-contain select-none"
                    loading="eager"
                  />
                  <div className="sf-mock-voice-pill">
                    <Mic size={13} className="text-emerald-500" />
                    <span>{t.liveVoice}</span>
                  </div>
                </div>

                <div className="sf-mock-progress">
                  <span
                    style={{
                      width: heroOption === 0 ? "35%" : heroOption === 1 ? "70%" : "95%",
                    }}
                  />
                </div>

                <div className="sf-mock-question">{t.mockQuestion}</div>

                <div className="sf-mock-options">
                  <button
                    type="button"
                    className={`sf-mock-opt-btn ${heroOption === 0 ? "selected" : ""}`}
                    onClick={() => handleHeroSelect(0)}
                  >
                    <i>{heroOption === 0 ? <Check size={16} strokeWidth={3.5} /> : "A"}</i>
                    <span>{t.mockOpt1}</span>
                  </button>
                  <button
                    type="button"
                    className={`sf-mock-opt-btn ${heroOption === 1 ? "selected" : ""}`}
                    onClick={() => handleHeroSelect(1)}
                  >
                    <i>{heroOption === 1 ? <Check size={16} strokeWidth={3.5} /> : "B"}</i>
                    <span>{t.mockOpt2}</span>
                  </button>
                  <button
                    type="button"
                    className={`sf-mock-opt-btn ${heroOption === 2 ? "selected" : ""}`}
                    onClick={() => handleHeroSelect(2)}
                  >
                    <i>{heroOption === 2 ? <Check size={16} strokeWidth={3.5} /> : "C"}</i>
                    <span>{t.mockOpt3}</span>
                  </button>
                </div>

                <div className="sf-mock-auto">
                  <Zap size={14} className="text-amber-500" /> {t.mockAuto}
                </div>
              </div>

              <div className="sf-mock-voice">
                <span className="sf-voice-orb">
                  <Mic size={17} />
                  <i />
                  <b />
                </span>
                <span>
                  <strong>{t.mockVoiceTitle}</strong>
                  <small>{t.mockVoiceSub}</small>
                </span>
              </div>
            </div>
          </div>

          {/* Hero Proof Metrics Strip */}
          <div className="hero-proof-strip">
            <div className="proof-tile">
              <span>{t.proof1Number}</span>
              <strong>{t.proof1Title}</strong>
              <small>{t.proof1Sub}</small>
            </div>
            <div className="proof-tile">
              <span>{t.proof2Number}</span>
              <strong>{t.proof2Title}</strong>
              <small>{t.proof2Sub}</small>
            </div>
            <div className="proof-tile">
              <span>{t.proof3Number}</span>
              <strong>{t.proof3Title}</strong>
              <small>{t.proof3Sub}</small>
            </div>
            <div className="proof-tile">
              <span>{t.proof4Number}</span>
              <strong>{t.proof4Title}</strong>
              <small>{t.proof4Sub}</small>
            </div>
          </div>
        </section>

        {/* ── Demo Showcase (Exactly 3 Official Active Forms) ── */}
        <section className="section-shell sf-section-blue" id="demo">
          <div className="section-title-row">
            <div className="section-kicker">{t.demoKicker}</div>
            <h2>
              {t.demoTitle1}
              <br />
              <span className="hero-gradient-text">{t.demoTitle2}</span>
            </h2>
            <p>{t.demoDesc}</p>
          </div>

          <div className="sf-demo-grid">
            {/* Card 1: New Patient Intake */}
            <article className="sf-demo-card">
              <div className="sf-demo-top">
                <span className="sf-demo-badge">{t.demo1Badge}</span>
                <h3>{t.demo1Title}</h3>
                <p>{t.demo1Desc}</p>
              </div>
              <div className="sf-demo-body">
                <ul className="sf-demo-features">
                  <li>
                    <Check size={16} /> {t.demo1F1}
                  </li>
                  <li>
                    <Check size={16} /> {t.demo1F2}
                  </li>
                  <li>
                    <Check size={16} /> {t.demo1F3}
                  </li>
                </ul>
                <div className="sf-demo-cta">
                  <Link
                    className="button-primary button-lg"
                    to="/intake"
                    search={{ form: "new-patient-intake" }}
                  >
                    {t.demo1Cta} <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 2: Knee Pain Assessment */}
            <article className="sf-demo-card">
              <div className="sf-demo-top demo-alt">
                <span className="sf-demo-badge">{t.demo2Badge}</span>
                <h3>{t.demo2Title}</h3>
                <p>{t.demo2Desc}</p>
              </div>
              <div className="sf-demo-body">
                <ul className="sf-demo-features">
                  <li>
                    <Check size={16} /> {t.demo2F1}
                  </li>
                  <li>
                    <Check size={16} /> {t.demo2F2}
                  </li>
                  <li>
                    <Check size={16} /> {t.demo2F3}
                  </li>
                </ul>
                <div className="sf-demo-cta">
                  <Link
                    className="button-primary button-lg"
                    to="/intake"
                    search={{ form: "knee-pain-assessment" }}
                  >
                    {t.demo2Cta} <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </article>

            {/* Card 3: Senior-Friendly Warm Charcoal & Gold Theme */}
            <article className="sf-demo-card card-elderly">
              <div className="sf-demo-top demo-elderly">
                <span className="sf-demo-badge">{t.demo3Badge}</span>
                <h3>{t.demo3Title}</h3>
                <p>{t.demo3Desc}</p>
              </div>
              <div className="sf-demo-body">
                <ul className="sf-demo-features">
                  <li>
                    <Check size={16} /> {t.demo3F1}
                  </li>
                  <li>
                    <Check size={16} /> {t.demo3F2}
                  </li>
                  <li>
                    <Check size={16} /> {t.demo3F3}
                  </li>
                </ul>
                <div className="sf-demo-cta">
                  <Link
                    className="button-primary button-lg"
                    to="/intake"
                    search={{ form: "elderly-friendly-intake" }}
                  >
                    {t.demo3Cta} <ArrowRight size={18} />
                  </Link>
                  <button
                    type="button"
                    className="sf-research-anchor"
                    onClick={() => setResearchOpen(true)}
                  >
                    <BookOpen size={14} />
                    <span>{t.demo3ResearchLink}</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── Modern Bento Grid Feature Showcase (Balanced 3x2 Grid) ── */}
        <section className="section-shell section-light" id="features">
          <div className="section-title-row">
            <div className="section-kicker">{t.featKicker}</div>
            <h2>
              {t.featTitle1}
              <br />
              <span className="hero-gradient-text">{t.featTitle2}</span>
            </h2>
            <p>{t.featDesc}</p>
          </div>

          <div className="bento-grid">
            {/* Bento 1: Voice Intelligence */}
            <article className="bento-card">
              <div className="bento-badge">
                <Mic size={14} /> {t.f3Label}
              </div>
              <h3>{t.f3Title}</h3>
              <p>{t.f3Desc}</p>
              <div className="bento-waveform-mock">
                <div className="wave-bar h-4" />
                <div className="wave-bar h-8" />
                <div className="wave-bar h-12" />
                <div className="wave-bar h-6" />
                <div className="wave-bar h-14" />
                <div className="wave-bar h-10" />
                <div className="wave-bar h-5" />
                <span className="text-xs font-semibold text-emerald-700 ml-2">
                  {language === "id"
                    ? "“Nyeri skala tujuh” → "
                    : language === "zh"
                      ? "“七分疼痛” → "
                      : "“Seven out of ten pain” → "}
                  <strong>
                    {language === "id" ? "7 poin" : language === "zh" ? "7 分" : "7 pts"}
                  </strong>
                </span>
              </div>
            </article>

	            {/* Bento 2: Frictionless Auto-Advance */}
	            <article className="bento-card">
	              <div className="bento-badge">
	                <Zap size={14} /> {t.f2Label}
	              </div>
	              <h3>{t.f2Title}</h3>
	              <p>{t.f2Desc}</p>
	              <div className="bento-mini-demo">
	                <div className="mini-choice-pill active">
	                  <Check size={13} /> {t.mockOpt1}
	                </div>
	                <div className="mini-auto-tag">{t.autoAdvanceSpeed}</div>
	              </div>
	            </article>

	            {/* Bento 3: One Question Focus */}
	            <article className="bento-card">
	              <div className="bento-badge">
	                <Smartphone size={14} /> {t.f1Label}
	              </div>
	              <h3>{t.f1Title}</h3>
	              <p>{t.f1Desc}</p>
	            </article>

	            {/* Bento 4: Trilingual Sync */}
	            <article className="bento-card">
	              <div className="bento-badge">
	                <Languages size={14} /> {t.f4Label}
	              </div>
	              <h3>{t.f4Title}</h3>
	              <p>{t.f4Desc}</p>
	              <div className="bento-lang-pills">
	                <span className="lang-tag">English</span>
	                <span className="lang-tag">Bahasa Indonesia</span>
	                <span className="lang-tag">简体中文</span>
	              </div>
	            </article>

	            {/* Bento 5: Universal AI Ingestion */}
	            <article className="bento-card">
	              <div className="bento-badge">
	                <FileText size={14} /> {t.f5DocLabel}
	              </div>
	              <h3>{t.f5DocTitle}</h3>
	              <p>{t.f5DocDesc}</p>
	            </article>

	            {/* Bento 6: Operations Hub & Clinical Data */}
	            <article className="bento-card">
	              <div className="bento-badge">
	                <LayoutDashboard size={14} /> {t.f5Label}
	              </div>
	              <h3>{t.f5Title}</h3>
	              <p>{t.f5Desc}</p>
	              <div className="bento-table-preview">
	                <div className="bento-table-row">
	                  <span>
	                    <strong>Opa Sutrisno</strong> · {language === "id" ? "Lutut" : language === "zh" ? "膝部" : "Knee"}
	                  </span>
	                  <span className="pill pill-amber">{t.riskModerate}</span>
	                  <span className="text-xs text-slate-500">{language === "id" ? "18 poin" : language === "zh" ? "18 分" : "18 pts"}</span>
	                </div>
	                <div className="bento-table-row">
	                  <span>
	                    <strong>Tan Wei Ling</strong> · {language === "id" ? "Panggul" : language === "zh" ? "髋部" : "Hip"}
	                  </span>
	                  <span className="pill pill-red">{t.riskHigh}</span>
	                  <span className="text-xs text-slate-500">{language === "id" ? "32 poin" : language === "zh" ? "32 分" : "32 pts"}</span>
	                </div>
	              </div>
	            </article>
          </div>
        </section>

        {/* ── 3-Step Workflow ──────────────────────────── */}
        <section className="section-shell workflow-section" id="how">
          <div className="workflow-heading">
            <div>
              <div className="section-kicker section-kicker-dark">{t.howKicker}</div>
              <h2>{t.howTitle}</h2>
            </div>
            <p>{t.howDesc}</p>
          </div>
          <div className="workflow-grid">
            {[
              { icon: PenLine, num: "01", title: t.step1Title, desc: t.step1Desc },
              { icon: Share2, num: "02", title: t.step2Title, desc: t.step2Desc },
              { icon: BarChart3, num: "03", title: t.step3Title, desc: t.step3Desc },
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
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Admin Dashboard Preview ──────────────────── */}
        <section className="section-shell section-light" id="admin">
          <div className="admin-preview-section">
            <div className="admin-preview-copy">
              <div className="section-kicker">{t.adminKicker}</div>
              <h2>
                {t.adminTitle1}
                <br />
                <span className="hero-gradient-text">{t.adminTitle2}</span>
              </h2>
              <p>{t.adminDesc}</p>
              <ul className="sf-admin-list">
                <li>
                  <Check size={15} /> {t.adminB1}
                </li>
                <li>
                  <Check size={15} /> {t.adminB2}
                </li>
                <li>
                  <Check size={15} /> {t.adminB3}
                </li>
                <li>
                  <Check size={15} /> {t.adminB4}
                </li>
              </ul>
              <a className="button-primary button-lg" href="/admin.html">
                {t.adminCta} <ArrowRight size={18} />
              </a>
            </div>

            <div className="admin-browser-mock" aria-hidden="true">
              <div className="browser-bar">
                <span />
                <span />
                <span />
                <small>9forms.com/admin</small>
              </div>
              <div className="browser-body">
                <aside>
                  <div className="browser-logo">
                    <LayoutDashboard size={14} />
                  </div>
                  <i className="active" />
                  <i />
                  <i />
                  <i />
                  <i />
                </aside>
	                <div className="browser-main">
	                  <div className="browser-title">
	                    <span>{t.adminMockTitle}</span>
	                    <span className="browser-new-btn">{t.adminMockNewBtn}</span>
	                  </div>
	                  <div className="browser-stats">
	                    <div>
	                      <strong>23</strong>
	                      <small>{t.adminStat1}</small>
	                    </div>
	                    <div>
	                      <strong>4</strong>
	                      <small>{t.adminStat2}</small>
	                    </div>
	                    <div>
	                      <strong>41</strong>
	                      <small>{t.adminStat3}</small>
	                    </div>
	                  </div>
	                  <div className="browser-table">
	                    <div className="browser-table-head">
	                      <span>{t.adminColName}</span>
	                      <span>{t.adminColSubmitted}</span>
	                      <span>{t.adminColRisk}</span>
	                    </div>
	                    <div>
	                      <span>
	                        <b>S</b> Opa Sutrisno
	                      </span>
	                      <span>03 Sep, 12:10</span>
	                      <span className="risk-moderate">{t.riskModerate}</span>
	                    </div>
	                    <div>
	                      <span>
	                        <b>T</b> Tan Wei Ling
	                      </span>
	                      <span>03 Sep, 11:14</span>
	                      <span className="risk-high">{t.riskHigh}</span>
	                    </div>
	                    <div>
	                      <span>
	                        <b>A</b> Aisha Rahman
	                      </span>
	                      <span>03 Sep, 10:41</span>
	                      <span className="risk-moderate">{t.riskModerate}</span>
	                    </div>
	                    <div>
	                      <span>
	                        <b>L</b> Lim Jia Hao
	                      </span>
	                      <span>02 Sep, 17:22</span>
	                      <span className="risk-low">{t.riskLow}</span>
	                    </div>
	                  </div>
	                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing Section with Interactive Checkout ── */}
        <section className="section-shell sf-section-pricing" id="pricing">
          <div className="section-title-row">
            <div className="section-kicker">{t.pricingKicker}</div>
            <h2>
              {t.pricingTitle1}
              <br />
              <span className="hero-gradient-text">{t.pricingTitle2}</span>
            </h2>
            <p>{t.pricingDesc}</p>
          </div>

          <div className="pricing-toggle-wrap">
            <button
              type="button"
              className={`pricing-toggle-btn ${!isYearly ? "active" : ""}`}
              onClick={() => setIsYearly(false)}
            >
              {t.pricingMonthly}
            </button>
            <button
              type="button"
              className={`pricing-toggle-btn ${isYearly ? "active" : ""}`}
              onClick={() => setIsYearly(true)}
            >
              <span>{t.pricingYearly}</span>
              <span className="pricing-save-pill">{t.pricingSave}</span>
            </button>
          </div>

          <div className="pricing-grid">
            {/* Basic Tier */}
            <article className="pricing-card">
              <div className="pricing-header">
                <h3>{t.tierBasicName}</h3>
                <p>{t.tierBasicDesc}</p>
                <div className="pricing-figure">
                  <div className="pricing-figure-top">
                    <span className="pricing-amount">
                      {isYearly ? t.tierBasicPriceYearly : t.tierBasicPriceMonthly}
                    </span>
                    <span className="pricing-period">{t.tierBasicPeriod}</span>
                  </div>
                  <span className="pricing-subnote">
                    {isYearly ? t.pricingBasicYearlyNote : t.pricingMonthlyNote}
                  </span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={16} /> {t.tierBasicF1}
                </li>
                <li>
                  <Check size={16} /> {t.tierBasicF2}
                </li>
                <li>
                  <Check size={16} /> {t.tierBasicF3}
                </li>
              </ul>
              <div className="pricing-cta-wrap">
                <button
                  type="button"
                  className="button-secondary pricing-cta-btn w-full justify-center"
                  onClick={() => openCheckout("basic")}
                >
                  {t.tierBasicCta}
                </button>
              </div>
            </article>

            {/* Plus Tier */}
            <article className="pricing-card pricing-card-popular">
              <div className="pricing-badge">{t.tierPlusBadge}</div>
              <div className="pricing-header">
                <h3>{t.tierPlusName}</h3>
                <p>{t.tierPlusDesc}</p>
                <div className="pricing-figure">
                  <div className="pricing-figure-top">
                    <span className="pricing-amount">
                      {isYearly ? t.tierPlusPriceYearly : t.tierPlusPriceMonthly}
                    </span>
                    <span className="pricing-period">{t.tierPlusPeriod}</span>
                  </div>
                  <span className="pricing-subnote">
                    {isYearly ? t.pricingPlusYearlyNote : t.pricingMonthlyNote}
                  </span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={16} /> {t.tierPlusF1}
                </li>
                <li>
                  <Check size={16} /> {t.tierPlusF2}
                </li>
                <li>
                  <Check size={16} /> {t.tierPlusF3}
                </li>
                <li>
                  <Check size={16} /> {t.tierPlusF4}
                </li>
              </ul>
              <div className="pricing-cta-wrap">
                <button
                  type="button"
                  className="button-primary pricing-cta-btn w-full justify-center"
                  onClick={() => openCheckout("plus")}
                >
                  {t.tierPlusCta}
                </button>
              </div>
            </article>

            {/* Business Tier (Level Max) */}
            <article className="pricing-card pricing-card-featured">
              <div className="pricing-badge pricing-badge-featured">{t.tierBizBadge}</div>
              <div className="pricing-header">
                <h3>{t.tierBizName}</h3>
                <p>{t.tierBizDesc}</p>
                <div className="pricing-figure">
                  <div className="pricing-figure-top">
                    <span className="pricing-amount">
                      {isYearly ? t.tierBizPriceYearly : t.tierBizPriceMonthly}
                    </span>
                    <span className="pricing-period">{t.tierBizPeriod}</span>
                  </div>
                  <span className="pricing-subnote">
                    {isYearly ? t.pricingBizYearlyNote : t.pricingMonthlyNote}
                  </span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={16} /> {t.tierBizF1}
                </li>
                <li>
                  <Check size={16} /> {t.tierBizF2}
                </li>
                <li>
                  <Check size={16} /> {t.tierBizF3}
                </li>
                <li>
                  <Check size={16} /> {t.tierBizF4}
                </li>
                <li>
                  <Check size={16} /> {t.tierBizF5}
                </li>
              </ul>
              <div className="pricing-cta-wrap">
                <button
                  type="button"
                  className="button-primary pricing-cta-btn btn-biz-highlight w-full justify-center"
                  onClick={() => openCheckout("business")}
                >
                  {t.tierBizCta} <ArrowRight size={16} />
                </button>
              </div>
            </article>

            {/* Enterprise Tier */}
            <article className="pricing-card">
              <div className="pricing-header">
                <h3>{t.tierEntName}</h3>
                <p>{t.tierEntDesc}</p>
                <div className="pricing-figure">
                  <div className="pricing-figure-top">
                    <span className="pricing-amount pricing-amount-custom">{t.tierEntPrice}</span>
                    <span className="pricing-period">{t.tierEntPeriod}</span>
                  </div>
                  <span className="pricing-subnote">{t.pricingEntNote}</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li>
                  <Check size={16} /> {t.tierEntF1}
                </li>
                <li>
                  <Check size={16} /> {t.tierEntF2}
                </li>
                <li>
                  <Check size={16} /> {t.tierEntF3}
                </li>
              </ul>
              <div className="pricing-cta-wrap">
                <a
                  className="button-secondary pricing-cta-btn"
                  href="mailto:contact@9forms.com?subject=Enterprise%20Plan%20Inquiry%20-%209forms.com"
                >
                  {t.tierEntCta}
                </a>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* ── Closing CTA ──────────────────────────────── */}
      <section className="closing-cta">
        <div className="closing-orb closing-orb-one" />
        <div className="closing-orb closing-orb-two" />
        <div className="closing-content">
          <div className="eyebrow-pill eyebrow-pill-dark">
            <Sparkles size={14} className="text-amber-400" />
            <span>{t.closingBadge}</span>
          </div>
          <h2>{t.closingTitle}</h2>
          <p>{t.closingDesc}</p>
          <a className="button-white button-lg" href="#demo">
            {t.closingCta} <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ── Enterprise Multi-Column Footer ───────────── */}
      <footer className="marketing-footer">
        <div className="marketing-footer-inner">
          <div className="footer-top-grid">
            {/* Column 1: Brand & Security */}
            <div className="footer-brand-col">
              <PlatformMark size="md" inverse={true} />
              <p>{t.footerNote}</p>
              <div className="footer-status-badge">
                <span className="footer-status-dot" />
                <span>
                  {language === "id"
                    ? "Sistem Beroperasi · 99.99% Uptime"
                    : language === "zh"
                      ? "系统正常运行 · 99.99% 在线率"
                      : "System Operational · 99.99% Uptime"}
                </span>
              </div>
              <div className="footer-security-pill">
                <span>
                  🔒{" "}
                  {language === "id"
                    ? "ISO/IEC 27001 · Siap HIPAA · Enkripsi AES-256"
                    : language === "zh"
                      ? "ISO/IEC 27001 · HIPAA 合规准备 · AES-256 加密"
                      : "ISO/IEC 27001 · HIPAA Ready · AES-256"}
                </span>
              </div>
            </div>

            {/* Column 2: Product Capabilities */}
            <div className="footer-col">
              <h4>{language === "id" ? "Produk" : language === "zh" ? "产品功能" : "Product"}</h4>
              <ul>
                <li><a href="#demo">{language === "id" ? "Formulir Interaktif" : language === "zh" ? "互动式表单构建" : "Conversational Form Builder"}</a></li>
                <li><a href="#features">{language === "id" ? "Pengenalan Suara AI" : language === "zh" ? "多语言语音输入 AI" : "Voice AI Speech Recognition"}</a></li>
                <li><a href="#features">{language === "id" ? "Pemindai Dokumen PDF & Kertas" : language === "zh" ? "纸质与 PDF AI 解析" : "AI Document & PDF Scanner"}</a></li>
                <li><a href="#admin">{language === "id" ? "Skor Triase Otomatis" : language === "zh" ? "临床风险智能分诊" : "Clinical Risk Scoring & Triage"}</a></li>
                <li><a href="#admin">{language === "id" ? "Integrasi EMR & Webhook" : language === "zh" ? "医疗 EMR 与 Webhook 接口" : "EMR Plato & Webhook Bridge"}</a></li>
              </ul>
            </div>

            {/* Column 3: Solutions */}
            <div className="footer-col">
              <h4>{language === "id" ? "Solusi Industri" : language === "zh" ? "行业解决方案" : "Solutions"}</h4>
              <ul>
                <li><a href="#demo">{language === "id" ? "Klinik & Layanan Kesehatan" : language === "zh" ? "医疗诊所与健康机构" : "Clinics & Healthcare"}</a></li>
                <li><a href="#demo">{language === "id" ? "Aksesibilitas Ramah Lansia" : language === "zh" ? "长者关怀与高对比度体验" : "Senior Care & Accessibility"}</a></li>
                <li><a href="#demo">{language === "id" ? "Pendidikan & Pendaftaran Siswa" : language === "zh" ? "教育培训与招生报名" : "Education & Admissions"}</a></li>
                <li><a href="#demo">{language === "id" ? "HR & Skrining Kandidat" : language === "zh" ? "HR 招聘与人才初筛" : "HR & Talent Screening"}</a></li>
                <li><a href="#demo">{language === "id" ? "Survei & Riset Kepuasan" : language === "zh" ? "高转化满意度调研" : "Customer Surveys & Intake"}</a></li>
              </ul>
            </div>

            {/* Column 4: Platform & Support */}
            <div className="footer-col">
              <h4>{language === "id" ? "Platform & Bantuan" : language === "zh" ? "平台与支持" : "Platform"}</h4>
              <ul>
                <li><a href="#demo">{language === "id" ? "3 Demo Interaktif Langsung" : language === "zh" ? "3 套实时交互演示" : "Live Interactive Demos"}</a></li>
                <li><a href="#pricing">{language === "id" ? "Paket Harga Transparan" : language === "zh" ? "透明公开定价方案" : "Pricing & Volume Plans"}</a></li>
                <li><a href="#admin">{language === "id" ? "Dasbor Admin Operasional" : language === "zh" ? "管理工作区仪表盘" : "Admin Operations Portal"}</a></li>
                <li><a href="/intake">{language === "id" ? "Portal Responden Pasien" : language === "zh" ? "患者答题独立入口" : "Patient Intake Portal"}</a></li>
                <li><a href="mailto:support@9forms.com">{language === "id" ? "Hubungi Dukungan Prioritas" : language === "zh" ? "联系技术支持团队" : "Contact Enterprise Support"}</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <div>
              &copy; 2026 <strong>9forms.com</strong>. {language === "id" ? "Hak cipta dilindungi undang-undang." : language === "zh" ? "版权所有。" : "All rights reserved."}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <a href="#demo">{language === "id" ? "Privasi & Keamanan" : language === "zh" ? "隐私与安全" : "Privacy & Security"}</a>
              <span>·</span>
              <a href="#demo">{language === "id" ? "Syarat & Ketentuan" : language === "zh" ? "服务条款" : "Terms of Service"}</a>
              <span>·</span>
              <a href="/admin.html#/settings">{language === "id" ? "Pengaturan Sistem" : language === "zh" ? "系统设置" : "System Settings"}</a>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11.5px", color: "#64748b" }}>Lang:</span>
              <button
                type="button"
                className={`lang-btn ${language === "en" ? "active" : ""}`}
                style={{ background: "rgba(255,255,255,0.06)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.12)", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`lang-btn ${language === "id" ? "active" : ""}`}
                style={{ background: "rgba(255,255,255,0.06)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.12)", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                onClick={() => setLanguage("id")}
              >
                ID
              </button>
              <button
                type="button"
                className={`lang-btn ${language === "zh" ? "active" : ""}`}
                style={{ background: "rgba(255,255,255,0.06)", color: "#f8fafc", border: "1px solid rgba(255,255,255,0.12)", padding: "2px 6px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}
                onClick={() => setLanguage("zh")}
              >
                中文
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ── PayPal & Instant Checkout Modal ────────────────────── */}
      {checkoutOpen && selectedPlan && (
        <PaypalCheckoutModal
          plan={selectedPlan}
          language={language}
          onClose={() => setCheckoutOpen(false)}
        />
      )}

      {/* ── Senior Research Study Modal Popup ────────────────── */}
      {researchOpen && <SeniorResearchModal onClose={() => setResearchOpen(false)} />}
    </div>
  );
}

function PaypalCheckoutModal({
  plan,
  language = "en",
  onClose,
}: {
  plan: CheckoutPlanDetails;
  language?: AppLanguage;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const curT = builderI18n[language] || builderI18n.en;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    let isMounted = true;
    async function loadGateway() {
      try {
        setLoading(true);
        setErrorMsg("");
        const res = await fetch(`/api/checkout/paypal?plan=${encodeURIComponent(plan.key)}`);
        const data = (await res.json().catch(() => ({}))) as {
          success?: boolean;
          clientId?: string;
          isConfigured?: boolean;
          message?: string;
        };

        const resolvedClientId = data.clientId || "sb";

        // Load PayPal SDK dynamically
        const scriptId = "paypal-sdk-script";
        const existingScript = document.getElementById(scriptId);
        if (existingScript) existingScript.remove();

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(resolvedClientId)}&currency=USD&intent=capture`;
        script.async = true;
        script.onload = () => {
          if (isMounted) {
            setSdkReady(true);
            setLoading(false);
          }
        };
        script.onerror = () => {
          if (isMounted) {
            setErrorMsg("Could not load secure PayPal gateway. Please try again.");
            setLoading(false);
          }
        };
        document.body.appendChild(script);
      } catch {
        if (isMounted) {
          setErrorMsg("Network error connecting to payment gateway.");
          setLoading(false);
        }
      }
    }
    loadGateway();
    return () => {
      isMounted = false;
    };
  }, [plan.key]);

  // Render PayPal Buttons when SDK and container are ready
  useEffect(() => {
    if (!sdkReady) return;
    const container = document.getElementById("paypal-button-render-box");
    if (!container) return;
    container.innerHTML = "";

    const win = window as unknown as {
      paypal?: {
        Buttons: (options: Record<string, unknown>) => {
          render: (el: HTMLElement | string) => Promise<void>;
        };
      };
    };

    if (!win.paypal) return;

    win.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
          height: 44,
        },
        onClick: (_data: unknown, actions: { reject: () => Promise<void>; resolve: () => Promise<void> }) => {
          if (!email || !email.includes("@")) {
            setErrorMsg(
              language === "id"
                ? "Harap masukkan alamat email akun Anda."
                : language === "zh"
                  ? "请输入您的账户电子邮箱。"
                  : "Please enter your account email address first.",
            );
            const input = document.getElementById("checkout-email-input");
            if (input) input.focus();
            return actions.reject();
          }
          if (!password || password.length < 6) {
            setErrorMsg(
              language === "id"
                ? "Harap buat kata sandi akun (minimal 6 karakter)."
                : language === "zh"
                  ? "请设置登录密码（至少 6 个字符）。"
                  : "Please create a password with at least 6 characters.",
            );
            const input = document.getElementById("checkout-pass-input");
            if (input) input.focus();
            return actions.reject();
          }
          setErrorMsg("");
          return actions.resolve();
        },
        createOrder: async () => {
          setErrorMsg("");
          const res = await fetch("/api/checkout/paypal", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "create-order",
              planKey: plan.key,
            }),
          });
          const d = (await res.json().catch(() => ({}))) as { success?: boolean; orderId?: string; message?: string };
          if (!d.success || !d.orderId) {
            setErrorMsg(d.message || "Could not initialize order with PayPal.");
            throw new Error("Order creation failed");
          }
          return d.orderId;
        },
        onApprove: async (data: { orderID: string }) => {
          setLoading(true);
          try {
            const res = await fetch("/api/checkout/paypal", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "capture-order",
                orderId: data.orderID,
                planKey: plan.key,
                email,
                password,
              }),
            });
            const d = (await res.json().catch(() => ({}))) as {
              success?: boolean;
              message?: string;
              user?: { email: string };
            };
            if (res.ok && d.success) {
              setSuccessMsg(
                language === "id"
                  ? `🎉 Pembayaran berhasil! Akun Anda aktif. Mengalihkan ke dasbor...`
                  : language === "zh"
                    ? `🎉 支付成功！方案已激活，正在跳转至管理工作区...`
                    : `🎉 Payment successful! Welcome ${d.user?.email || email}. Redirecting to your dashboard...`,
              );
              setTimeout(() => {
                window.location.href = "/business.html#/dashboard";
              }, 1500);
            } else {
              setErrorMsg(d.message || "Payment capture failed. Please contact support.");
              setLoading(false);
            }
          } catch {
            setErrorMsg("Network error verifying your payment.");
            setLoading(false);
          }
        },
        onError: (err: unknown) => {
          console.error("PayPal button error", err);
          setErrorMsg(
            language === "id"
              ? "Transaksi dibatalkan atau terjadi gangguan."
              : language === "zh"
                ? "支付被取消或发生错误。"
                : "Payment transaction was cancelled or encountered an error.",
          );
        },
      })
      .render("#paypal-button-render-box");
  }, [sdkReady, email, password, plan.key, curT, language]);

  return (
    <div
      className="senior-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="checkout-modal-card">
        {/* Header */}
        <div className="checkout-modal-header">
          <div>
            <div className="senior-modal-kicker">
              <Lock size={12} />
              <span>{curT.checkoutSecure}</span>
            </div>
            <h3>{curT.checkoutSubscribe}</h3>
          </div>
          <button
            type="button"
            className="senior-modal-close"
            onClick={onClose}
            aria-label="Close checkout modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="checkout-modal-body">
          {/* Plan Summary Card */}
          <div className="checkout-plan-summary">
            <div>
              <div className="checkout-plan-title">{plan.name}</div>
              <div className="checkout-plan-meta">{plan.periodText}</div>
            </div>
            <div className="text-right">
              <div className="checkout-plan-price">{plan.amount}</div>
              <div className="checkout-plan-period">USD / cycle</div>
            </div>
          </div>

          {/* Features list */}
          <ul className="showcase-features" style={{ margin: "0 0 8px 0", gap: "6px" }}>
            {plan.features.map((f, i) => (
              <li key={i} style={{ fontSize: "12px" }}>
                <Check size={14} className="text-teal-600 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          {/* Step 1: Create Account Credentials */}
          <div style={{ marginTop: "12px", marginBottom: "6px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1e293b", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", background: "#2563eb", color: "#fff", fontSize: "11px" }}>1</span>
              <span>{language === "id" ? "Buat Akun Login 9forms Anda" : language === "zh" ? "创建您的 9forms 登录账户" : "Create Your 9forms Login"}</span>
            </div>

            <div className="checkout-form-group">
              <label htmlFor="checkout-email-input">
                {curT.checkoutEmailLabel} <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                id="checkout-email-input"
                type="email"
                placeholder={curT.checkoutEmailPlaceholder}
                className="checkout-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="checkout-form-group">
              <label htmlFor="checkout-pass-input">
                {curT.checkoutPassLabel} <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                id="checkout-pass-input"
                type="password"
                placeholder={curT.checkoutPassPlaceholder}
                className="checkout-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Status notices */}
          {errorMsg && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                padding: "10px 14px",
                borderRadius: "10px",
                fontSize: "12.5px",
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#15803d",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: "12px",
              }}
            >
              {successMsg}
            </div>
          )}

          {/* Step 2: Payment Gateway */}
          <div style={{ marginTop: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "#1e293b", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "20px", height: "20px", borderRadius: "50%", background: "#2563eb", color: "#fff", fontSize: "11px" }}>2</span>
              <span>{language === "id" ? "Pilih Metode Pembayaran" : language === "zh" ? "选择支付方式" : "Select Payment Method"}</span>
            </div>

            {loading && !sdkReady && !errorMsg && (
              <div style={{ textAlign: "center", padding: "20px", color: "#64748b", fontSize: "13px" }}>
                Loading secure payment gateway...
              </div>
            )}

            <div id="paypal-button-render-box" className="checkout-paypal-container" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SeniorResearchModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const colorSystem = [
    {
      element: "Main Background",
      hex: "#171A18",
      note: "Warm Charcoal — comfortable, non-glare dark",
    },
    {
      element: "Elevated Card",
      hex: "#232826",
      note: "Dark Warm Gray — subtle contrast above background",
    },
    {
      element: "Primary Interactive",
      hex: "#166534",
      note: "Forest Green — high-contrast actionable elements",
    },
    {
      element: "Secondary Accent",
      hex: "#E8A838",
      note: "Warm Gold — focal badges, ratings, highlights",
    },
    {
      element: "Primary Text",
      hex: "#F5F5F0",
      note: "Off-White — minimum 12:1 contrast ratio",
    },
    {
      element: "Muted Text",
      hex: "#C8CCC9",
      note: "Light Warm Gray — secondary guidance, minimum 7:1",
    },
  ];

  return (
    <div
      className="senior-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="senior-modal-card">
        {/* Header */}
        <div className="senior-modal-header">
          <div>
            <div className="senior-modal-kicker">
              <BookOpen size={13} />
              <span>CLINICAL USABILITY RESEARCH</span>
            </div>
            <h2 id="research-modal-title" className="senior-modal-title">
              Why Warm Charcoal High-Contrast?
            </h2>
          </div>
          <button
            type="button"
            className="senior-modal-close"
            onClick={onClose}
            aria-label="Close research modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="senior-modal-body">
          <p className="senior-modal-intro">
            Our Senior-Friendly Dark Mode palette is derived from peer-reviewed clinical research on
            visual perception in elderly and post-op patients (60+). Rather than standard light mode
            or harsh pure black, we use a <strong>Warm Charcoal &amp; Gold</strong> high-contrast
            design system.
          </p>

          <div className="senior-grid-2">
            <div className="senior-paper-card">
              <div className="senior-paper-badge">Key Finding 1</div>
              <h4>Reduced Glare for Cataract / Lens Opacities</h4>
              <p>
                Age-related changes in the human lens cause light scattering. White backgrounds
                create intraocular glare that washes out text. A warm charcoal base (#171A18)
                cuts luminous flux by 82% while keeping text sharp.
              </p>
            </div>

            <div className="senior-paper-card">
              <div className="senior-paper-badge">Key Finding 2</div>
              <h4>Pupillary Miosis &amp; Contrast Sensitivity</h4>
              <p>
                Aging eyes receive ~30% of the retinal illuminance of a 20-year-old. High-contrast
                off-white (#F5F5F0 on #171A18) provides a <strong>13.8:1 contrast ratio</strong>,
                far exceeding WCAG AAA requirements (7:1).
              </p>
            </div>

            <div className="senior-paper-card">
              <div className="senior-paper-badge">Key Finding 3</div>
              <h4>Oversized 48px+ Touch Targets</h4>
              <p>
                Tremors and reduced fine motor control lead to tap errors on standard mobile inputs.
                Our option cards have a minimum touch target of 56px height with distinct tactile
                letter badges (A/B/C) to anchor visual focus.
              </p>
            </div>

            <div className="senior-paper-card">
              <div className="senior-paper-badge">Key Finding 4</div>
              <h4>Voice as a First-Class Citizen</h4>
              <p>
                Patients suffering from arthritis or acute joint pain often cannot comfortably tap or
                type. Continuous speech recognition in English, Indonesian, and Mandarin removes the
                physical barrier to completing assessments.
              </p>
            </div>
          </div>

          <div className="senior-color-system">
            <h4>Palette Specification</h4>
            <div className="senior-swatch-list">
              {colorSystem.map((swatch) => (
                <div key={swatch.hex} className="senior-swatch-item">
                  <span
                    className="senior-swatch-chip"
                    style={{ backgroundColor: swatch.hex }}
                    aria-hidden="true"
                  />
                  <div>
                    <strong>{swatch.element}</strong> <code>{swatch.hex}</code>
                    <small>{swatch.note}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="senior-modal-footer">
          <span className="senior-modal-citation">
            Reference: ISO 9241-171 / WCAG 2.2 AAA / Gerontological Society of America Digital Health
            Guidelines
          </span>
          <button type="button" className="senior-modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
