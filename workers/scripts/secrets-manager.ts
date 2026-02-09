#!/usr/bin/env bun
/**
 * Secrets Manager CLI
 * 
 * Usage:
 *   bun run scripts/secrets-manager.ts <command> [options]
 * 
 * Commands:
 *   generate [name]       Generate a new secure secret
 *   list                  List all configured secrets
 *   status                Check secret status (set/missing)
 *   put <name> <value>    Store a secret via wrangler
 *   put-kv <name> <value> Store a secret in KV
 *   rotate <name>         Rotate a secret with versioning
 *   help                  Show this help
 * 
 * Examples:
 *   bun run scripts/secrets-manager.ts generate JWT_SECRET
 *   bun run scripts/secrets-manager.ts put JWT_SECRET "my-secret-value"
 *   bun run scripts/secrets-manager.ts put-kv JWT_SECRET "my-secret-value"
 *   bun run scripts/secrets-manager.ts status
 */

import { execSync } from 'child_process';
import { generateSecureSecret } from '../lib/secrets';

// Secret configurations (sync with lib/secrets.ts)
const SECRET_CONFIGS = {
  JWT_SECRET: { required: true, description: 'JWT signing key' },
  AUTH_SECRET: { required: true, description: 'Authentication secret' },
  SENTRY_DSN: { required: false, description: 'Sentry error tracking DSN' },
  GOOGLE_CLIENT_ID: { required: false, description: 'Google OAuth Client ID' },
  GOOGLE_CLIENT_SECRET: { required: false, description: 'Google OAuth Client Secret' },
};

type Command = 'generate' | 'list' | 'status' | 'put' | 'put-kv' | 'rotate' | 'help';

function printHelp() {
  console.log(`
Secrets Manager CLI

Usage: bun run scripts/secrets-manager.ts <command> [options]

Commands:
  generate [name]       Generate a new secure secret (32 bytes default)
  list                  List all configured secrets
  status                Check which secrets are set/missing
  put <name> <value>    Store a secret via wrangler secret put
  put-kv <name> <value> Store a secret in KV namespace
  rotate <name>         Generate and store a new version of a secret
  help                  Show this help

Environment:
  CF_ENV                Target environment (dev/production), defaults to dev

Examples:
  # Generate a new JWT secret
  bun run scripts/secrets-manager.ts generate JWT_SECRET

  # Store a secret in Worker Secrets (recommended for static secrets)
  bun run scripts/secrets-manager.ts put JWT_SECRET "my-secret-value"

  # Store a secret in KV (good for dynamic/rotated secrets)
  bun run scripts/secrets-manager.ts put-kv JWT_SECRET "my-secret-value"

  # Check which secrets are configured
  bun run scripts/secrets-manager.ts status
`);
}

function generateSecret(name?: string) {
  const secret = generateSecureSecret(32);
  
  if (name) {
    console.log(`\nGenerated secret for ${name}:`);
    console.log(`  ${secret}`);
    console.log(`\nStore it with:`);
    console.log(`  bun run scripts/secrets-manager.ts put ${name} "${secret}"`);
  } else {
    console.log(`\nGenerated secure secret:`);
    console.log(`  ${secret}`);
  }
}

function listSecrets() {
  console.log('\nConfigured Secrets:');
  console.log('━'.repeat(60));
  console.log(`${'Name'.padEnd(25)} ${'Required'.padEnd(10)} Description`);
  console.log('─'.repeat(60));
  
  for (const [name, config] of Object.entries(SECRET_CONFIGS)) {
    const required = config.required ? '✓ Yes' : '○ No';
    console.log(`${name.padEnd(25)} ${required.padEnd(10)} ${config.description}`);
  }
  
  console.log('━'.repeat(60));
  console.log('\nStorage Options:');
  console.log('  • Worker Secrets (wrangler secret put) - Encrypted, versioned, recommended for static secrets');
  console.log('  • KV Namespace (put-kv) - Dynamic, cacheable, good for rotated secrets');
}

function checkStatus() {
  const env = process.env.CF_ENV || 'dev';
  console.log(`\nChecking secret status for environment: ${env}\n`);
  
  // Try to get secrets from wrangler
  const results: { name: string; configured: boolean; source?: string }[] = [];
  
  for (const name of Object.keys(SECRET_CONFIGS)) {
    try {
      // Check if secret is set via wrangler
      execSync(`wrangler secret get ${name} --env ${env}`, {
        stdio: 'pipe',
        cwd: '/Volumes/madara/2026/Serpentine-raising/workers',
      });
      results.push({ name, configured: true, source: 'Worker Secrets' });
    } catch {
      results.push({ name, configured: false });
    }
  }
  
  console.log('Secret Status:');
  console.log('━'.repeat(50));
  console.log(`${'Name'.padEnd(25)} ${'Status'.padEnd(15)} Source`);
  console.log('─'.repeat(50));
  
  for (const result of results) {
    const status = result.configured ? '✓ Set' : '✗ Missing';
    const source = result.source || '-';
    console.log(`${result.name.padEnd(25)} ${status.padEnd(15)} ${source}`);
  }
  
  console.log('━'.repeat(50));
  
  const missing = results.filter(r => !r.configured && SECRET_CONFIGS[r.name as keyof typeof SECRET_CONFIGS]?.required);
  
  if (missing.length > 0) {
    console.log(`\n⚠️  Missing required secrets: ${missing.map(r => r.name).join(', ')}`);
    console.log('\nSet them with:');
    for (const m of missing) {
      console.log(`  bun run scripts/secrets-manager.ts put ${m.name} "<value>"`);
    }
  } else {
    console.log('\n✅ All required secrets are configured');
  }
}

function putSecret(name: string, value: string) {
  const env = process.env.CF_ENV || 'dev';
  
  if (!SECRET_CONFIGS[name as keyof typeof SECRET_CONFIGS]) {
    console.error(`Unknown secret: ${name}`);
    console.log(`\nKnown secrets: ${Object.keys(SECRET_CONFIGS).join(', ')}`);
    process.exit(1);
  }
  
  console.log(`Storing ${name} in Worker Secrets for ${env} environment...`);
  
  try {
    // Use echo and pipe to avoid showing secret in process list
    const cmd = `echo "${value.replace(/"/g, '\\"')}" | wrangler secret put ${name} --env ${env}`;
    execSync(cmd, {
      stdio: 'inherit',
      cwd: '/Volumes/madara/2026/Serpentine-raising/workers',
    });
    console.log(`\n✅ Secret ${name} stored successfully`);
  } catch (error) {
    console.error(`\n❌ Failed to store secret: ${error}`);
    process.exit(1);
  }
}

function putKvSecret(name: string, value: string) {
  const env = process.env.CF_ENV || 'dev';
  
  console.log(`Storing ${name} in KV for ${env} environment...`);
  
  try {
    const cmd = `echo "${value.replace(/"/g, '\\"')}" | wrangler kv:key put "secret:${name}" --binding SECRETS_KV --env ${env}`;
    execSync(cmd, {
      stdio: 'inherit',
      cwd: '/Volumes/madara/2026/Serpentine-raising/workers',
    });
    console.log(`\n✅ Secret ${name} stored in KV successfully`);
  } catch (error) {
    console.error(`\n❌ Failed to store secret in KV: ${error}`);
    process.exit(1);
  }
}

function rotateSecret(name: string) {
  if (!SECRET_CONFIGS[name as keyof typeof SECRET_CONFIGS]) {
    console.error(`Unknown secret: ${name}`);
    process.exit(1);
  }
  
  const newValue = generateSecureSecret(32);
  console.log(`Rotating ${name}...`);
  console.log(`New value: ${newValue}`);
  
  // Store in KV for versioning
  putKvSecret(name, newValue);
  
  console.log('\n⚠️  Note: Update Worker Secret for permanent storage:');
  console.log(`  bun run scripts/secrets-manager.ts put ${name} "${newValue}"`);
}

// Main
const args = process.argv.slice(2);
const command = args[0] as Command;

if (!command || command === 'help') {
  printHelp();
  process.exit(0);
}

switch (command) {
  case 'generate':
    generateSecret(args[1]);
    break;
  case 'list':
    listSecrets();
    break;
  case 'status':
    checkStatus();
    break;
  case 'put':
    if (args.length < 3) {
      console.error('Usage: put <name> <value>');
      process.exit(1);
    }
    putSecret(args[1], args[2]);
    break;
  case 'put-kv':
    if (args.length < 3) {
      console.error('Usage: put-kv <name> <value>');
      process.exit(1);
    }
    putKvSecret(args[1], args[2]);
    break;
  case 'rotate':
    if (args.length < 2) {
      console.error('Usage: rotate <name>');
      process.exit(1);
    }
    rotateSecret(args[1]);
    break;
  default:
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
}
