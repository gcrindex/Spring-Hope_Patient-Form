import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  Clipboard,
  ExternalLink,
  Link2,
  Mic,
  QrCode,
  Send,
  Share2,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { AdminShell } from "../components/admin-shell";
import { AdminAuthGuard } from "../components/admin-auth-guard";

export const Route = createFileRoute("/admin/forms-builder/publish")({
  head: () => ({ meta: [{ title: "Publish Form — Spring Hope" }] }),
  component: () => (
    <AdminAuthGuard>
      <PublishPage />
    </AdminAuthGuard>
  ),
});

function PublishPage() {
  const [copied, setCopied] = useState(false);
  const publicUrl = "https://pesat.app/audit/patient-form/form.html?id=knee-pain-assessment";
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch {
      /* clipboard may be blocked in preview */
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <AdminShell
      title="Publish & share"
      eyebrow="Forms / Knee Pain Assessment"
      activeNav="forms"
      actions={
        <Link to="/admin/forms-builder" className="admin-soft-button">
          Back to builder
        </Link>
      }
    >
      <div className="publish-layout">
        <section className="publish-main-card">
          <div className="publish-success-mark">
            <Check size={26} />
          </div>
          <div className="panel-kicker">Ready to share</div>
          <h2>Knee Pain Assessment is published.</h2>
          <p>
            Patients can open the assessment on any modern phone or desktop browser. Voice answering
            is optional and manual controls remain available.
          </p>
          <div className="public-link-box">
            <div>
              <Link2 size={17} />
              <span>{publicUrl}</span>
            </div>
            <button type="button" onClick={copyLink}>
              {copied ? (
                <>
                  <Check size={15} /> Copied
                </>
              ) : (
                <>
                  <Clipboard size={15} /> Copy link
                </>
              )}
            </button>
          </div>
          <div className="publish-actions-grid">
            <a className="publish-action-card" href="/intake" target="_blank" rel="noreferrer">
              <div>
                <ExternalLink size={19} />
              </div>
              <strong>Open patient preview</strong>
              <span>See the guided assessment</span>
            </a>
            <button
              className="publish-action-card"
              type="button"
              disabled
              aria-disabled="true"
              title="Direct sharing is not implemented in this MVP"
            >
              <div>
                <Send size={19} />
              </div>
              <strong>Send link</strong>
              <span>Planned for a later MVP</span>
            </button>
            <button
              className="publish-action-card"
              type="button"
              disabled
              aria-disabled="true"
              title="QR generation is not implemented in this MVP"
            >
              <div>
                <QrCode size={19} />
              </div>
              <strong>QR code</strong>
              <span>Planned for a later MVP</span>
            </button>
          </div>
        </section>

        <aside className="publish-side-card">
          <div className="publish-side-head">
            <div>
              <span className="panel-kicker">Patient capabilities</span>
              <h2>What patients can use</h2>
            </div>
            <Smartphone size={20} />
          </div>
          <div className="capability-list">
            <div>
              <span className="capability-icon">
                <Mic size={17} />
              </span>
              <div>
                <strong>Voice answering</strong>
                <small>Browser-supported speech recognition with review</small>
              </div>
              <Check size={17} className="text-positive" />
            </div>
            <div>
              <span className="capability-icon">
                <Share2 size={17} />
              </span>
              <div>
                <strong>Manual answers</strong>
                <small>Tap, slider and text controls always available</small>
              </div>
              <Check size={17} className="text-positive" />
            </div>
            <div>
              <span className="capability-icon">
                <QrCode size={17} />
              </span>
              <div>
                <strong>Mobile ready</strong>
                <small>Optimised for 320–414px patient screens</small>
              </div>
              <Check size={17} className="text-positive" />
            </div>
          </div>
          <div className="publish-notice">
            <strong>MVP note</strong>
            <p>
              This screen demonstrates publishing and sharing behavior. It does not imply production
              authentication, a shared production database, or live clinical-system integration.
            </p>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
