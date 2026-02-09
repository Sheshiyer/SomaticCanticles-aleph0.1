#!/usr/bin/env bun
/**
 * Generate hashed passwords for seeding users
 * Usage: bun run scripts/hash-passwords.ts
 */

import { hashPassword } from '../lib/crypto';

const passwords = {
  admin: 'SomaticDev44!',
  user: 'TestUser13!',
};

async function main() {
  console.log('Generating password hashes...\n');
  
  for (const [name, password] of Object.entries(passwords)) {
    const hash = await hashPassword(password);
    console.log(`${name}:`);
    console.log(`  Password: ${password}`);
    console.log(`  Hash: ${hash}`);
    console.log('');
  }
}

main().catch(console.error);
