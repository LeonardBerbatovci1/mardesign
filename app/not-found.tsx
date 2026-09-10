import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="mx-auto grid min-h-dvh w-full max-w-[1500px] place-items-center px-6 text-center"
    >
      <div>
        <p className="script-mark text-3xl">we design, we finalise</p>
        <h1 className="display-title mt-4 text-[clamp(3rem,10vw,7rem)] text-white">
          Page not found
        </h1>
        <p className="mt-4 text-white/80">
          The page you were looking for has moved or never existed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent-soft hover:text-ink"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
