// src/db/index.js
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const isProduction = process.env.NODE_ENV === 'production';

// Configure connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  
  // Connection limits for shared hosting
  max: isProduction ? 20 : 10,
  min: isProduction ? 5 : 2,
  
  // Timeouts (in milliseconds)
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  
  // Retry logic
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
  
  // Application name (visible in DB logs)
  application_name: 'blogcms-admin',
});

// Log pool statistics in development
if (!isProduction) {
  pool.on('connect', () => {
    console.log('🔌 DB Pool: New client connected');
  });
  
  pool.on('error', (err) => {
    console.error('❌ DB Pool Error:', err);
  });
}

// Create Drizzle client with schema
export const db = drizzle(pool, { schema });

// Export schema for use in other files
export * from './schema.js';

// Graceful shutdown helper
export async function closePool() {
  console.log('🔌 Closing database pool...');
  await pool.end();
  console.log('✅ Database pool closed');
}

// Test connection helper
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connected:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
}
