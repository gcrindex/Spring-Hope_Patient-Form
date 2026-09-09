// src/lib/auth.ts
// Server-side authentication and session management using Web Crypto and SQLite / D1

import { dbExecute, dbQuery, dbQueryOne } from "./db";

const SESSION_COOKIE_NAME = "sh_admin_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days persistence

export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hashHex = Array.from(new Uint8Array(derived))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, originalHashHex] = storedHash.split(":");
  if (!saltHex || !originalHashHex) return false;

  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const derived = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const derivedHashHex = Array.from(new Uint8Array(derived))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return derivedHashHex === originalHashHex;
}

export async function countAdmins(): Promise<number> {
  const row = await dbQueryOne<{ count: number }>("SELECT count(*) as count FROM admins");
  return row ? Number(row.count) : 0;
}

export async function createAdmin(email: string, passwordHash: string): Promise<string> {
  const id = `admin_${crypto.randomUUID()}`;
  await dbExecute(
    "INSERT INTO admins (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))",
    [id, email.toLowerCase().trim(), passwordHash],
  );
  return id;
}

export async function createSession(adminId: string): Promise<string> {
  const token = `sess_${crypto.randomUUID()}_${Date.now()}`;
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  await dbExecute("INSERT INTO sessions (id, admin_id, expires_at) VALUES (?, ?, ?)", [
    token,
    adminId,
    expiresAt,
  ]);
  return token;
}

export async function validateSession(
  token: string,
): Promise<{ adminId: string; email: string } | null> {
  if (!token) return null;
  const row = await dbQueryOne<{ admin_id: string; email: string; expires_at: string }>(
    `SELECT s.admin_id, s.expires_at, a.email 
     FROM sessions s 
     JOIN admins a ON a.id = s.admin_id 
     WHERE s.id = ?`,
    [token],
  );
  if (!row) return null;
  const expTime = new Date(row.expires_at).getTime();
  if (isNaN(expTime) || expTime <= Date.now()) {
    // expired session
    await deleteSession(token).catch(() => {});
    return null;
  }
  return { adminId: row.admin_id, email: row.email };
}

export async function deleteSession(token: string): Promise<void> {
  if (!token) return;
  await dbExecute("DELETE FROM sessions WHERE id = ?", [token]);
}

export function parseSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function createSessionCookieHeader(token: string, isHttps = false): string {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  const secureFlag = isHttps ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secureFlag}`;
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

export async function authenticateRequest(
  request: Request,
): Promise<{ adminId: string; email: string } | null> {
  const token = parseSessionCookie(request);
  if (!token) return null;
  return await validateSession(token);
}
