const pg = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_cW7N4awstnZk@ep-old-dust-aqxbcl2c-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function initDatabase() {
  try {
    await client.connect();
    console.log('✓ Connected to Neon PostgreSQL');
    
    // Read and execute migrations
    const fs = require('fs');
    const sql = fs.readFileSync('/home/ubuntu/yellow-city-migration/api/migrations/init.sql', 'utf8');
    
    await client.query(sql);
    console.log('✓ Database schema initialized');
    
    await client.end();
    console.log('✓ Database initialization complete!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

initDatabase();
