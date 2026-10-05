import { Link } from "@tanstack/react-router";

export function BrandMark({
  inverse = false,
  className = "",
  size = "md",
}: {
  inverse?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const heightClass =
    size === "sm"
      ? "h-[22px]"
      : size === "lg"
        ? "h-[34px]"
        : "h-[28px]";

  return (
    <div className="flex items-center shrink-0">
      <Link
        to="/"
        className={`inline-flex items-center no-underline text-inherit transition-transform duration-200 hover:scale-[1.02] ${className}`}
        aria-label="9forms home"
      >
        <img
          src={inverse ? "/logo-white.png?v=9f_v4" : "/logo-full.png?v=9f_v4"}
          alt="9forms"
          className={`${heightClass} w-auto object-contain select-none`}
          loading="eager"
        />
      </Link>
    </div>
  );
}

export function PlatformMark({
  href = "/",
  className = "",
  size = "md",
  inverse = false,
}: {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  inverse?: boolean;
}) {
  const heightClass =
    size === "sm"
      ? "h-[22px]"
      : size === "lg"
        ? "h-[34px]"
        : "h-[28px]";

  return (
    <div className="flex items-center shrink-0">
      <Link
        to={href}
        className={`inline-flex items-center no-underline text-inherit transition-transform duration-200 hover:scale-[1.02] ${className}`}
        aria-label="9forms home"
      >
        <img
          src={inverse ? "/logo-white.png?v=9f_v4" : "/logo-full.png?v=9f_v4"}
          alt="9forms"
          className={`${heightClass} w-auto object-contain select-none`}
          loading="eager"
        />
      </Link>
    </div>
  );
}

export function PlatformFavicon({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/logo-mark.png?v=9f_v4"
      alt="9forms"
      width={size}
      height={size}
      className={`object-contain select-none ${className}`}
      loading="eager"
    />
  );
}
