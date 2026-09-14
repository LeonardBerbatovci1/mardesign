/**
 * Node-side auth helpers for the admin area.
 *
 * Two ways to sign in, checked in order:
 *  1. The "owner" account — ADMIN_EMAIL / ADMIN_PASSWORD in the environment.
 *     Always available, never stored on disk. This is the recovery login:
 *     it keeps working even if every dashboard-managed user is deleted.
 *  2. Named accounts managed from /admin/users (lib/users.ts), stored as
 *     salted-hash passwords in CONTENT_DIR/users.json.
 *
 * Session cookie management + token signing: token signing itself lives in
 * lib/session.ts so the middleware can share it on the Edge runtime.
 */
import "server-only";

import { cookies } from "next/headers";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  createSessionToken,
  verifySessionToken,
} from "./session";
import { findUserByEmail, hasAnyUsers, verifyPasswordHash } from "./users";

/** Timing-safe compare without pulling in node:crypto (this file also runs paths shared with Edge-adjacent code). */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Check an email + password pair against the owner account and, failing
 * that, the stored users. Returns the identity on success so the caller can
 * start a session for it. The caller shows one generic error either way, so
 * a wrong guess never reveals which field — or which account — was wrong.
 */
export async function checkCredentials(
  email: string,
  password: string,
): Promise<{ ok: true; email: string } | { ok: false }> {
  const ownerEmail = process.env.ADMIN_EMAIL;
  const ownerPassword = process.env.ADMIN_PASSWORD;
  const hasOwner = Boolean(ownerEmail && ownerPassword);

  if (hasOwner) {
    const emailOk = safeEqual(normalizeEmail(email), normalizeEmail(ownerEmail!));
    const passwordOk = safeEqual(password, ownerPassword!);
    if (emailOk && passwordOk) return { ok: true, email: normalizeEmail(ownerEmail!) };
  }

  const user = await findUserByEmail(email);
  if (user && (await verifyPasswordHash(password, user.passwordHash))) {
    return { ok: true, email: user.email };
  }

  if (!hasOwner && !(await hasAnyUsers())) {
    throw new Error(
      "No admin account is set up yet. Go to /admin/setup to create one.",
    );
  }
  return { ok: false };
}

/**
 * True when nobody can log in yet — no owner pair in the environment and no
 * stored users. In that state /admin/login redirects to /admin/setup, which
 * lets the first person create an account right in the browser without ever
 * touching the hosting environment's variables.
 */
export async function needsSetup(): Promise<boolean> {
  const hasOwner = Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
  if (hasOwner) return false;
  return !(await hasAnyUsers());
}

export async function startSession(email: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const check = await verifySessionToken(jar.get(SESSION_COOKIE)?.value);
  return check.ok;
}

/** The email of the signed-in account, or null if not authenticated. */
export async function getSessionEmail(): Promise<string | null> {
  const jar = await cookies();
  const check = await verifySessionToken(jar.get(SESSION_COOKIE)?.value);
  return check.ok ? check.email : null;
}

export { SESSION_COOKIE };
