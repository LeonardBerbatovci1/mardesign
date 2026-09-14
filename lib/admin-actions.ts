"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  checkCredentials,
  endSession,
  getSessionEmail,
  isAuthenticated,
  needsSetup,
  startSession,
} from "./auth";
import { newUserSchema, updateUserSchema, SCHEMA_BY_DOC } from "./schemas";
import { type DocName, readDoc, resetDoc, writeDoc } from "./store";
import { deleteUpload, saveUpload } from "./uploads";
import {
  createUser,
  deleteUser,
  listPublicUsers,
  updateUser,
  type PublicUser,
} from "./users";

export type ActionResult = { ok: true } | { ok: false; error: string };

/* ── auth ─────────────────────────────────────────────────────────── */

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  let check: Awaited<ReturnType<typeof checkCredentials>>;
  try {
    check = await checkCredentials(email, password);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  if (!check.ok) {
    return { ok: false, error: "Wrong email or password." };
  }

  try {
    await startSession(check.email);
  } catch (e) {
    // e.g. AUTH_SECRET missing/too short in the environment — show it on the
    // login form instead of an uncaught server exception.
    return { ok: false, error: (e as Error).message };
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

/**
 * Create the very first dashboard account, right from the browser. Only
 * works while needsSetup() is true — re-checked here, not just on the page,
 * since a server action can be invoked directly.
 */
export async function setupAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!(await needsSetup())) {
    return { ok: false, error: "Setup has already been completed. Go to /admin/login." };
  }

  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password !== confirm) {
    return { ok: false, error: "Passwords don't match." };
  }

  const parsed = newUserSchema.safeParse({ name, email, password });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  let user;
  try {
    user = await createUser(parsed.data.name, parsed.data.email, parsed.data.password);
    await startSession(user.email);
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  redirect("/admin");
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

/* ── users ────────────────────────────────────────────────────────── */

export async function listUsersAction(): Promise<PublicUser[]> {
  await assertAuthed();
  return listPublicUsers();
}

/** The account currently signed in — shown in the sidebar and the Users page. */
export async function currentUserEmailAction(): Promise<string | null> {
  return getSessionEmail();
}

type UserActionResult = { ok: true; user: PublicUser } | { ok: false; error: string };

export async function createUserAction(formData: FormData): Promise<UserActionResult> {
  try {
    await assertAuthed();
    const parsed = newUserSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }
    const user = await createUser(parsed.data.name, parsed.data.email, parsed.data.password);
    revalidatePath("/admin/users");
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateUserAction(
  id: string,
  patch: { name: string; email: string; password: string },
): Promise<UserActionResult> {
  try {
    await assertAuthed();
    const parsed = updateUserSchema.safeParse({ id, ...patch });
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
    }
    const user = await updateUser(parsed.data.id, {
      name: parsed.data.name,
      email: parsed.data.email,
      password: parsed.data.password || undefined,
    });
    revalidatePath("/admin/users");
    return { ok: true, user };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  try {
    await assertAuthed();
    await deleteUser(id);
    revalidatePath("/admin/users");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
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
