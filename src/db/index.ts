import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Fallback connection string during Next.js build-time static evaluation
const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_CWwUzbTS25Lk@ep-rapid-truth-aytlo89f.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export type DatabaseInstance = typeof db;
