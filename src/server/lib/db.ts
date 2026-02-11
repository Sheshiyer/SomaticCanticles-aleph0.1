// Database client for Postgres (Vercel)
import { db } from '../../db';
export type DB = typeof db;
export { db };
export * as schema from '../../db/schema';

// Deprecated: createDB is no longer needed as we use a global db instance
// export function createDB(d1Database: D1Database) { ... }
