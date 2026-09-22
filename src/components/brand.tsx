export function BrandMark({
  compact = false,
  inverse = false,
}: {
  compact?: boolean | undefined;
  inverse?: boolean | undefined;
}) {
  return (
    <div className="flex items-center shrink-0">
      <span
        className={`font-sans text-[22px] sm:text-[26px] font-black tracking-[-0.05em] select-none inline-flex items-center ${
          inverse ? "text-white" : "text-[#111827]"
        }`}
        style={{ letterSpacing: "-0.055em" }}
      >
        <span>9forms</span>
        <span
          className="inline-block rounded-full bg-[#FF4F18] shrink-0"
          style={{
            width: "7px",
            height: "7px",
            marginLeft: "2px",
            marginBottom: "3px",
            boxShadow: "0 0 8px rgba(255, 79, 24, 0.4)",
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
    <div className="flex items-center shrink-0">
      <span
        className={`font-sans text-[22px] sm:text-[26px] font-black tracking-[-0.05em] select-none inline-flex items-center ${
          inverse ? "text-white" : "text-[#111827]"
        }`}
        style={{ letterSpacing: "-0.055em" }}
      >
        <span>9forms</span>
        <span
          className="inline-block rounded-full bg-[#FF4F18] shrink-0"
          style={{
            width: "7px",
            height: "7px",
            marginLeft: "2px",
            marginBottom: "3px",
            boxShadow: "0 0 8px rgba(255, 79, 24, 0.4)",
          }}
          aria-hidden="true"
        />
      </span>
    </div>
  );
}
