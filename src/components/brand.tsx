export function BrandMark({
  compact = false,
  inverse = false,
}: {
  compact?: boolean | undefined;
  inverse?: boolean | undefined;
}) {
  return (
    <div className="wordmark-logo flex items-center shrink-0">
      <span
        className={`wordmark-text font-sans text-[23px] sm:text-[27px] font-black tracking-[-0.055em] select-none inline-flex items-center ${
          inverse ? "text-white" : "text-[#111827]"
        }`}
        style={{ letterSpacing: "-0.055em" }}
      >
        <span>9forms</span>
        <span
          className="wordmark-dot shrink-0"
          style={{
            width: "7.5px",
            height: "7.5px",
            marginLeft: "2.5px",
            marginBottom: "3px",
          }}
          aria-hidden="true"
        />
      </span>
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
    <div className="wordmark-logo flex items-center shrink-0">
      <span
        className={`wordmark-text font-sans text-[23px] sm:text-[27px] font-black tracking-[-0.055em] select-none inline-flex items-center ${
          inverse ? "text-white" : "text-[#111827]"
        }`}
        style={{ letterSpacing: "-0.055em" }}
      >
        <span>9forms</span>
        <span
          className="wordmark-dot shrink-0"
          style={{
            width: "7.5px",
            height: "7.5px",
            marginLeft: "2.5px",
            marginBottom: "3px",
          }}
          aria-hidden="true"
        />
      </span>
    </div>
  );
}
