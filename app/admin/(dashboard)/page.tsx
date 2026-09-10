import Link from "next/link";

const CARDS = [
  { href: "/admin/home", title: "Home page", body: "Headline, intro, the main product image and the award badges." },
  { href: "/admin/work", title: "Work & projects", body: "The categories, their text and illustrations, and every project photo. Add, remove, reorder." },
  { href: "/admin/about", title: "About page", body: "Company story, the building image and the timeline." },
  { href: "/admin/contact", title: "Contact page", body: "Intro text and the contact people." },
  { href: "/admin/site", title: "Header, footer & links", body: "Menus, the CTA button, social links, address, email and hours." },
  { href: "/admin/theme", title: "Colours", body: "The site palette. Changes apply everywhere at once." },
  { href: "/admin/media", title: "Media library", body: "Every uploaded image. Upload new files or delete unused ones." },
];

export default function AdminHome() {
  return (
    <div>
      <h1 className="admin-page-title">Welcome back</h1>
      <p className="admin-page-lede">
        Pick a section to edit. Changes go live on the website as soon as you save.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="admin-card group transition-shadow hover:shadow-md"
          >
            <p className="admin-section-title text-[var(--a-brand)] group-hover:text-[var(--a-brand-ink)]">
              {c.title}
            </p>
            <p className="mt-1.5 text-sm text-[var(--a-muted)]">{c.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
