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
        <img
          src="/logo-mark.webp"
          alt="9forms logo"
          className="h-7 w-7 object-contain drop-shadow-sm"
          loading="eager"
        />
      </div>
      {!compact && (
        <div className="min-w-0 leading-none">
          <span
            className={`font-display text-[26px] font-black tracking-[-0.04em] select-none ${
              inverse ? "text-white" : "text-ink"
            }`}
          >
            9forms
          </span>
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
        <img
          src="/logo-mark.webp"
          alt="9forms logo"
          className="h-7 w-7 object-contain drop-shadow-sm"
          loading="eager"
        />
      </div>
      {!compact && (
        <div className="min-w-0 leading-none">
          <span
            className={`font-display text-[26px] font-black tracking-[-0.04em] select-none ${
              inverse ? "text-white" : "text-ink"
            }`}
          >
            9forms
          </span>
        </div>
      )}
    </div>
  );
}
