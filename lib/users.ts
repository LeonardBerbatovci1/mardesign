/**
 * Named dashboard accounts, managed from /admin/users.
 *
 * Kept separate from the DOC_NAMES content system in lib/store.ts: this is a
 * growing collection with password hashes in it, not a single settings
 * document, and it must never be exposed to the generic "edit this whole
 * document" admin forms or reset to a checked-in default.
 *
 * Stored at CONTENT_DIR/users.json. The environment's ADMIN_EMAIL /
 * ADMIN_PASSWORD pair (see lib/auth.ts) always works too, independently of
 * this file — that's the recovery login if this list is ever empty or wrong.
 */
import "server-only";

import { randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

import { contentDir, writeAtomic } from "./store";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

export type UserRecord = {
  id: string;
  name: string;
  email: string; // stored lowercase
  passwordHash: string; // "saltHex:hashHex"
  createdAt: string; // ISO
};

export type PublicUser = Omit<UserRecord, "passwordHash">;

function usersPath(): string {
  return path.join(contentDir(), "users.json");
}

function normalizeEmail(input: string): string {
  return input.trim().toLowerCase();
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scryptAsync(password, salt, 64);
  return `${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPasswordHash(
  password: string,
  stored: string,
): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const derived = await scryptAsync(password, salt, expected.length);
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

async function readUsers(): Promise<UserRecord[]> {
  try {
    const raw = JSON.parse(await fs.readFile(usersPath(), "utf8"));
    return Array.isArray(raw.users) ? raw.users : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: UserRecord[]): Promise<void> {
  await writeAtomic(usersPath(), JSON.stringify({ users }, null, 2));
}

function toPublic({ passwordHash: _passwordHash, ...rest }: UserRecord): PublicUser {
  return rest;
}

export async function listPublicUsers(): Promise<PublicUser[]> {
  const users = await readUsers();
  return users
    .map(toPublic)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function hasAnyUsers(): Promise<boolean> {
  return (await readUsers()).length > 0;
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const norm = normalizeEmail(email);
  return (await readUsers()).find((u) => u.email === norm);
}

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<PublicUser> {
  const norm = normalizeEmail(email);
  const users = await readUsers();
  if (users.some((u) => u.email === norm)) {
    throw new Error("A user with that email already exists.");
  }
  const record: UserRecord = {
    id: randomUUID(),
    name: name.trim(),
    email: norm,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  users.push(record);
  await writeUsers(users);
  return toPublic(record);
}

export async function updateUser(
  id: string,
  patch: { name?: string; email?: string; password?: string },
): Promise<PublicUser> {
  const users = await readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) throw new Error("User not found.");

  const next: UserRecord = { ...users[idx] };
  if (patch.name !== undefined) next.name = patch.name.trim();
  if (patch.email !== undefined) {
    const norm = normalizeEmail(patch.email);
    if (users.some((u, i) => i !== idx && u.email === norm)) {
      throw new Error("A user with that email already exists.");
    }
    next.email = norm;
  }
  if (patch.password) next.passwordHash = await hashPassword(patch.password);

  users[idx] = next;
  await writeUsers(users);
  return toPublic(next);
}

export async function deleteUser(id: string): Promise<void> {
  const users = await readUsers();
  await writeUsers(users.filter((u) => u.id !== id));
}
