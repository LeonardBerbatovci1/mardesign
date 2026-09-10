/**
 * The single seam between content storage and the UI.
 *
 * Pages call only these getters. They read through lib/store.ts, which today
 * keeps content as JSON on disk; swapping that for a database changes nothing
 * here and nothing in any component.
 */
import "server-only";

import { readDoc, writeDoc } from "./store";
import type {
  About,
  Category,
  Contact,
  Home,
  Project,
  Site,
  Theme,
  Work,
} from "./types";

export async function getSite(): Promise<Site> {
  return readDoc<Site>("site");
}

export async function getHome(): Promise<Home> {
  return readDoc<Home>("home");
}

export async function getWork(): Promise<Work> {
  return readDoc<Work>("work");
}

export async function getCategories(): Promise<Category[]> {
  return (await getWork()).categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  const work = await getWork();
  return work.categories.find((c) => c.slug === slug);
}

export async function getProject(
  categorySlug: string,
  projectSlug: string,
): Promise<{ category: Category; project: Project } | undefined> {
  const category = await getCategory(categorySlug);
  const project = category?.projects.find((p) => p.slug === projectSlug);
  if (!category || !project) return undefined;
  return { category, project };
}

export async function getAbout(): Promise<About> {
  return readDoc<About>("about");
}

export async function getContact(): Promise<Contact> {
  return readDoc<Contact>("contact");
}

export async function getTheme(): Promise<Theme> {
  return readDoc<Theme>("theme");
}

/* ── writers, used only by the admin dashboard ─────────────────────── */

export const saveSite = (v: Site) => writeDoc("site", v);
export const saveHome = (v: Home) => writeDoc("home", v);
export const saveWork = (v: Work) => writeDoc("work", v);
export const saveAbout = (v: About) => writeDoc("about", v);
export const saveContact = (v: Contact) => writeDoc("contact", v);
export const saveTheme = (v: Theme) => writeDoc("theme", v);
