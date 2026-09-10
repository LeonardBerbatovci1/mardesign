import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { PageTitle, PageTopBar } from "@/components/PageHeader";
import { Timeline } from "@/components/Timeline";
import { getAbout, getSite } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [site, about] = await Promise.all([getSite(), getAbout()]);
  return pageMetadata({
    site,
    title: about.title,
    description: about.body,
    path: "/about",
    image: about.image.src,
    imageAlt: about.image.alt,
  });
}

export default async function AboutPage() {
  const [site, about] = await Promise.all([getSite(), getAbout()]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd(site, [
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <Nav primary={site.primaryNav} secondary={site.secondaryNav} />

      <main
        id="main"
        className="mx-auto w-full max-w-[1500px] px-6 pt-8 sm:px-10 lg:px-16"
      >
        <PageTopBar
          crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
          script={site.script}
        />

        <div className="mt-3 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <PageTitle title={about.title} />

            <p className="display-sub mt-2 max-w-[14ch] text-[clamp(1.5rem,3.4vw,2.6rem)] leading-tight">
              {about.subtitle}
            </p>

            <p className="mt-6 max-w-[48ch] text-[clamp(1rem,1.35vw,1.2rem)] font-light leading-relaxed text-white/90">
              {about.body}
            </p>

            <Link
              href={about.cta.href}
              className="mt-8 inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent-soft hover:text-ink"
            >
              {about.cta.label}
            </Link>
          </div>

          <Image
            src={about.image.src}
            alt={about.image.alt ?? ""}
            width={about.image.width}
            height={about.image.height}
            priority
            sizes="(max-width: 1024px) 92vw, 780px"
            className="h-auto w-full lg:mt-6"
          />
        </div>

        <section className="mt-20 border-t border-hairline/40 pt-14">
          <h2 className="display-title text-[clamp(1.9rem,4vw,3rem)] text-white">
            {about.story.title}
          </h2>
          <p className="display-sub mt-2 max-w-[26ch] text-[clamp(1rem,1.6vw,1.35rem)]">
            {about.story.subtitle}
          </p>

          <Timeline milestones={about.story.milestones} />
        </section>
      </main>

      <Footer site={site} />
    </>
  );
}
