import type { Metadata } from "next";

import { CategoryCard } from "@/components/CategoryCard";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { PageTitle, PageTopBar } from "@/components/PageHeader";
import { getSite, getWork } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [site, work] = await Promise.all([getSite(), getWork()]);
  const services = work.categories.map((c) => c.title).join(", ");
  return pageMetadata({
    site,
    title: "Our work",
    description: `${services}. ${work.subtitle} Projects delivered across Kosovo and the Balkans.`,
    path: "/work",
  });
}

export default async function WorkPage() {
  const [site, work] = await Promise.all([getSite(), getWork()]);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(site, [
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
          ]),
          ...work.categories.map((c) => serviceJsonLd(site, c)),
        ]}
      />
      <Nav primary={site.primaryNav} secondary={site.secondaryNav} />

      <main
        id="main"
        className="mx-auto w-full max-w-[1500px] px-6 pt-8 sm:px-10 lg:px-16"
      >
        <PageTopBar
          crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
          script={site.script}
        />

        <PageTitle title={work.title} subtitle={work.subtitle} className="mt-3" />

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5">
          {work.categories.map((category) => (
            <li key={category.slug} className="flex">
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      </main>

      <Footer site={site} />
    </>
  );
}
