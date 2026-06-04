import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPool } from '../utils/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const pool = getPool();

  try {
    console.log('Running database migrations...');

    // Read the init.sql file
    const initSqlPath = path.join(__dirname, 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');

    // Execute the SQL
    await pool.query(initSql);

    console.log('✓ Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
