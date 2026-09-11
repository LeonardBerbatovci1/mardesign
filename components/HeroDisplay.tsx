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
    "M 60,135 L 536,50 L 608,50 L 794,140 L 797,150 L 804,198 L 798,240 L 798,834 L 799,864 L 808,888 L 808,996 L 780,1034 L 520,1107 L 80,1022 L 40,986 L 39,900 L 61,855 L 68,378 L 60,360 L 60,145 Z";

  return (
    <svg
      viewBox="0 0 860 1290"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      {/* Traced from the artwork itself, in the shot's own 860x1290 frame, so
          the line sits on the cabinet in perspective: up the slanted header
          panel and over the razor head, down both sides, and across the foot
          of the plinth where it meets its reflection. The left corners sit on
          the solid body (60,135 at the header, 39,900 at the plinth flare),
          not on the soft glow that spreads a further 6px past it. */}
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
