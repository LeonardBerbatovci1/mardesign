/**
 * Runtime validation for everything the dashboard writes back. The admin forms
 * submit JSON; these schemas are the gate before it reaches disk, so a bad edit
 * fails with a message instead of corrupting a document.
 *
 * Keep these in step with lib/types.ts.
 */
import { z } from "zod";

const nonEmpty = z.string().trim().min(1, "Required");
const url = z.string().trim().min(1, "Required");
const hex = z
  .string()
  .trim()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex colour like #1b4755");

const navLink = z.object({ label: nonEmpty, href: nonEmpty });

const imageRef = z.object({
  src: url,
  alt: z.string().trim().optional().default(""),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const siteSchema = z.object({
  name: nonEmpty,
  wordmark: nonEmpty,
  tagline: nonEmpty,
  script: nonEmpty,
  url: z.string().trim().url(),
  primaryNav: z.array(navLink).min(1),
  secondaryNav: z.array(navLink),
  cta: navLink,
  social: z.array(
    z.object({
      platform: z.enum(["linkedin", "facebook", "instagram", "whatsapp"]),
      href: nonEmpty,
    }),
  ),
  contact: z.object({
    location: z.array(nonEmpty).min(1),
    email: nonEmpty,
    workingHours: nonEmpty,
  }),
  seo: z.object({
    title: nonEmpty,
    description: nonEmpty,
    keywords: z.array(z.string().trim()).default([]),
  }),
  business: z.object({
    legalName: nonEmpty,
    foundingYear: z.string().trim(),
    priceRange: z.string().trim(),
    phone: z.string().trim(),
    streetAddress: z.string().trim(),
    addressLocality: z.string().trim(),
    addressRegion: z.string().trim(),
    postalCode: z.string().trim(),
    addressCountry: z.string().trim(),
    latitude: z.number(),
    longitude: z.number(),
    areaServed: z.array(z.string().trim()).default([]),
  }),
});

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: nonEmpty,
    title: nonEmpty,
    titleAccent: nonEmpty,
    body: nonEmpty,
    cta: navLink,
    image: imageRef,
    badges: z.array(imageRef),
  }),
});

const galleryImage = z.object({
  src: url,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().trim().optional(),
  caption: z.string().trim().optional(),
});

const project = z.object({
  slug: nonEmpty.regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  title: nonEmpty,
  image: url,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  summary: z.string().trim().optional(),
  description: z.string().trim().optional(),
  client: z.string().trim().optional(),
  year: z.string().trim().optional(),
  location: z.string().trim().optional(),
  gallery: z.array(galleryImage).optional(),
});

const category = z.object({
  slug: nonEmpty.regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and dashes only"),
  title: nonEmpty,
  cardDescription: nonEmpty,
  description: nonEmpty,
  illustration: z.object({
    src: url,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  projects: z.array(project),
});

export const workSchema = z.object({
  title: nonEmpty,
  subtitle: nonEmpty,
  categories: z.array(category).min(1),
});

const milestone = z.object({
  year: nonEmpty,
  title: nonEmpty,
  body: nonEmpty,
  image: z.string().trim().optional(),
});

export const aboutSchema = z.object({
  title: nonEmpty,
  subtitle: nonEmpty,
  body: nonEmpty,
  cta: navLink,
  image: imageRef,
  story: z.object({
    title: nonEmpty,
    subtitle: nonEmpty,
    milestones: z.array(milestone).min(1),
  }),
});

const person = z.object({
  slug: nonEmpty,
  name: nonEmpty,
  role: nonEmpty,
  phone: nonEmpty,
  availability: nonEmpty,
  image: url,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const contactSchema = z.object({
  title: nonEmpty,
  subtitle: nonEmpty,
  body: nonEmpty,
  people: z.array(person),
});

export const themeSchema = z.object({
  colors: z.object({
    ink: hex,
    inkDeep: hex,
    panel: hex,
    accent: hex,
    accentSoft: hex,
    neon: hex,
    hairline: hex,
  }),
});

import type { DocName } from "./store";

export const SCHEMA_BY_DOC = {
  site: siteSchema,
  home: homeSchema,
  work: workSchema,
  about: aboutSchema,
  contact: contactSchema,
  theme: themeSchema,
} satisfies Record<DocName, z.ZodTypeAny>;
