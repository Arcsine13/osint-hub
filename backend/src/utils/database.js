const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
let dbPath = null;

async function getDatabase() {
  if (db) return db;
  
  const SQL = await initSqlJs();
  dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/osint-hub.db');
  
  // Ensure data directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Load existing database or create new one
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  // Initialize tables
  db.run(`
    CREATE TABLE IF NOT EXISTS searches (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      query TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      total_platforms INTEGER DEFAULT 0,
      searched_platforms INTEGER DEFAULT 0,
      results_count INTEGER DEFAULT 0,
      ip_address TEXT,
      user_agent TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      search_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      username TEXT,
      url TEXT,
      status TEXT,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS rate_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_address TEXT NOT NULL,
      search_type TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  saveDatabase();
  console.log('✅ Database initialized');
  return db;
}

function saveDatabase() {
  if (db && dbPath) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Helper: run a query and return results as array of objects
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper: run a query and return first result
function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Helper: run a statement
function run(sql, params = []) {
  db.run(sql, params);
  saveDatabase();
}

function cleanupOldSearches() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  run('DELETE FROM results WHERE search_id IN (SELECT id FROM searches WHERE created_at < ?)', [thirtyDaysAgo]);
  run('DELETE FROM searches WHERE created_at < ?', [thirtyDaysAgo]);
  run('DELETE FROM rate_limits WHERE created_at < ?', [thirtyDaysAgo]);
}

module.exports = { getDatabase, saveDatabase, queryAll, queryOne, run, cleanupOldSearches };
