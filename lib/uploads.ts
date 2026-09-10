/**
 * Uploaded media.
 *
 * Files are written under CONTENT_DIR/uploads (persistent, outside the app) and
 * served back through /api/media/<name>. The build-time images shipped in
 * /public/images stay where they are; anything the client uploads lives here.
 *
 * A stored reference is always the public path "/api/media/<name>", so the
 * <Image> components need no special casing.
 */
import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { contentDir } from "./store";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
};

export const ACCEPTED_TYPES = Object.keys(EXT_BY_TYPE);
export const MEDIA_URL_PREFIX = "/api/media/";

export function uploadsDir(): string {
  return path.join(contentDir(), "uploads");
}

/** Reject anything that could escape the uploads directory. */
function safeName(name: string): string {
  const base = path.basename(name);
  if (!/^[A-Za-z0-9._-]+$/.test(base) || base.startsWith(".")) {
    throw new Error("Bad file name.");
  }
  return base;
}

export type StoredFile = {
  name: string;
  url: string;
  size: number;
  modified: number;
};

export async function saveUpload(file: File): Promise<StoredFile> {
  if (file.size > MAX_BYTES) {
    throw new Error(`File is larger than ${MAX_BYTES / 1024 / 1024} MB.`);
  }
  const ext = EXT_BY_TYPE[file.type];
  if (!ext) throw new Error(`Unsupported file type: ${file.type || "unknown"}.`);

  const dir = uploadsDir();
  await fs.mkdir(dir, { recursive: true });

  const slug = file.name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || "file";
  const name = `${slug}-${crypto.randomBytes(4).toString("hex")}${ext}`;

  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, name), buf);

  return { name, url: MEDIA_URL_PREFIX + name, size: buf.length, modified: Date.now() };
}

export async function listUploads(): Promise<StoredFile[]> {
  const dir = uploadsDir();
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return [];
  }
  const out = await Promise.all(
    names
      .filter((n) => EXT_BY_TYPE[typeFromExt(n)])
      .map(async (n) => {
        const st = await fs.stat(path.join(dir, n));
        return {
          name: n,
          url: MEDIA_URL_PREFIX + n,
          size: st.size,
          modified: st.mtimeMs,
        };
      }),
  );
  return out.sort((a, b) => b.modified - a.modified);
}

export async function deleteUpload(name: string): Promise<void> {
  await fs.unlink(path.join(uploadsDir(), safeName(name)));
}

export async function readUpload(
  name: string,
): Promise<{ body: Buffer; contentType: string } | null> {
  const safe = safeName(name);
  const type = typeFromExt(safe);
  if (!EXT_BY_TYPE[type]) return null;
  try {
    const body = await fs.readFile(path.join(uploadsDir(), safe));
    return { body, contentType: type };
  } catch {
    return null;
  }
}

function typeFromExt(name: string): string {
  const ext = path.extname(name).toLowerCase();
  const entry = Object.entries(EXT_BY_TYPE).find(([, e]) => e === ext);
  return entry ? entry[0] : "";
}
