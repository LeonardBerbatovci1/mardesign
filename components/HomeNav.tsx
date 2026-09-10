"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Social } from "@/components/Social";
import type { NavLink, SocialPlatform } from "@/lib/types";

/**
 * Home-page header nav. On desktop the links sit inline next to the "Start a
 * project" pill; below `lg` they collapse behind a hamburger that opens a
 * full-screen overlay (the home page has no floating pill nav to fall back on).
 */
export function HomeNav({
  links,
  cta,
  social,
}: {
  links: NavLink[];
  cta: NavLink;
  social: { platform: SocialPlatform; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* desktop */}
      <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
        <ul className="flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href + link.label}>
              <Link
                href={link.href}
                className="text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={cta.href}
          className="rounded-full bg-accent px-7 py-3 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent-soft hover:text-ink"
        >
          {cta.label}
        </Link>
      </nav>

      {/* mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="grid size-11 place-items-center rounded-full border border-white/25 text-white lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
      </button>

      {/* mobile overlay */}
      <div
        className={`fixed inset-0 z-50 bg-ink-deep transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col px-6 py-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid size-11 place-items-center rounded-full border border-white/25 text-white"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-6 flex flex-1 flex-col">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="block py-3 font-display text-2xl font-extrabold uppercase tracking-tight text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={cta.href}
              className="mt-6 inline-block self-start rounded-full bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white"
            >
              {cta.label}
            </Link>

            <Social links={social} className="mt-auto pt-8" />
          </nav>
        </div>
      </div>
    </>
  );
}
