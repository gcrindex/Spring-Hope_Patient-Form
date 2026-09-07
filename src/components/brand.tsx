export function BrandMark({
  compact = false,
  inverse = false,
  subtitle = "Smart Form Platform",
}: {
  compact?: boolean;
  inverse?: boolean;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`brand-mark ${inverse ? "brand-mark-inverse" : ""}`} aria-hidden="true">
        <img
          src="/logo-mark.webp"
          alt="9forms.com logo"
          className="h-7 w-7 object-contain"
          loading="eager"
        />
      </div>
      {!compact && (
        <div className="min-w-0 leading-none">
          <div
            className={`font-display text-[16px] font-black tracking-[-0.03em] ${
              inverse ? "text-white" : "text-ink"
            }`}
          >
            9forms<span className="text-[#00b4d8]">.com</span>
          </div>
          <div
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
              inverse ? "text-white/60" : "text-muted"
            }`}
          >
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
}

export function PlatformMark({
  compact = false,
  inverse = false,
  subtitle = "Smart Form Builder & Workflows",
}: {
  compact?: boolean;
  inverse?: boolean;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`brand-mark ${inverse ? "brand-mark-inverse" : ""}`} aria-hidden="true">
        <img
          src="/logo-mark.webp"
          alt="9forms.com logo"
          className="h-7 w-7 object-contain"
          loading="eager"
        />
      </div>
      {!compact && (
        <div className="min-w-0 leading-none">
          <div
            className={`font-display text-[16px] font-black tracking-[-0.03em] ${
              inverse ? "text-white" : "text-ink"
            }`}
          >
            9forms<span className="text-[#00b4d8]">.com</span>
          </div>
          <div
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
              inverse ? "text-white/60" : "text-muted"
            }`}
          >
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
}
