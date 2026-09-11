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
    "M 171.91,354.08 L 171.36,353.98 L 0.00,322.08 L 0.74,275.13 L 7.39,264.72 L 9.08,117.20 L 6.50,112.75 L 6.50,112.17 L 7.11,33.51 L 8.82,33.19 L 182.35,0.00 L 256.40,35.70 L 256.48,48.97 C 257.60,52.66 259.74,61.40 257.77,69.44 L 257.74,69.58 C 257.39,70.90 257.07,72.03 256.78,72.96 L 257.38,153.69 L 256.14,158.01 L 256.46,264.31 L 259.74,270.01 L 260.03,324.03 L 171.91,354.08 Z";

  return (
    <svg
      viewBox="0 0 860 1290"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      {/* The traced ring is 260x354; map it onto the cabinet body, which
          spans x 5-94%% and y 2-80%% of the 860x1290 frame (the rest of the
          frame is the shot's own reflection). */}
      <g transform="translate(43 26) scale(2.9435 3.0)">
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
