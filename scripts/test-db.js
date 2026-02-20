// scripts/test-db.js
// Simple database connection test
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 40) + '...');

    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL!');

    const result = await client.query('SELECT version()');
    console.log('PostgreSQL version:', result.rows[0].version);

    client.release();
    await pool.end();
    console.log('✅ Connection test successful');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  }
}

test();
