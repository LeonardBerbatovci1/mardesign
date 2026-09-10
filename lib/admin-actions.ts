"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { checkPassword, endSession, isAuthenticated, startSession } from "./auth";
import { SCHEMA_BY_DOC } from "./schemas";
import { type DocName, readDoc, resetDoc, writeDoc } from "./store";
import { deleteUpload, saveUpload } from "./uploads";

export type ActionResult = { ok: true } | { ok: false; error: string };

/* ── auth ─────────────────────────────────────────────────────────── */

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  try {
    if (!checkPassword(password)) {
      return { ok: false, error: "Wrong password." };
    }
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }

  await startSession();
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

/* ── content ──────────────────────────────────────────────────────── */

async function assertAuthed() {
  if (!(await isAuthenticated())) {
    throw new Error("Not authenticated.");
  }
}

/** Push every changed page. The whole site is small, so revalidate broadly. */
function revalidateSite() {
  revalidatePath("/", "layout");
}

/**
 * Save one document. The dashboard forms serialise their state to JSON and send
 * it as the `json` field; we validate against the matching schema before it is
 * written.
 */
export async function saveDocAction(
  doc: DocName,
  json: string,
): Promise<ActionResult> {
  try {
    await assertAuthed();
    const parsed = SCHEMA_BY_DOC[doc].safeParse(JSON.parse(json));
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      const where = first?.path.join(" › ") || "form";
      return { ok: false, error: `${where}: ${first?.message ?? "invalid"}` };
    }
    await writeDoc(doc, parsed.data);
    revalidateSite();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function resetDocAction(doc: DocName): Promise<ActionResult> {
  try {
    await assertAuthed();
    await resetDoc(doc);
    revalidateSite();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function getDocAction<T>(doc: DocName): Promise<T> {
  await assertAuthed();
  return readDoc<T>(doc);
}

/* ── media ────────────────────────────────────────────────────────── */

export async function uploadMediaAction(
  formData: FormData,
): Promise<{ ok: true; url: string; width: number; height: number } | ActionResult> {
  try {
    await assertAuthed();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "No file selected." };
    }
    const stored = await saveUpload(file);
    const dims = await imageSize(file);
    return { ok: true, url: stored.url, width: dims.width, height: dims.height };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteMediaAction(name: string): Promise<ActionResult> {
  try {
    await assertAuthed();
    await deleteUpload(name);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/**
 * Read intrinsic pixel dimensions from the file header so the dashboard can
 * store width/height alongside every image (needed by next/image and by the
 * layouts, which reserve space from the aspect ratio).
 */
async function imageSize(file: File): Promise<{ width: number; height: number }> {
  const buf = Buffer.from(await file.arrayBuffer());

  // PNG
  if (buf.length > 24 && buf.toString("ascii", 1, 4) === "PNG") {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  // JPEG: walk the marker segments to the first SOF
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let o = 2;
    while (o < buf.length) {
      if (buf[o] !== 0xff) break;
      const marker = buf[o + 1];
      const len = buf.readUInt16BE(o + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buf.readUInt16BE(o + 5), width: buf.readUInt16BE(o + 7) };
      }
      o += 2 + len;
    }
  }
  // WebP (VP8X / VP8 / VP8L)
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const fmt = buf.toString("ascii", 12, 16);
    if (fmt === "VP8X ".trim()) {
      return {
        width: 1 + buf.readUIntLE(24, 3),
        height: 1 + buf.readUIntLE(27, 3),
      };
    }
    if (fmt === "VP8 ".trim()) {
      return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
    }
  }

  // SVG / unknown: caller can adjust, but give a sane 1:1 default.
  return { width: 1200, height: 1200 };
}
