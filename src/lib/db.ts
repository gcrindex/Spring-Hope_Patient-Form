// src/lib/db.ts
// Cloudflare D1 Database Adapter with local SQLite fallback for dev

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

async function getLocalSqlite(): Promise<LocalSqliteLike> {
  if (localDbInstance) return localDbInstance;

  type DatabaseSyncConstructor = new (path: string) => LocalSqliteLike;
  let DatabaseSync: DatabaseSyncConstructor | null = null;
  try {
    const mod = await import("node:sqlite");
    DatabaseSync = mod.DatabaseSync as unknown as DatabaseSyncConstructor;
  } catch {
    const { createRequire } = await import("node:module");
    const req = createRequire(import.meta.url);
    DatabaseSync = req("node:sqlite").DatabaseSync as DatabaseSyncConstructor;
  }

  const path = await import("node:path");
  const fs = await import("node:fs");

  const dbDir = path.resolve(process.cwd(), ".wrangler/state/v3/d1");
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, "springhope_local.sqlite");
  const db = new DatabaseSync(dbPath);

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

  // Ensure default admin exists for development
  try {
    const defaultHash =
      "7b11cf19be629b96afec60dd0aad3ab8:2ffad67483b34c63bd18bb6abb4c86574c2aef872ebd62fc04b6d723aec3f65f";
    db.exec(`
      INSERT OR REPLACE INTO admins (id, email, password_hash, created_at, updated_at)
      VALUES ('admin_default', 'admin@gmail.com', '${defaultHash}', datetime('now'), datetime('now'));
      INSERT OR REPLACE INTO admins (id, email, password_hash, created_at, updated_at)
      VALUES ('admin_rian', 'rian@gmail.com', '${defaultHash}', datetime('now'), datetime('now'));
    `);
  } catch (e) {
    console.warn("Local default admin init note:", e);
  }

  localDbInstance = db as unknown as LocalSqliteLike;
  return localDbInstance;
}

function getCloudflareD1(): D1DatabaseLike | null {
  const g = globalThis as unknown as Record<string, unknown>;
  if (g["springhope_db"]) return g["springhope_db"] as D1DatabaseLike;
  const env = g["env"] as Record<string, unknown> | undefined;
  if (env?.["springhope_db"]) return env["springhope_db"] as D1DatabaseLike;
  const proc = g["process"] as { env?: Record<string, unknown> } | undefined;
  if (proc?.env?.["springhope_db"]) return proc.env["springhope_db"] as D1DatabaseLike;
  return null;
}

export async function dbQuery<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  try {
    const d1 = getCloudflareD1();
    if (d1) {
      const stmt = d1.prepare(sql).bind(...params);
      const result = await stmt.all<T>();
      return (result.results || []) as T[];
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
      const stmt = d1.prepare(sql).bind(...params);
      const res = await stmt.run();
      return { changes: res.meta?.changes ?? 1 };
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
