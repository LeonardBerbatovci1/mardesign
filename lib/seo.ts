import type { Metadata } from "next";

import type { Category, Project, Site } from "./types";

/**
 * The canonical origin. Environment wins (set NEXT_PUBLIC_SITE_URL on the
 * server), then the value saved in site.json, then a hard default. No trailing
 * slash.
 */
export function siteUrl(site?: Pick<Site, "url">): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    site?.url ||
    "https://mardesign-ks.com";
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(path: string, site?: Pick<Site, "url">): string {
  const base = siteUrl(site);
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Trim copy to a clean meta-description length. */
export function clampDescription(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/[\s,.;:]+\S*$/, "")}…`;
}

type PageMetaInput = {
  site: Site;
  title?: string;
  description: string;
  path: string;
  /** Public path to a share image, or undefined for the site default. */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
};

/**
 * One place that assembles per-page Metadata: canonical URL, Open Graph and
 * Twitter cards, all resolved against the canonical origin.
 */
export function pageMetadata({
  site,
  title,
  description,
  path,
  image,
  imageAlt,
  type = "website",
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path, site);
  const desc = clampDescription(description);
  const ogImage = absoluteUrl(image ?? "/og.png", site);
  const fullTitle = title ? `${title} — ${site.name}` : site.seo.title;

  return {
    title: title ?? { absolute: site.seo.title },
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: site.name,
      title: fullTitle,
      description: desc,
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt ?? `${site.name} — ${site.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  };
}

/* ── JSON-LD ────────────────────────────────────────────────────────── */

export type JsonLd = Record<string, unknown>;

/**
 * Organization + LocalBusiness in one node. Mardesign is a physical fabrication
 * studio, so the LocalBusiness fields (address, geo, hours, phone, areaServed)
 * matter as much as the brand-level ones.
 */
export function organizationJsonLd(site: Site): JsonLd {
  const base = siteUrl(site);
  const b = site.business;
  const sameAs = site.social.map((s) => s.href).filter((h) => !h.includes("wa.me"));

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": `${base}/#organization`,
    name: site.name,
    legalName: b.legalName,
    url: base,
    logo: `${base}/icon.svg`,
    image: `${base}/og.png`,
    description: site.seo.description,
    foundingDate: b.foundingYear,
    slogan: site.script,
    email: site.contact.email,
    telephone: b.phone,
    priceRange: b.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.streetAddress,
      addressLocality: b.addressLocality,
      addressRegion: b.addressRegion,
      postalCode: b.postalCode,
      addressCountry: b.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: b.latitude,
      longitude: b.longitude,
    },
    areaServed: b.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    sameAs,
    knowsAbout: site.seo.keywords,
  };
}

export function websiteJsonLd(site: Site): JsonLd {
  const base = siteUrl(site);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: site.name,
    publisher: { "@id": `${base}/#organization` },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(
  site: Site,
  items: { name: string; path: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path, site),
    })),
  };
}

/** A service category as an schema.org Service offered by the organization. */
export function serviceJsonLd(site: Site, category: Category): JsonLd {
  const base = siteUrl(site);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: category.title,
    description: category.description || category.cardDescription,
    serviceType: category.title,
    provider: { "@id": `${base}/#organization` },
    areaServed: site.business.areaServed.map((name) => ({ "@type": "Place", name })),
    url: absoluteUrl(`/work/${category.slug}`, site),
  };
}

/** A completed project as a CreativeWork case study. */
export function projectJsonLd(
  site: Site,
  category: Category,
  project: Project,
): JsonLd {
  const base = siteUrl(site);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    abstract: project.summary || undefined,
    description: project.description || project.summary || category.cardDescription,
    image: absoluteUrl(project.image, site),
    url: absoluteUrl(`/work/${category.slug}/${project.slug}`, site),
    dateCreated: project.year || undefined,
    creator: { "@id": `${base}/#organization` },
    about: category.title,
    ...(project.client
      ? { sourceOrganization: { "@type": "Organization", name: project.client } }
      : {}),
  };
}
