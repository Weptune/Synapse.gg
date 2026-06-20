const { Client } = require('pg');

const databaseUrl = "postgresql://synapse_db_n6js_user:EXZovEJcTSo64HlAO7IHPYBklmQJHYmG@dpg-d870lo0jo6nc7396g6c0-a.oregon-postgres.render.com/synapse_db_n6js";

async function test() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query("SELECT 1");
    console.log("Query success:", res.rows);
  } catch (err) {
    console.error("Connection error detail:");
    console.error(err);
  } finally {
    await client.end();
  }
}

test();
