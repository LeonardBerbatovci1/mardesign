import Link from "next/link";

import { LogoMark } from "./Logo";
import { Social } from "./Social";
import type { Site } from "@/lib/types";

export function Footer({ site }: { site: Site }) {
  return (
    <footer className="mt-16 border-t border-hairline/40 bg-ink-deep/60 sm:mt-24">
      <div className="mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-x-8 gap-y-10 px-6 py-12 sm:grid-cols-2 sm:px-10 sm:py-14 md:grid-cols-[1.3fr_1fr_1fr] lg:px-16">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <LogoMark className="size-9 text-accent" />
            <span className="font-display text-2xl font-extrabold tracking-tight text-white">
              {site.wordmark}
            </span>
          </Link>
          <p className="script-mark mt-4 text-2xl">{site.script}</p>
          <Social links={site.social} className="mt-6" />
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
            Explore
          </h2>
          <ul className="mt-4 space-y-2">
            {site.primaryNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-soft">
            Get in touch
          </h2>
          <address className="mt-4 space-y-2 not-italic text-white/80">
            <p>{site.contact.location.join(", ")}</p>
            <p>
              <a
                href={`mailto:${site.contact.email}`}
                className="transition-colors hover:text-accent"
              >
                {site.contact.email}
              </a>
            </p>
            <p>{site.contact.workingHours}</p>
          </address>
        </div>
      </div>

      <div className="border-t border-hairline/25 px-6 py-6 text-center text-xs text-white/50 sm:px-10 lg:px-16">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
