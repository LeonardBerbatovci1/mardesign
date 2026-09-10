import type { MetadataRoute } from "next";

import { getSite, getTheme } from "@/lib/content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [site, theme] = await Promise.all([getSite(), getTheme()]);
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: theme.colors.ink,
    theme_color: theme.colors.ink,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
