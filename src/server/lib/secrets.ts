/**
 * Secrets Management Module
 * 
 * Simplified for Vercel/Node.js environment.
 * Uses process.env directly.
 */

// Env type extension for secrets module
export interface SecretsEnv {
  JWT_SECRET?: string;
  AUTH_SECRET?: string;
  SENTRY_DSN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  ENVIRONMENT?: string;
  [key: string]: string | undefined;
}

export class SecretsManager {
  private env: SecretsEnv;

  constructor(env: SecretsEnv) {
    this.env = env;
  }

  async get(name: keyof SecretsEnv & string): Promise<string | undefined> {
    // 1. Check Env object (Hono bindings)
    if (this.env[name]) {
      return this.env[name];
    }
    // 2. Check process.env (Node.js/Vercel)
    return process.env[name];
  }

  async getRequired(name: keyof SecretsEnv & string): Promise<string> {
    const value = await this.get(name);
    if (!value) {
      throw new Error(`Required secret "${name}" is not configured`);
    }
    return value;
  }
}

export function createSecretsManager(env: SecretsEnv): SecretsManager {
  return new SecretsManager(env);
}

export function generateSecureSecret(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64');
}
export async function validateSecrets(env: SecretsEnv): Promise<string[]> {
  const required = ['JWT_SECRET', 'AUTH_SECRET'];
  const missing = [];

  for (const name of required) {
    if (!env[name] && !process.env[name]) {
      missing.push(name);
    }
  }

  return missing;
}
