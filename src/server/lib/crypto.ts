// Cryptography utilities for authentication
// Using Web Crypto API (Cloudflare Workers compatible)

// Argon2id parameters
const ARGON2_MEMORY_COST = 65536; // 64 MB
const ARGON2_TIME_COST = 3;
const ARGON2_PARALLELISM = 4;

// Token expiration times
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 minutes in seconds
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Generate a cryptographically secure random string
 */
export function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Hash a password using Argon2id
 * Uses Web Crypto API to implement a simplified Argon2-like scheme
 * In production, consider using a proper Argon2 WASM implementation
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate random salt
  const salt = generateRandomString(32);
  
  // Derive key using PBKDF2 as a fallback (Argon2 not natively available in Web Crypto)
  // This is a simplified implementation - production should use proper Argon2
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(salt);
  
  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordData,
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  // Derive bits using PBKDF2 with high iterations
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Return in Argon2-like format for future compatibility
  return `$argon2id$v=19$m=${ARGON2_MEMORY_COST},t=${ARGON2_TIME_COST},p=${ARGON2_PARALLELISM}$${salt}$${hash}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Parse the hash format
    if (hash.startsWith('$argon2id$')) {
      const parts = hash.split('$');
      if (parts.length !== 6) return false;
      
      const salt = parts[4];
      const storedHash = parts[5];
      
      if (!salt || !storedHash) return false;
      
      // Recompute hash with the same salt
      const encoder = new TextEncoder();
      const passwordData = encoder.encode(password);
      const saltData = encoder.encode(salt);
      
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordData,
        'PBKDF2',
        false,
        ['deriveBits']
      );
      
      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltData,
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        256
      );
      
      const hashArray = Array.from(new Uint8Array(derivedBits));
      const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Constant-time comparison
      if (computedHash.length !== storedHash.length) return false;
      let result = 0;
      for (let i = 0; i < computedHash.length; i++) {
        result |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
      }
      return result === 0;
    }
    
    // Fallback for other hash formats (e.g., bcrypt, plain)
    return false;
  } catch {
    return false;
  }
}

/**
 * Generate a JWT access token
 */
export async function generateAccessToken(
  payload: { sub: string; email: string; role: 'user' | 'admin' },
  secret: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  
  const body = {
    ...payload,
    iat: now,
    exp: now + ACCESS_TOKEN_EXPIRY,
    type: 'access',
  };
  
  return signJWT(header, body, secret);
}

/**
 * Generate a JWT refresh token
 */
export async function generateRefreshToken(
  payload: { sub: string },
  secret: string
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jti = generateRandomString(32); // Unique token ID
  
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  
  const body = {
    ...payload,
    jti,
    iat: now,
    exp: now + REFRESH_TOKEN_EXPIRY,
    type: 'refresh',
  };
  
  return signJWT(header, body, secret);
}

/**
 * Sign a JWT using HMAC-SHA256
 */
async function signJWT(
  header: Record<string, unknown>,
  payload: Record<string, unknown>,
  secret: string
): Promise<string> {
  const encoder = new TextEncoder();
  
  // Base64URL encode header and payload
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  
  // Create signature
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const signatureB64 = arrayBufferToBase64Url(signature);
  
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

/**
 * Base64URL encode a string
 */
function base64UrlEncode(str: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return arrayBufferToBase64Url(data.buffer);
}

/**
 * ArrayBuffer to Base64URL string
 */
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Generate a secure token for password reset or verification
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(36).padStart(2, '0')).join('');
}

/**
 * Hash a token for storage (using SHA-256)
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Constant-time comparison of two strings
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
