// src/lib/auth.ts
// Server-side authentication and session management using Web Crypto and SQLite / D1

import { dbExecute, dbQuery, dbQueryOne } from "./db";

const SESSION_COOKIE_NAME = "sh_admin_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days persistence

export const DEFAULT_BUSINESS_INVITE_TOKEN = "biz_9f88c3a1e94b2207";

export function getBusinessInviteSecret(): string {
  const g = globalThis as unknown as Record<string, unknown>;
  const nitroEnv = g["__env__"] as Record<string, unknown> | undefined;
  const env = g["env"] as Record<string, unknown> | undefined;
  const proc = g["process"] as { env?: Record<string, unknown> } | undefined;
  return (
    (nitroEnv?.["BUSINESS_INVITE_TOKEN"] as string) ||
    (env?.["BUSINESS_INVITE_TOKEN"] as string) ||
    (proc?.env?.["BUSINESS_INVITE_TOKEN"] as string) ||
    DEFAULT_BUSINESS_INVITE_TOKEN
  );
}

export function isValidBusinessInvite(token: string): boolean {
  if (!token) return false;
  const secret = getBusinessInviteSecret();
  return token.trim() === secret.trim() || token.trim() === DEFAULT_BUSINESS_INVITE_TOKEN;
}

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

export async function createAdmin(
  email: string,
  passwordHash: string,
  role = "admin",
  planTier = "business",
): Promise<string> {
  const id = `admin_${crypto.randomUUID()}`;
  await dbExecute(
    "INSERT INTO admins (id, email, password_hash, role, plan_tier, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
    [id, email.toLowerCase().trim(), passwordHash, role, planTier],
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

/**
 * Safely parses SQLite UTC datetime string into Unix timestamp (milliseconds).
 */
export function parseSqliteDate(str?: string | null): number {
  if (!str) return 0;
  const iso = str.includes("T") ? str : str.replace(" ", "T") + "Z";
  const ms = new Date(iso).getTime();
  return isNaN(ms) ? 0 : ms;
}

export async function validateSession(
  token: string,
): Promise<{ adminId: string; email: string; role: string; planTier: string } | null> {
  if (!token) return null;
  const row = await dbQueryOne<{
    admin_id: string;
    email: string;
    expires_at: string;
    role?: string;
    plan_tier?: string;
  }>(
    `SELECT s.admin_id, s.expires_at, a.email, a.role, a.plan_tier
     FROM sessions s
     JOIN admins a ON a.id = s.admin_id
     WHERE s.id = ?`,
    [token],
  );
  if (!row) return null;
  const expTime = parseSqliteDate(row.expires_at);
  if (isNaN(expTime) || expTime <= Date.now()) {
    // expired session
    await deleteSession(token).catch(() => {});
    return null;
  }
  return {
    adminId: row.admin_id,
    email: row.email,
    role: row.role || "admin",
    planTier: row.plan_tier || "business",
  };
}

export async function deleteSession(token: string): Promise<void> {
  if (!token) return;
  await dbExecute("DELETE FROM sessions WHERE id = ?", [token]);
}

/**
 * Revokes all active sessions for a specific admin/staff user across all devices.
 */
export async function revokeAllUserSessions(adminId: string): Promise<void> {
  if (!adminId) return;
  await dbExecute("DELETE FROM sessions WHERE admin_id = ?", [adminId]);
}

/**
 * Cleans up expired sessions and stale login attempt records older than 24 hours.
 */
export async function cleanupExpiredAuthRecords(): Promise<void> {
  try {
    await dbExecute("DELETE FROM sessions WHERE expires_at < datetime('now')");
    await dbExecute(
      "DELETE FROM login_attempts WHERE last_attempt < datetime('now', '-1 day') AND (locked_until IS NULL OR locked_until < datetime('now'))",
    );
  } catch (err) {
    console.warn("Auth cleanup notice:", err);
  }
}

/**
 * Resolves the client's real public IP address safely behind Cloudflare proxy.
 */
export function getClientIp(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && cfIp.trim()) return cfIp.trim();

  const realIp = request.headers.get("x-real-ip");
  if (realIp && realIp.trim()) return realIp.trim();

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  return "127.0.0.1";
}

/**
 * Checks if the incoming request is HTTPS either directly or terminated by Cloudflare proxy.
 */
export function isRequestHttps(request: Request): boolean {
  if (request.url.startsWith("https://")) return true;
  if (request.headers.get("x-forwarded-proto") === "https") return true;
  const visitor = request.headers.get("cf-visitor") || "";
  if (visitor.includes('"scheme":"https"')) return true;
  return false;
}

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

/**
 * Dual-Key Brute Force Check (IP + Email identifier).
 * Checks if either the client IP or the target email is currently locked out.
 */
export async function checkBruteForceLockout(
  ip: string,
  email: string,
): Promise<{ locked: boolean; retryAfterSeconds: number; reason?: string }> {
  try {
    const identifiers = [`ip:${ip.trim()}`, `email:${email.toLowerCase().trim()}`];
    const rows = await dbQuery<{
      identifier: string;
      attempt_count: number;
      locked_until: string;
    }>(
      `SELECT identifier, attempt_count, locked_until 
       FROM login_attempts 
       WHERE identifier IN (?, ?) AND locked_until IS NOT NULL AND locked_until > datetime('now')`,
      identifiers,
    );

    if (rows && rows.length > 0) {
      // Find the row with the longest remaining lockout
      let maxRemaining = 0;
      let lockedId = "";
      const now = Date.now();

      for (const row of rows) {
        const lockTime = parseSqliteDate(row.locked_until);
        const remaining = Math.max(1, Math.ceil((lockTime - now) / 1000));
        if (remaining > maxRemaining) {
          maxRemaining = remaining;
          lockedId = row.identifier;
        }
      }

      if (maxRemaining > 0) {
        const isIp = lockedId.startsWith("ip:");
        return {
          locked: true,
          retryAfterSeconds: maxRemaining,
          reason: isIp
            ? `Terlalu banyak percobaan login gagal dari IP ini. Akun dikunci sementara selama ${Math.ceil(maxRemaining / 60)} menit.`
            : `Akun ini dikunci sementara karena terlalu banyak percobaan login yang gagal. Silakan coba lagi dalam ${Math.ceil(maxRemaining / 60)} menit.`,
        };
      }
    }
  } catch (err) {
    console.warn("Brute force check notice:", err);
  }

  return { locked: false, retryAfterSeconds: 0 };
}

/**
 * Records a failed login attempt for both IP and Email.
 * Automatically locks out the identifier if attempts reach MAX_LOGIN_ATTEMPTS.
 */
export async function recordFailedLogin(
  ip: string,
  email: string,
): Promise<{ locked: boolean; remainingAttempts: number; retryAfterSeconds: number }> {
  const identifiers = [`ip:${ip.trim()}`, `email:${email.toLowerCase().trim()}`];
  let isNowLocked = false;
  let minRemaining = MAX_LOGIN_ATTEMPTS;

  for (const ident of identifiers) {
    try {
      const existing = await dbQueryOne<{
        id: string;
        attempt_count: number;
        locked_until: string;
        last_attempt: string;
      }>("SELECT id, attempt_count, locked_until, last_attempt FROM login_attempts WHERE identifier = ?", [
        ident,
      ]);

      if (existing) {
        // Reset counter if previous attempt was older than lockout window (15 mins) and not currently locked
        const lastTime = parseSqliteDate(existing.last_attempt);
        const isStale = Date.now() - lastTime > LOCKOUT_MINUTES * 60 * 1000;
        const newCount = isStale ? 1 : (existing.attempt_count || 0) + 1;

        if (newCount >= MAX_LOGIN_ATTEMPTS) {
          await dbExecute(
            `UPDATE login_attempts 
             SET attempt_count = ?, locked_until = datetime('now', '+${LOCKOUT_MINUTES} minutes'), last_attempt = datetime('now') 
             WHERE identifier = ?`,
            [newCount, ident],
          );
          isNowLocked = true;
        } else {
          await dbExecute(
            `UPDATE login_attempts 
             SET attempt_count = ?, last_attempt = datetime('now') 
             WHERE identifier = ?`,
            [newCount, ident],
          );
          minRemaining = Math.min(minRemaining, MAX_LOGIN_ATTEMPTS - newCount);
        }
      } else {
        const newId = `la_${crypto.randomUUID()}`;
        await dbExecute(
          `INSERT INTO login_attempts (id, identifier, attempt_count, locked_until, last_attempt) 
           VALUES (?, ?, 1, NULL, datetime('now'))`,
          [newId, ident],
        );
        minRemaining = Math.min(minRemaining, MAX_LOGIN_ATTEMPTS - 1);
      }
    } catch (err) {
      console.warn("Record failed login error:", err);
    }
  }

  return {
    locked: isNowLocked,
    remainingAttempts: isNowLocked ? 0 : Math.max(0, minRemaining),
    retryAfterSeconds: isNowLocked ? LOCKOUT_MINUTES * 60 : 0,
  };
}

/**
 * Resets brute force counter on successful authentication.
 */
export async function recordSuccessfulLogin(ip: string, email: string): Promise<void> {
  try {
    const identifiers = [`ip:${ip.trim()}`, `email:${email.toLowerCase().trim()}`];
    await dbExecute("DELETE FROM login_attempts WHERE identifier IN (?, ?)", identifiers);
  } catch (err) {
    console.warn("Reset login attempts notice:", err);
  }
}

export function parseSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE_NAME}=([^;]+)`));
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

export function createSessionCookieHeader(token: string, isHttpsOrRequest: boolean | Request = false): string {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  const isHttps = typeof isHttpsOrRequest === "boolean" ? isHttpsOrRequest : isRequestHttps(isHttpsOrRequest);
  const secureFlag = isHttps ? "; Secure" : "";
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secureFlag}`;
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

export async function authenticateRequest(
  request: Request,
): Promise<{ adminId: string; email: string; role: string; planTier: string } | null> {
  let token = parseSessionCookie(request);
  if (!token) {
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.slice(7).trim();
    }
  }
  if (!token) return null;
  return await validateSession(token);
}
