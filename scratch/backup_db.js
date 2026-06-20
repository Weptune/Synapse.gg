const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const databaseUrl = "postgresql://synapse_db_n6js_user:EXZovEJcTSo64HlAO7IHPYBklmQJHYmG@dpg-d870lo0jo6nc7396g6c0-a.oregon-postgres.render.com/synapse_db_n6js";

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

const TABLES = [
  'system_settings',
  'users',
  'sessions',
  'match_history',
  'friendships',
  'arena_chat_messages',
  'direct_messages',
  'user_assets'
];

async function backup() {
  console.log("🚀 Starting database backup from old Render instance...");
  const data = {};

  try {
    for (const table of TABLES) {
      console.log(`⏳ Fetching data from table: ${table}...`);
      const res = await pool.query(`SELECT * FROM "${table}"`);
      data[table] = res.rows;
      console.log(`✅ Fetched ${res.rows.length} rows from ${table}`);
    }

    const backupPath = path.join(__dirname, 'db_backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`\n🎉 SUCCESS! Backup written to: ${backupPath}`);
  } catch (error) {
    console.error("🔴 Backup failed:", error);
  } finally {
    await pool.end();
  }
}

backup();
