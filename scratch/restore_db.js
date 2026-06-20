const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Replace this with your NEW database connection string when ready!
const NEW_DATABASE_URL = process.env.NEW_DATABASE_URL || "YOUR_NEW_DATABASE_URL_HERE";

if (NEW_DATABASE_URL === "YOUR_NEW_DATABASE_URL_HERE") {
  console.error("🔴 Please set your NEW_DATABASE_URL in the script or environment variables!");
  process.exit(1);
}

process.env.DATABASE_URL = NEW_DATABASE_URL;

const pool = new Pool({
  connectionString: NEW_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const backupFile = path.join(__dirname, 'db_backup.json');

async function restore() {
  if (!fs.existsSync(backupFile)) {
    console.error(`🔴 Backup file not found at: ${backupFile}`);
    process.exit(1);
  }

  console.log("🚀 Starting database restore to new database...");
  const data = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));

  try {
    // 1. Initialize tables (schema is created automatically by storage.js on startup,
    // but we run storage init here or manually ensure tables exist)
    console.log("⏳ Initializing schema...");
    const storage = require('../backend/storage.js');
    await storage.init(); // This creates all the tables automatically

    // Disable triggers or handle foreign keys carefully by ordering inserts
    const tablesToInsert = [
      'system_settings',
      'users',
      'sessions',
      'match_history',
      'friendships',
      'arena_chat_messages',
      'direct_messages',
      'user_assets'
    ];

    for (const table of tablesToInsert) {
      const rows = data[table] || [];
      if (rows.length === 0) {
        console.log(`ℹ️ Table ${table} has no rows in backup. Skipping.`);
        continue;
      }

      console.log(`⏳ Restoring ${rows.length} rows to ${table}...`);
      
      for (const row of rows) {
        const keys = Object.keys(row);
        const values = Object.values(row);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.map(k => `"${k}"`).join(', ');

        const query = `
          INSERT INTO "${table}" (${columns})
          VALUES (${placeholders})
          ON CONFLICT DO NOTHING
        `;

        await pool.query(query, values);
      }
      console.log(`✅ Restored ${table}`);
    }

    console.log("\n🎉 RESTORE COMPLETE! All data has been successfully imported.");
  } catch (error) {
    console.error("🔴 Restore failed:", error);
  } finally {
    await pool.end();
  }
}

restore();
