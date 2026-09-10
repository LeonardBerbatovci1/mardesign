import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Nav } from "@/components/Nav";
import { PageTitle, PageTopBar } from "@/components/PageHeader";
import { ProjectGallery } from "@/components/ProjectGallery";
import { getCategories, getCategory, getSite } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";

export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [site, category] = await Promise.all([getSite(), getCategory(slug)]);
  if (!category) return {};
  return pageMetadata({
    site,
    title: category.title,
    description: `${category.description} ${category.title} designed, produced and installed by ${site.name} in ${site.business.addressLocality}, ${site.contact.location.slice(-1)[0]}.`,
    path: `/work/${category.slug}`,
    image: category.projects[0]?.image,
  });
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const [site, category] = await Promise.all([getSite(), getCategory(slug)]);

  if (!category) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(site, [
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: category.title, path: `/work/${category.slug}` },
          ]),
          serviceJsonLd(site, category),
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
            { label: category.title },
          ]}
          script={site.script}
        />

        <div className="relative mt-3 lg:min-h-[420px]">
          <PageTitle
            title={category.title}
            subtitle="solutions that stand out."
            className="lg:max-w-[58%]"
          />

          <p className="mt-8 max-w-[44ch] text-[clamp(1rem,1.3vw,1.15rem)] font-light leading-relaxed text-white/90">
            {category.description}
          </p>

          {/* Neon wireframe of the product type, floated right on wide screens. */}
          <Image
            src={category.illustration.src}
            alt={`${category.title} — illustration`}
            width={category.illustration.width}
            height={category.illustration.height}
            priority
            sizes="(max-width: 1024px) 60vw, 420px"
            className="mx-auto mt-10 h-auto max-h-[240px] w-auto object-contain sm:max-h-[300px] lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:max-h-[380px] lg:max-w-[min(30vw,420px)]"
          />
        </div>

        <ProjectGallery
          categorySlug={category.slug}
          title={`Our ${category.title} projects`}
          projects={category.projects}
        />
      </main>

      <Footer site={site} />
    </>
  );
}
