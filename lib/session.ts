/**
 * Token signing/verification using the Web Crypto API only, so it runs in
 * both the Edge middleware and Node server actions. No `server-only`, no
 * `node:crypto`, no npm deps.
 *
 * A token is `emailB64url.expiryMillis.hmacBase64Url`, where the HMAC covers
 * `email.expiry` — so the signed-in identity travels with the session and
 * can't be swapped without invalidating the signature.
 */

const enc = new TextEncoder();
const dec = new TextDecoder();

function b64urlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const bin = String.fromCharCode(...arr);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(value: string): string {
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const bin = atob(value.replace(/-/g, "+").replace(/_/g, "/") + pad);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return dec.decode(bytes);
}

async function key(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

async function hmac(value: string, secret: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await key(secret), enc.encode(value));
  return b64urlEncode(sig);
}

/** Timing-safe string compare. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function requireSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short — set a random string of 32+ characters.",
    );
  }
  return s;
}

export const SESSION_MAX_AGE_S = 60 * 60 * 12; // 12 hours

export async function createSessionToken(email: string): Promise<string> {
  const secret = requireSecret();
  const emailPart = b64urlEncode(enc.encode(email));
  const expiry = String(Date.now() + SESSION_MAX_AGE_S * 1000);
  const mac = await hmac(`${email}.${expiry}`, secret);
  return `${emailPart}.${expiry}.${mac}`;
}

export type SessionCheck = { ok: true; email: string } | { ok: false };

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<SessionCheck> {
  if (!token) return { ok: false };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false };
  const [emailPart, expiry, mac] = parts;
  if (!/^\d+$/.test(expiry)) return { ok: false };

  let email: string;
  try {
    email = b64urlDecode(emailPart);
  } catch {
    return { ok: false };
  }

  let expected: string;
  try {
    expected = await hmac(`${email}.${expiry}`, requireSecret());
  } catch {
    return { ok: false };
  }
  if (!safeEqual(mac, expected)) return { ok: false };
  if (Number(expiry) <= Date.now()) return { ok: false };
  return { ok: true, email };
}

export const SESSION_COOKIE = "mardesign_session";
