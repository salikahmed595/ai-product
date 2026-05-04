import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbUrl = process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error('SUPABASE_DB_URL is missing in .env');
  process.exit(1);
}

const pool = new pg.Pool({
  connectionString: dbUrl,
});

async function migrate() {
  try {
    console.log('Connecting to Supabase...');
    const schemaPath = path.resolve(__dirname, '../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await pool.query(schemaSql);
    
    console.log('✅ Supabase database connected and schema created successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
