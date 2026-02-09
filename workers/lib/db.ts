// Database client for D1
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';
import type { D1Database } from '@cloudflare/workers-types';

export type DB = ReturnType<typeof createDB>;

export function createDB(d1Database: D1Database) {
  return drizzle(d1Database, { schema });
}

// Re-export schema for convenience
export { schema };
