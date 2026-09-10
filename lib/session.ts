/**
 * Token signing/verification using the Web Crypto API only, so it runs in
 * both the Edge middleware and Node server actions. No `server-only`, no
 * `node:crypto`, no npm deps.
 *
 * A token is `expiryMillis.hmacBase64Url`. The payload is just the expiry —
 * enough for one shared login. Named accounts later would widen the payload.
 */

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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
  return b64url(sig);
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

export async function createSessionToken(): Promise<string> {
  const secret = requireSecret();
  const expiry = String(Date.now() + SESSION_MAX_AGE_S * 1000);
  return `${expiry}.${await hmac(expiry, secret)}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const expiry = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  if (!/^\d+$/.test(expiry)) return false;

  let expected: string;
  try {
    expected = await hmac(expiry, requireSecret());
  } catch {
    return false;
  }
  if (!safeEqual(mac, expected)) return false;
  return Number(expiry) > Date.now();
}

export const SESSION_COOKIE = "mardesign_session";
