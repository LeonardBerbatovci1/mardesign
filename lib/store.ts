/**
 * Content storage.
 *
 * Documents live as JSON files in a directory that is deliberately OUTSIDE the
 * deployed application, so a redeploy can never wipe the client's edits. Set
 * `CONTENT_DIR` in production (e.g. /home/uXXXXXX/mardesign-data); it defaults
 * to ./data for local development.
 *
 * On first read a document is seeded from the defaults checked into /content,
 * so a fresh install comes up with the site fully populated and later deploys
 * never overwrite live content.
 *
 * This module is the only thing that knows content is stored as files. Moving
 * to MySQL later means reimplementing `readDoc`/`writeDoc` and nothing else.
 */
import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import aboutDefault from "@/content/about.json";
import contactDefault from "@/content/contact.json";
import homeDefault from "@/content/home.json";
import siteDefault from "@/content/site.json";
import themeDefault from "@/content/theme.json";
import workDefault from "@/content/work.json";

export const DOC_NAMES = [
  "site",
  "home",
  "work",
  "about",
  "contact",
  "theme",
] as const;

export type DocName = (typeof DOC_NAMES)[number];

const DEFAULTS: Record<DocName, unknown> = {
  site: siteDefault,
  home: homeDefault,
  work: workDefault,
  about: aboutDefault,
  contact: contactDefault,
  theme: themeDefault,
};

export function contentDir(): string {
  return process.env.CONTENT_DIR
    ? path.resolve(process.env.CONTENT_DIR)
    : path.join(process.cwd(), "data");
}

function docPath(name: DocName): string {
  return path.join(contentDir(), `${name}.json`);
}

/** Write via a temp file + rename so a crash mid-write cannot truncate a document. */
async function writeAtomic(file: string, data: string): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, data, "utf8");
  await fs.rename(tmp, file);
}

export async function readDoc<T>(name: DocName): Promise<T> {
  const file = docPath(name);
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    // No saved copy yet (fresh install), or the file is unreadable: serve the
    // defaults checked into /content. The first admin save writes a real file.
    return DEFAULTS[name] as T;
  }
}

export async function writeDoc<T>(name: DocName, value: T): Promise<void> {
  await writeAtomic(docPath(name), JSON.stringify(value, null, 2));
}

/** Restore a document to the values checked into /content. */
export async function resetDoc(name: DocName): Promise<void> {
  await writeDoc(name, DEFAULTS[name]);
}

export function defaultsFor<T>(name: DocName): T {
  return DEFAULTS[name] as T;
}
