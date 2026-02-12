import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// This file exports a function that creates a drizzle instance from a D1 database binding
// Usage: const db = createDB(env.DB);
export function createDB(d1: D1Database) {
    return drizzle(d1, { schema });
}

// For backwards compatibility (but this won't work in Workers without a binding)
// You should use createDB(env.DB) in Worker context
export const db = drizzle({} as D1Database, { schema });
