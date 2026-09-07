import { Activity } from "lucide-react";

export function BrandMark({
  compact = false,
  inverse = false,
}: {
  compact?: boolean;
  inverse?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`brand-mark ${inverse ? "brand-mark-inverse" : ""}`} aria-hidden="true">
        <Activity size={20} strokeWidth={2.4} />
      </div>
      {!compact && (
        <div className="min-w-0 leading-none">
          <div
            className={`font-display text-[15px] font-extrabold tracking-[-0.02em] ${inverse ? "text-white" : "text-ink"}`}
          >
            Spring Hope
          </div>
          <div
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.16em] ${inverse ? "text-white/60" : "text-muted"}`}
          >
            Orthopaedic Clinic
          </div>
        </div>
      )}
    </div>
  );
}

export function PlatformMark({
  compact = false,
  inverse = false,
}: {
  compact?: boolean;
  inverse?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`brand-mark ${inverse ? "brand-mark-inverse" : ""}`} aria-hidden="true">
        <Activity size={20} strokeWidth={2.4} />
      </div>
      {!compact && (
        <div className="min-w-0 leading-none">
          <div
            className={`font-display text-[15px] font-extrabold tracking-[-0.02em] ${inverse ? "text-white" : "text-ink"}`}
          >
            Spring Hope
          </div>
          <div
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.16em] ${inverse ? "text-white/60" : "text-muted"}`}
          >
            Form Platform
          </div>
        </div>
      )}
    </div>
  );
}
