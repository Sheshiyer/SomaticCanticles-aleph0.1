/**
 * Secrets Management Module
 * 
 * Centralized secrets handling with:
 * - Worker Secrets as primary source (via `wrangler secret put`)
 * - KV as fallback for dynamic/rotated secrets
 * - In-memory caching for performance
 * - Secret versioning and rotation support
 * 
 * Usage:
 *   const secrets = new SecretsManager(env);
 *   const jwtSecret = await secrets.get('JWT_SECRET');
 */

import type { KVNamespace } from '@cloudflare/workers-types';

// Env type extension for secrets module
export interface SecretsEnv {
  // Required secrets (set via wrangler secret put)
  JWT_SECRET?: string;
  AUTH_SECRET?: string;
  SENTRY_DSN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  
  // Optional: KV namespace for dynamic secrets fallback
  SECRETS_KV?: KVNamespace;
  
  // Environment indicator
  ENVIRONMENT?: string;
}

// Secret configuration with metadata
interface SecretConfig {
  name: string;
  required: boolean;
  defaultValue?: string;
  allowKvFallback: boolean;
  cacheTtl: number; // in seconds
}

// Default secret configurations
const SECRET_CONFIGS: Record<string, SecretConfig> = {
  JWT_SECRET: {
    name: 'JWT_SECRET',
    required: true,
    allowKvFallback: true,
    cacheTtl: 300, // 5 minutes
  },
  AUTH_SECRET: {
    name: 'AUTH_SECRET',
    required: true,
    allowKvFallback: true,
    cacheTtl: 300,
  },
  SENTRY_DSN: {
    name: 'SENTRY_DSN',
    required: false,
    allowKvFallback: true,
    cacheTtl: 600, // 10 minutes
  },
  GOOGLE_CLIENT_ID: {
    name: 'GOOGLE_CLIENT_ID',
    required: false,
    allowKvFallback: true,
    cacheTtl: 600,
  },
  GOOGLE_CLIENT_SECRET: {
    name: 'GOOGLE_CLIENT_SECRET',
    required: false,
    allowKvFallback: true,
    cacheTtl: 600,
  },
};

// Cache entry structure
interface CacheEntry {
  value: string;
  expiresAt: number;
}

/**
 * Secrets Manager class
 * 
 * Handles retrieval of secrets from multiple sources:
 * 1. Worker Secrets (env.VAR_NAME) - most secure, encrypted at rest
 * 2. KV Namespace (if configured) - for dynamic/rotated secrets
 * 3. Default values (development only)
 */
export class SecretsManager {
  private env: SecretsEnv;
  private cache: Map<string, CacheEntry> = new Map();
  private kvPrefix = 'secret:';

  constructor(env: SecretsEnv) {
    this.env = env;
  }

  /**
   * Get a secret by name
   * 
   * Priority:
   * 1. Worker Secrets (env[name])
   * 2. Local cache
   * 3. KV namespace (if configured)
   * 4. Default value (if in development)
   * 
   * @param name - Secret name
   * @returns Secret value or undefined
   */
  async get(name: keyof SecretsEnv & string): Promise<string | undefined> {
    const config = SECRET_CONFIGS[name];

    // 1. Check Worker Secrets first (highest priority, most secure)
    const envValue = this.env[name];
    if (envValue) {
      return envValue;
    }

    // 2. Check local cache
    const cached = this.cache.get(name);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }
    this.cache.delete(name); // Clean expired entry

    // 3. Check KV if configured and allowed
    if (config?.allowKvFallback && this.env.SECRETS_KV) {
      const kvValue = await this.env.SECRETS_KV.get(`${this.kvPrefix}${name}`);
      if (kvValue) {
        // Cache the KV value
        this.setCache(name, kvValue, config.cacheTtl);
        return kvValue;
      }

      // Check for versioned secret (e.g., secret:JWT_SECRET:v2)
      const versionedKey = await this.getLatestVersionedSecret(name);
      if (versionedKey) {
        this.setCache(name, versionedKey, config.cacheTtl);
        return versionedKey;
      }
    }

    // 4. Return default value if in development
    if (this.env.ENVIRONMENT === 'development' && config?.defaultValue) {
      console.warn(`[SecretsManager] Using default value for ${name} in development`);
      return config.defaultValue;
    }

    // Secret not found
    if (config?.required) {
      console.error(`[SecretsManager] Required secret "${name}" not found`);
    }

    return undefined;
  }

  /**
   * Get a required secret, throws if not found
   */
  async getRequired(name: keyof SecretsEnv & string): Promise<string> {
    const value = await this.get(name);
    if (!value) {
      throw new Error(`Required secret "${name}" is not configured`);
    }
    return value;
  }

  /**
   * Check if a secret exists
   */
  async has(name: keyof SecretsEnv & string): Promise<boolean> {
    const value = await this.get(name);
    return value !== undefined;
  }

  /**
   * Get multiple secrets at once
   */
  async getMany(names: (keyof SecretsEnv & string)[]): Promise<Record<string, string | undefined>> {
    const result: Record<string, string | undefined> = {};
    await Promise.all(
      names.map(async (name) => {
        result[name] = await this.get(name);
      })
    );
    return result;
  }

  /**
   * Set a secret in KV (for admin/rotation use)
   * Note: Worker Secrets can only be set via wrangler CLI or API
   */
  async setKvSecret(name: string, value: string, ttl?: number): Promise<void> {
    if (!this.env.SECRETS_KV) {
      throw new Error('SECRETS_KV namespace not configured');
    }

    const key = `${this.kvPrefix}${name}`;
    if (ttl) {
      await this.env.SECRETS_KV.put(key, value, { expirationTtl: ttl });
    } else {
      await this.env.SECRETS_KV.put(key, value);
    }

    // Update cache
    const config = SECRET_CONFIGS[name];
    this.setCache(name, value, config?.cacheTtl || 300);
  }

  /**
   * Rotate a secret with versioning
   * Stores new version and keeps old version accessible
   */
  async rotateSecret(name: string, newValue: string): Promise<void> {
    if (!this.env.SECRETS_KV) {
      throw new Error('SECRETS_KV namespace not configured');
    }

    const timestamp = Date.now();
    const versionKey = `${this.kvPrefix}${name}:v${timestamp}`;
    
    // Store new version
    await this.env.SECRETS_KV.put(versionKey, newValue);
    
    // Update pointer to latest
    await this.env.SECRETS_KV.put(`${this.kvPrefix}${name}:latest`, versionKey);
    
    // Clear cache to force refresh
    this.cache.delete(name);

    console.log(`[SecretsManager] Rotated secret "${name}" to version ${timestamp}`);
  }

  /**
   * List all available secret versions from KV
   */
  async listSecretVersions(name: string): Promise<string[]> {
    if (!this.env.SECRETS_KV) {
      return [];
    }

    const prefix = `${this.kvPrefix}${name}:v`;
    const list = await this.env.SECRETS_KV.list({ prefix });
    return list.keys.map(k => k.name.replace(prefix, ''));
  }

  /**
   * Get the latest versioned secret from KV
   */
  private async getLatestVersionedSecret(name: string): Promise<string | null> {
    if (!this.env.SECRETS_KV) {
      return null;
    }

    const latestKey = await this.env.SECRETS_KV.get(`${this.kvPrefix}${name}:latest`);
    if (!latestKey) {
      return null;
    }

    return await this.env.SECRETS_KV.get(latestKey);
  }

  /**
   * Set a value in local cache
   */
  private setCache(name: string, value: string, ttlSeconds: number): void {
    this.cache.set(name, {
      value,
      expiresAt: Date.now() + (ttlSeconds * 1000),
    });
  }

  /**
   * Clear all cached secrets
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics (for debugging)
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

/**
 * Create a SecretsManager instance from environment
 */
export function createSecretsManager(env: SecretsEnv): SecretsManager {
  return new SecretsManager(env);
}

/**
 * Validate that all required secrets are present
 * Call this at worker startup
 */
export async function validateSecrets(env: SecretsEnv): Promise<{ valid: boolean; missing: string[] }> {
  const manager = createSecretsManager(env);
  const missing: string[] = [];

  for (const [name, config] of Object.entries(SECRET_CONFIGS)) {
    if (config.required) {
      const hasSecret = await manager.has(name as keyof SecretsEnv & string);
      if (!hasSecret) {
        missing.push(name);
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Generate a secure random secret
 * Use this to generate new JWT_SECRET or AUTH_SECRET
 */
export function generateSecureSecret(length: number = 32): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
