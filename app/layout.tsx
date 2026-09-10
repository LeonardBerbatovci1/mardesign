import type { Metadata } from "next";
import { Caveat_Brush, Nunito, Outfit } from "next/font/google";

import { Analytics } from "@/components/Analytics";
import { JsonLd } from "@/components/JsonLd";
import { getSite, getTheme } from "@/lib/content";
import {
  organizationJsonLd,
  siteUrl,
  websiteJsonLd,
} from "@/lib/seo";
import { themeToCssVars } from "@/lib/theme";

import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "700", "800", "900", "1000"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const caveatBrush = Caveat_Brush({
  subsets: ["latin"],
  variable: "--font-caveat-brush",
  weight: "400",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const base = siteUrl(site);

  return {
    metadataBase: new URL(base),
    title: {
      default: site.seo.title,
      template: `%s — ${site.name}`,
    },
    description: site.seo.description,
    applicationName: site.name,
    keywords: site.seo.keywords,
    authors: [{ name: site.name, url: base }],
    creator: site.name,
    publisher: site.name,
    alternates: { canonical: base },
    category: "business",
    formatDetection: { telephone: true, address: true, email: true },
    openGraph: {
      type: "website",
      url: base,
      siteName: site.name,
      title: site.seo.title,
      description: site.seo.description,
      locale: "en_US",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${site.name} — ${site.tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.seo.title,
      description: site.seo.description,
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.png" }],
    },
    manifest: "/manifest.webmanifest",
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [theme, site] = await Promise.all([getTheme(), getSite()]);

  return (
    <html
      lang="en"
      className={`${nunito.variable} ${outfit.variable} ${caveatBrush.variable}`}
      style={themeToCssVars(theme) as React.CSSProperties}
    >
      <body className="min-h-dvh">
        <JsonLd data={[organizationJsonLd(site), websiteJsonLd(site)]} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:font-medium focus:text-ink"
        >
          Skip to content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
