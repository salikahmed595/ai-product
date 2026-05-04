import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
  connectionString: process.env.SUPABASE_DB_URL,
});

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE clinics 
      ADD COLUMN IF NOT EXISTS system_prompt TEXT,
      ADD COLUMN IF NOT EXISTS voice_id TEXT;
    `);
    console.log('✅ Added system_prompt and voice_id to clinics table.');
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await pool.end();
  }
}

migrate();
