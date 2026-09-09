// src/lib/db.ts
// Cloudflare D1 Database Adapter with automatic D1 resolution and local SQLite fallback for dev

type D1PreparedStatement = {
  bind: (...values: unknown[]) => D1PreparedStatement;
  all: <T = unknown>() => Promise<{ results?: T[] }>;
  run: () => Promise<{ meta?: { changes?: number } }>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatement;
};

type LocalSqliteLike = {
  prepare: (query: string) => {
    all: <T = unknown>(...params: unknown[]) => T[];
    run: (...params: unknown[]) => { changes?: number };
    get?: (...params: unknown[]) => Record<string, unknown> | undefined;
  };
  exec: (sql: string) => void;
};

let localDbInstance: LocalSqliteLike | null = null;
let d1InitDone = false;

function isCloudflareWorker(): boolean {
  if (typeof navigator !== "undefined" && navigator.userAgent?.includes("Cloudflare-Workers")) {
    return true;
  }
  if (typeof WebSocketPair !== "undefined") {
    return true;
  }
  return false;
}

function getCloudflareD1(): D1DatabaseLike | null {
  const g = globalThis as unknown as Record<string, unknown>;

  // 1. Check direct globalThis binding
  if (g["springhope_db"] && typeof (g["springhope_db"] as D1DatabaseLike).prepare === "function") {
    return g["springhope_db"] as D1DatabaseLike;
  }

  // 2. Check globalThis.__env__ (set by Nitro Cloudflare module runtime)
  const nitroEnv = g["__env__"] as Record<string, unknown> | undefined;
  if (
    nitroEnv?.["springhope_db"] &&
    typeof (nitroEnv["springhope_db"] as D1DatabaseLike).prepare === "function"
  ) {
    return nitroEnv["springhope_db"] as D1DatabaseLike;
  }

  // 3. Check globalThis.env
  const env = g["env"] as Record<string, unknown> | undefined;
  if (
    env?.["springhope_db"] &&
    typeof (env["springhope_db"] as D1DatabaseLike).prepare === "function"
  ) {
    return env["springhope_db"] as D1DatabaseLike;
  }

  // 4. Check process.env (Node / SSR shims)
  const proc = g["process"] as { env?: Record<string, unknown> } | undefined;
  if (
    proc?.env?.["springhope_db"] &&
    typeof (proc.env["springhope_db"] as D1DatabaseLike).prepare === "function"
  ) {
    return proc.env["springhope_db"] as D1DatabaseLike;
  }

  return null;
}

async function ensureD1Tables(d1: D1DatabaseLike): Promise<void> {
  if (d1InitDone) return;
  try {
    await d1
      .prepare(
        `CREATE TABLE IF NOT EXISTS admins (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
      )
      .run();

    await d1
      .prepare(
        `CREATE TABLE IF NOT EXISTS forms (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          schema_json TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
      )
      .run();

    await d1
      .prepare(
        `CREATE TABLE IF NOT EXISTS submissions (
          id TEXT PRIMARY KEY,
          form_id TEXT NOT NULL,
          patient_name TEXT NOT NULL,
          score INTEGER DEFAULT 0,
          risk_level TEXT DEFAULT 'Normal',
          data_json TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`,
      )
      .run();

    await d1
      .prepare(
        `CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          admin_id TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
        );`,
      )
      .run();

    d1InitDone = true;
  } catch (e) {
    console.warn("D1 table init notice:", e);
  }
}

async function getLocalSqlite(): Promise<LocalSqliteLike> {
  if (localDbInstance) return localDbInstance;

  let DatabaseSync: (new (path: string) => LocalSqliteLike) | null = null;
  try {
    const mod = await import("node:sqlite");
    DatabaseSync = mod.DatabaseSync as unknown as new (path: string) => LocalSqliteLike;
  } catch {
    const { createRequire } = await import("node:module");
    const req = createRequire(import.meta.url);
    DatabaseSync = req("node:sqlite").DatabaseSync;
  }

  const path = await import("node:path");
  const fs = await import("node:fs");

  const dbDir = path.resolve(process.cwd(), ".wrangler/state/v3/d1");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, "springhope_local.sqlite");
  const db = new DatabaseSync!(dbPath);

  // Initialize tables in local sqlite
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS forms (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      schema_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      form_id TEXT NOT NULL,
      patient_name TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      risk_level TEXT DEFAULT 'Normal',
      data_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON submissions(form_id);
    CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  `);

  localDbInstance = db as unknown as LocalSqliteLike;
  return localDbInstance;
}

export async function dbQuery<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  try {
    const d1 = getCloudflareD1();
    if (d1) {
      await ensureD1Tables(d1);
      const stmt = d1.prepare(sql).bind(...params);
      const result = await stmt.all<T>();
      return (result.results || []) as T[];
    }

    if (isCloudflareWorker()) {
      console.error("Cloudflare D1 binding 'springhope_db' was not found on Worker environment.");
      return [];
    }

    const local = await getLocalSqlite();
    const stmt = local.prepare(sql);
    return stmt.all<T>(...params) as T[];
  } catch (err) {
    console.error("Database query execution error:", err);
    return [];
  }
}

export async function dbQueryOne<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await dbQuery<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export async function dbExecute(sql: string, params: unknown[] = []): Promise<{ changes: number }> {
  try {
    const d1 = getCloudflareD1();
    if (d1) {
      await ensureD1Tables(d1);
      const stmt = d1.prepare(sql).bind(...params);
      const res = await stmt.run();
      return { changes: res.meta?.changes ?? 1 };
    }

    if (isCloudflareWorker()) {
      console.error("Cloudflare D1 binding 'springhope_db' was not found on Worker environment.");
      return { changes: 0 };
    }

    const local = await getLocalSqlite();
    const stmt = local.prepare(sql);
    const info = stmt.run(...params);
    return { changes: info.changes ?? 1 };
  } catch (err) {
    console.error("Database execute execution error:", err);
    return { changes: 0 };
  }
}
