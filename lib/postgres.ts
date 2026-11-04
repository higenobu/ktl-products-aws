import { Pool } from 'pg';

let pool: Pool | undefined;

export function database() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required');
  return pool ??= new Pool({ connectionString, max: 4, connectionTimeoutMillis: 3000, statement_timeout: 5000 });
}
