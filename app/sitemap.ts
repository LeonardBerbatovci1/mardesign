import type { MetadataRoute } from "next";

import { getSite, getWork } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, work] = await Promise.all([getSite(), getWork()]);
  const base = siteUrl(site);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  const categoryPages: MetadataRoute.Sitemap = work.categories.map((c) => ({
    url: `${base}/work/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectPages: MetadataRoute.Sitemap = work.categories.flatMap((c) =>
    c.projects.map((p) => ({
      url: `${base}/work/${c.slug}/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    })),
  );

  return [...staticPages, ...categoryPages, ...projectPages];
}
