import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { PageTitle, PageTopBar } from "@/components/PageHeader";
import { getProject, getSite, getWork } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata, projectJsonLd } from "@/lib/seo";

export const revalidate = 3600;

type Params = { params: Promise<{ slug: string; project: string }> };

export async function generateStaticParams() {
  const work = await getWork();
  return work.categories.flatMap((c) =>
    c.projects.map((p) => ({ slug: c.slug, project: p.slug })),
  );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug, project } = await params;
  const [site, found] = await Promise.all([getSite(), getProject(slug, project)]);
  if (!found) return {};
  const { category, project: p } = found;
  const desc =
    p.summary ||
    (p.description ?? "").split(/\n{2,}/)[0] ||
    `${p.title} — ${category.title.toLowerCase()} by ${site.name}${p.client ? ` for ${p.client}` : ""}.`;
  return pageMetadata({
    site,
    title: `${p.title} — ${category.title}`,
    description: desc,
    path: `/work/${category.slug}/${p.slug}`,
    image: p.image,
    imageAlt: p.title,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug, project } = await params;
  const [site, found] = await Promise.all([getSite(), getProject(slug, project)]);
  if (!found) notFound();

  const { category, project: p } = found;
  const paragraphs = (p.description ?? "")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);

  const facts = [
    ["Client", p.client],
    ["Year", p.year],
    ["Location", p.location],
    ["Category", category.title],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(site, [
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: category.title, path: `/work/${category.slug}` },
            { name: p.title, path: `/work/${category.slug}/${p.slug}` },
          ]),
          projectJsonLd(site, category, p),
        ]}
      />
      <Nav primary={site.primaryNav} secondary={site.secondaryNav} />

      <main
        id="main"
        className="mx-auto w-full max-w-[1500px] px-6 pt-8 sm:px-10 lg:px-16"
      >
        <PageTopBar
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Work", href: "/work" },
            { label: category.title, href: `/work/${category.slug}` },
            { label: p.title },
          ]}
          script={site.script}
        />

        <PageTitle title={p.title} className="mt-3 max-w-[20ch]" />
        {p.summary && (
          <p className="mt-3 max-w-[52ch] text-[clamp(1.05rem,1.5vw,1.35rem)] font-light text-accent">
            {p.summary}
          </p>
        )}

        {/* cover */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-hairline/60">
          <Image
            src={p.image}
            alt={p.title}
            width={p.width}
            height={p.height}
            priority
            sizes="(max-width: 1500px) 100vw, 1440px"
            className="max-h-[72vh] w-full object-cover"
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4 text-[clamp(1rem,1.3vw,1.15rem)] font-light leading-relaxed text-white/90">
            {paragraphs.length > 0 ? (
              paragraphs.map((para, i) => <p key={i}>{para}</p>)
            ) : (
              <p className="text-white/60">
                No write-up for this project yet.
              </p>
            )}
          </div>

          {facts.length > 0 && (
            <dl className="h-fit space-y-4 rounded-2xl border border-hairline/50 bg-panel/40 p-6">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-soft">
                    {k}
                  </dt>
                  <dd className="mt-1 text-white/90">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {p.gallery && p.gallery.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-6">
              <h2 className="display-title shrink-0 text-[clamp(1.1rem,1.9vw,1.6rem)] text-white">
                Gallery
              </h2>
              <span aria-hidden="true" className="h-px flex-1 bg-accent/45" />
            </div>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.gallery.map((img, i) => (
                <li key={i}>
                  <figure className="overflow-hidden rounded-xl border border-hairline/60 bg-panel/50">
                    <Image
                      src={img.src}
                      alt={img.alt || `${p.title} — image ${i + 1}`}
                      width={img.width}
                      height={img.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="h-auto w-full object-cover"
                    />
                    {img.caption && (
                      <figcaption className="p-3 text-xs text-white/70">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-16 border-t border-hairline/40 pt-8">
          <Link
            href={`/work/${category.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-accent transition-colors hover:text-accent-soft"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M12 5.5 5.5 12 12 18.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All {category.title} projects
          </Link>
        </div>
      </main>

      <Footer site={site} />
    </>
  );
}
