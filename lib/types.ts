/**
 * Content model for the whole site.
 *
 * Every page renders from these types and nothing else. Today they are
 * satisfied by the JSON files in /content; when the admin dashboard lands the
 * same types will be satisfied by database rows. Components never read JSON
 * directly, so that swap does not touch the UI layer.
 */

export type NavLink = { label: string; href: string };

export type ImageRef = {
  src: string;
  alt?: string;
  width: number;
  height: number;
};

export type SocialPlatform = "linkedin" | "facebook" | "instagram" | "whatsapp";

export type Seo = {
  /** Home-page <title> and the base for the "%s — Mardesign" template. */
  title: string;
  /** Default meta description, used where a page has nothing more specific. */
  description: string;
  keywords: string[];
};

export type Business = {
  legalName: string;
  foundingYear: string;
  /** Google price-range hint, e.g. "$$". */
  priceRange: string;
  /** Primary public phone number in +country format. */
  phone: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  /** ISO country code — Kosovo is "XK". */
  addressCountry: string;
  latitude: number;
  longitude: number;
  /** Places the business serves — drives the schema.org areaServed. */
  areaServed: string[];
};

export type Site = {
  name: string;
  wordmark: string;
  tagline: string;
  script: string;
  /** Canonical site origin, e.g. https://mardesign-ks.com (no trailing slash). */
  url: string;
  primaryNav: NavLink[];
  secondaryNav: NavLink[];
  cta: NavLink;
  social: { platform: SocialPlatform; href: string }[];
  contact: {
    location: string[];
    email: string;
    workingHours: string;
  };
  seo: Seo;
  business: Business;
};

export type Home = {
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    body: string;
    cta: NavLink;
    image: ImageRef;
    badges: ImageRef[];
  };
};

export type GalleryImage = {
  src: string;
  width: number;
  height: number;
  alt?: string;
  /** Optional one-line caption shown under the image. */
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Cover image — used as the gallery thumbnail and the hero on the project page. */
  image: string;
  width: number;
  height: number;
  /** One line under the title on the project page. */
  summary?: string;
  /** Body copy for the project page; blank lines separate paragraphs. */
  description?: string;
  client?: string;
  year?: string;
  location?: string;
  /** Extra photos shown below the write-up on the project page. */
  gallery?: GalleryImage[];
};

export type Category = {
  slug: string;
  title: string;
  /** Short line used on the /work index cards. */
  cardDescription: string;
  /** Longer intro used at the top of the category page. */
  description: string;
  illustration: { src: string; width: number; height: number };
  projects: Project[];
};

export type Work = {
  title: string;
  subtitle: string;
  categories: Category[];
};

export type Milestone = {
  year: string;
  title: string;
  body: string;
  /** Optional photo for the frame the deck reserves under each milestone. */
  image?: string;
};

export type About = {
  title: string;
  subtitle: string;
  body: string;
  cta: NavLink;
  image: ImageRef;
  story: {
    title: string;
    subtitle: string;
    milestones: Milestone[];
  };
};

export type Person = {
  slug: string;
  name: string;
  role: string;
  phone: string;
  availability: string;
  image: string;
  width: number;
  height: number;
};

export type Contact = {
  title: string;
  subtitle: string;
  body: string;
  people: Person[];
};

/** Editable palette. Rendered as CSS custom properties on <html>. */
export type Theme = {
  colors: {
    ink: string;
    inkDeep: string;
    panel: string;
    accent: string;
    accentSoft: string;
    neon: string;
    hairline: string;
  };
};

export type ThemeColorKey = keyof Theme["colors"];
