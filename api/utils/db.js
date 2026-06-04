import pg from 'pg';

const { Pool } = pg;

let pool = null;

/**
 * Get or create database connection pool
 */
export function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  return pool;
}

/**
 * Execute a query
 */
export async function query(text, params = []) {
  const pool = getPool();
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Get a single row
 */
export async function getOne(text, params = []) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

/**
 * Get all rows
 */
export async function getAll(text, params = []) {
  const result = await query(text, params);
  return result.rows;
}

/**
 * Close the pool (for cleanup)
 */
export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
