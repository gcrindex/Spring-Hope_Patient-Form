import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  GraduationCap,
  HeartHandshake,
  Languages,
  LayoutDashboard,
  Link2,
  Mic,
  PenLine,
  Share2,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Stethoscope,
  Users,
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
      { title: "9forms.com — Smart Form Builder & Workflows" },
      {
        name: "description",
        content:
          "9forms.com is a conversational, multi-industry form builder: one question at a time, auto-advance navigation, voice answers and a clean admin area.",
      },
    ],
  }),
  component: BuilderLandingPage,
});

const industries = [
  { icon: Stethoscope, nameKey: "ind1Name", descKey: "ind1Desc" },
  { icon: GraduationCap, nameKey: "ind2Name", descKey: "ind2Desc" },
  { icon: Users, nameKey: "ind3Name", descKey: "ind3Desc" },
  { icon: CalendarDays, nameKey: "ind4Name", descKey: "ind4Desc" },
  { icon: Building2, nameKey: "ind5Name", descKey: "ind5Desc" },
  { icon: ShoppingBag, nameKey: "ind6Name", descKey: "ind6Desc" },
] as const;

const features = [
  { icon: Smartphone, labelKey: "f1Label", titleKey: "f1Title", descKey: "f1Desc" },
  { icon: Zap, labelKey: "f2Label", titleKey: "f2Title", descKey: "f2Desc" },
  { icon: Mic, labelKey: "f3Label", titleKey: "f3Title", descKey: "f3Desc" },
  { icon: Languages, labelKey: "f4Label", titleKey: "f4Title", descKey: "f4Desc" },
  { icon: LayoutDashboard, labelKey: "f5Label", titleKey: "f5Title", descKey: "f5Desc" },
  { icon: HeartHandshake, labelKey: "f6Label", titleKey: "f6Title", descKey: "f6Desc" },
] as const;

function BuilderLandingPage() {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    setLanguage(getStoredLanguage());
    return onLanguageChange(setLanguage);
  }, []);

  const handleLang = (next: Language) => {
    setStoredLanguage(next);
    setLanguage(next);
  };

  const t = builderI18n[language] ?? builderI18n.en;

  return (
    <div className="marketing-page">
      <header className="marketing-header">
        <div className="marketing-nav">
          <PlatformMark />
          <nav className="marketing-links" aria-label="Main navigation">
            <a href="#industries">{t.navIndustries}</a>
            <a href="#demo">{t.navDemo}</a>
            <a href="#features">{t.navFeatures}</a>
            <Link to="/admin">{t.navAdmin}</Link>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher value={language} onChange={handleLang} compact />
            <a className="button-primary button-nav" href="#demo">
              {t.navCta} <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────── */}
        <section className="hero-section">
          <div className="hero-aurora hero-aurora-one" />
          <div className="hero-aurora hero-aurora-two" />
          <div className="hero-grid">
            <div className="hero-copy reveal-up">
              <div className="eyebrow-pill">
                <Sparkles size={14} /> {t.badge}
              </div>
              <h1>
                {t.heroH1Pre} <span>{t.heroH1Span}</span>
              </h1>
              <p className="hero-lead">{t.heroLead}</p>
              <div className="hero-actions">
                <a className="button-primary button-lg" href="#demo">
                  {t.heroCtaPrimary} <ArrowRight size={18} />
                </a>
                <Link className="button-secondary button-lg" to="/admin">
                  {t.heroCtaSecondary}
                </Link>
              </div>
              <div className="hero-trust-row">
                <div>
                  <Check size={15} /> {t.trustNoApp}
                </div>
                <div>
                  <Check size={15} /> EN · ID · 中文
                </div>
                <div>
                  <Check size={15} /> {t.trustVoice}
                </div>
              </div>
            </div>

            <div className="sf-hero-mock reveal-scale" aria-label="9forms.com form preview">
              <div className="sf-responses-note hero-note">
                <BarChart3 size={17} />
                <span>
                  <strong>{t.mockResponses}</strong>
                  <small>{t.mockResponsesSub}</small>
                </span>
              </div>

              <div className="sf-mock-card">
                <div className="sf-mock-topline">
                  <span className="sf-mock-brand">
                    <img
                      src="/logo-mark.webp"
                      alt="9forms"
                      style={{
                        width: 18,
                        height: 18,
                        display: "inline-block",
                        verticalAlign: "middle",
                        marginRight: 4,
                      }}
                    />{" "}
                    9forms.com
                  </span>
                  <span className="sf-mock-step">2 / 4</span>
                </div>
                <div className="sf-mock-progress">
                  <span style={{ width: "50%" }} />
                </div>
                <h3>{t.mockQuestion}</h3>
                <div className="sf-mock-options">
                  <div className="selected">
                    <i>
                      <Check size={14} strokeWidth={3} />
                    </i>{" "}
                    {t.mockOpt1}
                  </div>
                  <div>
                    <i>B</i> {t.mockOpt2}
                  </div>
                  <div>
                    <i>C</i> {t.mockOpt3}
                  </div>
                </div>
                <div className="sf-mock-auto">
                  <Zap size={14} /> {t.mockAuto}
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

          <div className="hero-proof-strip">
            <div>
              <span>{t.proof1Number}</span>
              <strong>{t.proof1Title}</strong>
              <small>{t.proof1Sub}</small>
            </div>
            <div>
              <span>{t.proof2Number}</span>
              <strong>{t.proof2Title}</strong>
              <small>{t.proof2Sub}</small>
            </div>
            <div>
              <span>{t.proof3Number}</span>
              <strong>{t.proof3Title}</strong>
              <small>{t.proof3Sub}</small>
            </div>
            <div>
              <span>{t.proof4Number}</span>
              <strong>{t.proof4Title}</strong>
              <small>{t.proof4Sub}</small>
            </div>
          </div>
        </section>

        {/* ── Industries ───────────────────────────────── */}
        <section className="section-shell section-light" id="industries">
          <div className="section-kicker">{t.indKicker}</div>
          <div className="section-title-row">
            <h2>
              {t.indTitle1}
              <br />
              {t.indTitle2}
            </h2>
            <p>{t.indDesc}</p>
          </div>
          <div className="sf-grid-3">
            {industries.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.nameKey} className="sf-industry-card">
                  <div className="feature-icon">
                    <Icon size={21} />
                  </div>
                  <h3>{t[item.nameKey]}</h3>
                  <p>{t[item.descKey]}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── Demo Showcase ────────────────────────────── */}
        <section className="section-shell sf-section-blue" id="demo">
          <div className="section-kicker">{t.demoKicker}</div>
          <div className="section-title-row">
            <h2>
              {t.demoTitle1}
              <br />
              {t.demoTitle2}
            </h2>
            <p>{t.demoDesc}</p>
          </div>
          <div className="sf-demo-grid">
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
          </div>
        </section>

        {/* ── Features ─────────────────────────────────── */}
        <section className="section-shell section-light" id="features">
          <div className="section-kicker">{t.featKicker}</div>
          <div className="section-title-row">
            <h2>
              {t.featTitle1}
              <br />
              {t.featTitle2}
            </h2>
            <p>{t.featDesc}</p>
          </div>
          <div className="sf-grid-3">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.labelKey} className="feature-card">
                  <div className="feature-icon">
                    <Icon size={21} />
                  </div>
                  <span className="feature-label">{t[item.labelKey]}</span>
                  <h3>{t[item.titleKey]}</h3>
                  <p>{t[item.descKey]}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────── */}
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

        {/* ── Admin preview ────────────────────────────── */}
        <section className="section-shell section-light" id="admin">
          <div className="admin-preview-section">
            <div className="admin-preview-copy">
              <div className="section-kicker">{t.adminKicker}</div>
              <h2>
                {t.adminTitle1}
                <br />
                {t.adminTitle2}
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
              <Link className="button-primary button-lg" to="/admin">
                {t.adminCta} <ArrowRight size={18} />
              </Link>
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
                    <button type="button">+ New</button>
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
                      <span>Name</span>
                      <span>Submitted</span>
                      <span>Risk</span>
                    </div>
                    <div>
                      <span>
                        <b>S</b> Opa Sutrisno
                      </span>
                      <span>03 Sep, 12:10</span>
                      <span className="risk-moderate">Moderate</span>
                    </div>
                    <div>
                      <span>
                        <b>T</b> Tan Wei Ling
                      </span>
                      <span>03 Sep, 11:14</span>
                      <span className="risk-high">High</span>
                    </div>
                    <div>
                      <span>
                        <b>A</b> Aisha Rahman
                      </span>
                      <span>03 Sep, 10:41</span>
                      <span className="risk-moderate">Moderate</span>
                    </div>
                    <div>
                      <span>
                        <b>L</b> Lim Jia Hao
                      </span>
                      <span>02 Sep, 17:22</span>
                      <span className="risk-low">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <a className="button-white button-lg" href="#demo">
            {t.closingCta} <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <footer className="marketing-footer">
        <div className="marketing-footer-inner">
          <PlatformMark />
          <p>{t.footerNote}</p>
          <div className="footer-links">
            <a href="#demo">{t.navDemo}</a>
            <Link to="/admin/login">{t.navAdmin}</Link>
            <Link to="/spring-hope">
              <Link2 size={12} /> {t.footerOld}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
