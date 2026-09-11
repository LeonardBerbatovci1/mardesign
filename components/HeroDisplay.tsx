import Image from "next/image";
import Link from "next/link";

import type { ImageRef } from "@/lib/types";

/**
 * The home hero product shot.
 *
 * The artwork already carries its own mirrored reflection below the cabinet
 * base, so the shot is masked to fade that reflection out downward rather
 * than letting it stop abruptly — the gradient the deck marks in blue.
 *
 * Over it sits the brand outline traced around the cabinet, with a light
 * travelling around the path (the `out line i animuar` artwork from the deck).
 *
 * The whole thing is a link: clicking the shelf opens the project it belongs
 * to, as the deck asks.
 */
export function HeroDisplay({
  image,
  href,
  label,
  children,
}: {
  image: ImageRef;
  href: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto w-full max-w-full min-w-0 lg:w-fit">
      <Link
        href={href}
        aria-label={label}
        className="group relative block rounded-2xl focus-visible:outline-none"
      >
        <div className="relative mx-auto -mb-[16%] w-full max-w-[min(88vw,600px)] lg:w-fit lg:max-w-none">
          <Image
            src={image.src}
            alt={image.alt ?? ""}
            width={image.width}
            height={image.height}
            priority
            sizes="(max-width: 1024px) 90vw, 680px"
            className="mx-auto h-auto w-full max-w-[min(88vw,600px)] transition-transform duration-500 [mask-image:linear-gradient(to_bottom,black_72%,transparent_97%)] group-hover:scale-[1.015] lg:max-h-[78dvh] lg:w-auto lg:max-w-none"
          />

          {/* Travelling outline, sized to the shelf body inside the shot. */}
          <ShelfOutline className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>
      </Link>

      {children}
    </div>
  );
}

/**
 * The yellow shelf outline. A short bright dash runs around the traced path on
 * a loop, over a dim static copy of the same line.
 */
function ShelfOutline({ className = "" }: { className?: string }) {
  const d =
    "M 262,102 L 61,142 L 60,362 L 68,378 L 62,862 L 41,898 L 39,998 L 71,1019 L 286,1059 L 322,1072 L 430,1093 L 465,1092 L 537,1105 L 573,1103 L 788,1030 L 808,998 L 808,890 L 798,838 L 798,238 L 804,194 L 797,142 L 716,102 Z";

  return (
    <svg
      viewBox="0 0 860 1290"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      {/* Traced from the artwork's own alpha channel, so the line follows the
          cabinet in perspective: the header panel, the left edge, the plinth's
          contact line where it meets its reflection, and the razor side.
          Coordinates are the shot's own 860x1290 frame. */}
      <g>
        <path
          d={d}
          stroke="var(--color-outline)"
          strokeWidth="2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.55"
        />
        <path
          d={d}
          stroke="var(--color-outline)"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="hero-outline-run"
        />
      </g>
    </svg>
  );
}
