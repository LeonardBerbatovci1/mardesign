import Link from "next/link";

/**
 * The Mardesign butterfly/M mark, traced from the brand artwork in the design
 * deck. It paints with `currentColor`, so the parent decides mint vs white.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 1042.3"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      className={className}
    >
      <path d="M2.3 0.0L0.0 21.1L65.7 462.4L70.4 485.9L98.6 514.1L79.8 546.9L79.8 561.0L122.1 814.6L150.2 1035.2L159.6 1035.2L335.7 690.1L481.2 831.0L523.5 826.3L659.6 690.1L842.7 1042.3L849.8 1030.5L887.3 748.8L920.2 556.3L920.2 542.3L901.4 514.1L929.6 485.9L934.3 462.4L1000.0 2.3L974.2 18.8L537.6 408.5L535.2 401.4L558.7 354.5L577.5 340.4L582.2 326.3L565.7 300.5L546.9 295.8L525.8 312.2L521.1 326.3L525.8 340.4L500.0 389.7L474.2 340.4L474.2 312.2L453.1 295.8L424.9 305.2L417.8 335.7L441.3 354.5L464.8 406.1L457.7 408.5L2.3 0.0ZM93.9 180.8L100.9 178.4L481.2 525.8L500.0 535.2L903.8 178.4L868.5 443.7L863.8 457.7L812.2 509.4L849.8 565.7L812.2 819.2L802.8 814.6L774.6 762.9L678.4 572.8L500.0 751.2L321.6 572.8L201.9 805.2L190.1 816.9L150.2 570.4L150.2 561.0L187.8 509.4L136.2 457.7L131.5 443.7L93.9 180.8Z" />
    </svg>
  );
}

/**
 * Full lockup: mark over the MARDESIGN wordmark and DIGITAL PRINT tagline.
 * Used large on the home hero.
 */
export function LogoLockup({
  wordmark,
  tagline,
  className = "",
}: {
  wordmark: string;
  tagline: string;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex flex-col items-center ${className}`}
      aria-label={`${wordmark} — home`}
    >
      <LogoMark className="w-[clamp(1.7rem,2.5vw,2.35rem)] text-accent transition-colors group-hover:text-accent-soft" />
      <span className="mt-1.5 font-display text-[clamp(0.95rem,1.75vw,1.55rem)] font-extrabold leading-none tracking-[-0.01em] text-white">
        {wordmark}
      </span>
      <span className="mt-0.5 text-[clamp(0.36rem,0.48vw,0.44rem)] font-light uppercase tracking-[0.42em] text-accent">
        {tagline}
      </span>
    </Link>
  );
}
