'use strict';

const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', '..', 'auth.db');

// In-memory sql.js Database instance
let db = null;
// Flag: suppress persist() calls while inside a manual transaction
let _inTransaction = false;

/**
 * Persist the in-memory database to disk.
 * Silently skipped when called from inside a transaction block.
 */
function persist() {
  if (_inTransaction) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

/**
 * Initialize (or load) the SQLite database from disk.
 * Must be awaited once before getDb() is used.
 */
async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON;');
  initSchema();
  persist();
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      email       TEXT    NOT NULL UNIQUE COLLATE NOCASE,
      username    TEXT    NOT NULL UNIQUE COLLATE NOCASE,
      password    TEXT    NOT NULL,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token       TEXT    NOT NULL UNIQUE,
      expires_at  TEXT    NOT NULL,
      used        INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_reset_token ON password_reset_tokens(token);
  `);
}

// ---------------------------------------------------------------------------
// Thin wrapper that mimics the better-sqlite3 synchronous API
// ---------------------------------------------------------------------------
const dbWrapper = {
  /**
   * prepare(sql).get(...params)  → first row as plain object, or undefined
   * prepare(sql).all(...params)  → array of plain objects
   * prepare(sql).run(...params)  → { lastInsertRowid, changes }
   */
  prepare(sql) {
    return {
      get(...params) {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const rows = [];
        const stmt = db.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) rows.push(stmt.getAsObject());
        stmt.free();
        return rows;
      },
      run(...params) {
        db.run(sql, params);
        const meta = db.exec('SELECT last_insert_rowid() as id, changes() as ch');
        const lastInsertRowid = meta.length ? meta[0].values[0][0] : 0;
        const changes = meta.length ? meta[0].values[0][1] : 0;
        persist();
        return { lastInsertRowid, changes };
      },
    };
  },

  /**
   * Wrap multiple statements in an atomic transaction.
   * Usage: db.transaction(() => { ... })();
   */
  transaction(fn) {
    return () => {
      _inTransaction = true;
      db.run('BEGIN');
      try {
        fn();
        db.run('COMMIT');
      } catch (err) {
        try { db.run('ROLLBACK'); } catch { /* already rolled back */ }
        _inTransaction = false;
        throw err;
      }
      _inTransaction = false;
      persist(); // single persist after successful commit
    };
  },
};

function getDb() {
  return dbWrapper;
}

module.exports = { getDb, initDb };
