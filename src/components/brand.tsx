export function BrandMark({
  compact = false,
  inverse = false,
}: {
  compact?: boolean | undefined;
  inverse?: boolean | undefined;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`brand-mark ${inverse ? "brand-mark-inverse" : ""}`}>
        <img
          src="/logo-mark.webp"
          alt="9forms logo"
          width={28}
          height={34}
          className="h-7 w-auto object-contain drop-shadow-sm"
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
  compact?: boolean | undefined;
  inverse?: boolean | undefined;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`brand-mark ${inverse ? "brand-mark-inverse" : ""}`}>
        <img
          src="/logo-mark.webp"
          alt="9forms logo"
          width={28}
          height={34}
          className="h-7 w-auto object-contain drop-shadow-sm"
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
