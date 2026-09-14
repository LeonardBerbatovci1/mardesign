/**
 * Node-side auth helpers for the admin area. Password check + session cookie
 * management. Token signing itself lives in lib/session.ts so the middleware
 * can share it on the Edge runtime.
 */
import "server-only";

import { cookies } from "next/headers";

import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  createSessionToken,
  verifySessionToken,
} from "./session";

/** Timing-safe compare without pulling in node:crypto. */
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
 * Check an email + password pair against the single admin account configured
 * in the environment. Both must match — the caller shows one generic error
 * either way, so a wrong guess never reveals which field was incorrect.
 */
export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail) throw new Error("ADMIN_EMAIL is not set.");
  if (!expectedPassword) throw new Error("ADMIN_PASSWORD is not set.");

  const emailOk = safeEqual(normalizeEmail(email), normalizeEmail(expectedEmail));
  const passwordOk = safeEqual(password, expectedPassword);
  return emailOk && passwordOk;
}

export async function startSession(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(), {
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
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export { SESSION_COOKIE };
