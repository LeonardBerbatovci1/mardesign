"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { logoutAction } from "@/lib/admin-actions";
import { LogoMark } from "@/components/Logo";

const NAV: { href: string; label: string; group: string }[] = [
  { href: "/admin", label: "Overview", group: "" },
  { href: "/admin/home", label: "Home page", group: "Pages" },
  { href: "/admin/work", label: "Work & projects", group: "Pages" },
  { href: "/admin/about", label: "About page", group: "Pages" },
  { href: "/admin/contact", label: "Contact page", group: "Pages" },
  { href: "/admin/site", label: "Header, footer & links", group: "Site-wide" },
  { href: "/admin/theme", label: "Colours", group: "Site-wide" },
  { href: "/admin/media", label: "Media library", group: "Site-wide" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const groups = Array.from(new Set(NAV.map((n) => n.group)));
  const current = NAV.find((n) => isActive(n.href))?.label ?? "Dashboard";

  return (
    <div className="admin-root flex min-h-dvh flex-col lg:flex-row">
      {/* mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--a-border)] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="admin-iconbtn"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
        <LogoMark className="h-6 w-6 text-[var(--a-brand)]" />
        <span className="text-sm font-semibold">{current}</span>
      </header>

      {/* backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[16rem] shrink-0 border-r border-[var(--a-border)] bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2.5 px-5 py-5">
            <LogoMark className="h-7 w-7 text-[var(--a-brand)]" />
            <div className="leading-tight">
              <p className="text-sm font-bold">Mardesign</p>
              <p className="text-xs text-[var(--a-muted)]">Content dashboard</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="admin-iconbtn ml-auto lg:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-4">
            {groups.map((group) => (
              <div key={group || "top"} className="mb-3">
                {group && (
                  <p className="px-3 pb-1 pt-3 text-[0.65rem] font-bold uppercase tracking-[0.09em] text-[var(--a-faint)]">
                    {group}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {NAV.filter((n) => n.group === group).map((item) => {
                    const active = isActive(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            active
                              ? "bg-[var(--a-brand-tint)] text-[var(--a-brand-ink)]"
                              : "text-[#33433f] hover:bg-[#eef1f2]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-[var(--a-border)] p-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-[var(--a-muted)] hover:bg-[#eef1f2]"
            >
              View live site ↗
            </a>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-[var(--a-muted)] hover:bg-[#eef1f2]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* content */}
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1760px] px-4 py-6 sm:px-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
