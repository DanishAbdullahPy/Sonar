 
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon requires SSL, so we force it here:
  ssl: { rejectUnauthorized: false }
});

export const db = {
  // Simple query helper: await db.query(sql, [params...])
  query: (text, params) => pool.query(text, params),
};
