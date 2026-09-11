import Image from "next/image";
import Link from "next/link";

import type { ImageRef } from "@/lib/types";

/**
 * The home hero product shot.
 *
 * Three pieces sit on top of each other, all sharing one box so they stay
 * registered as the shot scales:
 *
 *  1. the display photo,
 *  2. the mirrored reflection under its base, faded out downward,
 *  3. the brand outline traced around the shelf, with a light travelling
 *     around the path (the artwork is `out line i animuar` from the deck).
 *
 * The whole thing is a link: clicking the shelf opens the project it belongs
 * to, as the deck asks.
 */
export function HeroDisplay({
  image,
  reflection,
  href,
  label,
  children,
}: {
  image: ImageRef;
  reflection?: string;
  href: string;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto w-fit max-w-full min-w-0">
      <Link
        href={href}
        aria-label={label}
        className="group relative block rounded-2xl focus-visible:outline-none"
      >
        <div className="relative mx-auto w-fit">
          <Image
            src={image.src}
            alt={image.alt ?? ""}
            width={image.width}
            height={image.height}
            priority
            sizes="(max-width: 1024px) 90vw, 680px"
            className="mx-auto h-auto w-full max-w-[min(88vw,600px)] transition-transform duration-500 group-hover:scale-[1.015] lg:max-h-[74dvh] lg:w-auto lg:max-w-none"
          />

          {/* Travelling outline, sized to the shelf body inside the shot. */}
          <ShelfOutline className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>

        {reflection && (
          <Image
            src={reflection}
            alt=""
            aria-hidden="true"
            width={1326}
            height={680}
            sizes="(max-width: 1024px) 90vw, 680px"
            className="pointer-events-none mx-auto -mt-[3%] h-auto w-full max-w-[min(88vw,600px)] opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_72%)] lg:w-auto lg:max-w-none"
          />
        )}
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
      {/* The traced artwork is 260x354; map it onto the cabinet in the shot
          (x 39-807, y 116-1264 of the 860x1290 frame). */}
      <g transform="translate(39 116) scale(2.953 3.243)">
        <path
          d={d}
          stroke="var(--color-outline)"
          strokeWidth="1"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.3"
        />
        <path
          d={d}
          stroke="var(--color-outline)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="hero-outline-run"
        />
      </g>
    </svg>
  );
}
