"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoMark } from "./Logo";

/**
 * The between-pages curtain the client asked for (see the reference clip in
 * `client-changes`): on every navigation the page drops to a dark ground
 * carrying only the logo icon, then the new page fades up behind it.
 *
 * Timings are taken from that clip — it snaps to black in about 100ms, holds
 * for ~150ms, then eases the new page back over ~400ms.
 *
 * The curtain is painted by CSS alone once it is mounted, so it never blocks
 * navigation: if scripting is slow or disabled the pages simply swap, as they
 * did before.
 */
const COVER_MS = 110;
const HOLD_MS = 150;
const REVEAL_MS = 420;

type Phase = "idle" | "covering" | "revealing";

export function PageTransition() {
  const pathname = usePathname();
  const previous = useRef(pathname);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;

    // The new route's markup is already on screen by the time this runs, so
    // cover it immediately, hold, then reveal.
    setPhase("covering");
    const toReveal = window.setTimeout(
      () => setPhase("revealing"),
      COVER_MS + HOLD_MS,
    );
    const toIdle = window.setTimeout(
      () => setPhase("idle"),
      COVER_MS + HOLD_MS + REVEAL_MS,
    );

    return () => {
      window.clearTimeout(toReveal);
      window.clearTimeout(toIdle);
    };
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className="page-curtain pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-ink-deep"
    >
      <LogoMark className="w-16 text-white sm:w-20" />
    </div>
  );
}
