const { Client } = require('pg');

const databaseUrl = "postgresql://postgres.uklkqnlvjzlfikzresva:%4025_Abhinav@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres";

async function test() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Connecting to Supabase Session Pooler...");
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
