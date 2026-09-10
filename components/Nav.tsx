"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LogoMark } from "./Logo";
import type { NavLink } from "@/lib/types";

/**
 * The floating pill navigation used on every page below the home hero.
 *
 * The deck draws this pill two ways: collapsed (Work / About / Contact plus a
 * "+" button) and expanded (Work / Service / People / Diary / Contact). Those
 * are the two states of one control, so the "+" toggles the secondary links
 * in and out.
 */
export function Nav({
  primary,
  secondary,
}: {
  primary: NavLink[];
  secondary: NavLink[];
}) {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Main"
      className="sticky top-4 z-40 flex justify-center px-4 sm:top-6"
    >
      <div className="panel flex max-w-full items-center gap-1 rounded-full py-1.5 pl-2 pr-1.5 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.65)] sm:gap-2 sm:pl-3">
        <Link
          href="/"
          aria-label="Mardesign — home"
          className="shrink-0 rounded-full p-2 transition-colors hover:text-accent"
        >
          <LogoMark className="h-6 w-6 text-white sm:h-7 sm:w-7" />
        </Link>

        <ul className="flex items-center gap-0.5 sm:gap-1">
          {primary.map((link) => (
            <NavItem key={link.href + link.label} link={link} active={isActive(link.href)} />
          ))}

          {expanded &&
            secondary.map((link) => (
              <NavItem
                key={`secondary-${link.label}`}
                link={link}
                active={false}
              />
            ))}
        </ul>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label={expanded ? "Show fewer links" : "Show more links"}
          className="ml-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-white/60 text-white transition hover:border-accent hover:text-accent sm:size-9"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              className={`origin-center transition-transform duration-300 ${
                expanded ? "rotate-45" : ""
              }`}
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}

function NavItem({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <li>
      <Link
        href={link.href}
        aria-current={active ? "page" : undefined}
        className={`block rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.09em] transition-colors sm:px-4 sm:text-[0.8rem] ${
          active
            ? "bg-white text-accent"
            : "text-white hover:text-accent-soft"
        }`}
      >
        {link.label}
      </Link>
    </li>
  );
}
