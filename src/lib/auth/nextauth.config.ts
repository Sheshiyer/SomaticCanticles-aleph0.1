// NextAuth.js Configuration for Somatic-Canticles
// Connects to Workers JWT backend for authentication

import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { User, AuthTokens } from './types';

// API Base URL - configured via environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

// Extend the session types
declare module 'next-auth' {
  interface Session {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    role: 'user' | 'admin';
    birthdate: string | null;
    timezone: string;
    emailVerified: boolean;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: 'user' | 'admin';
    birthdate: string | null;
    timezone: string;
    emailVerified: boolean;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
  }
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(token: {
  refreshToken: string;
  [key: string]: unknown;
}): Promise<{ [key: string]: unknown }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error?.message || 'Failed to refresh token');
    }

    const { tokens } = data.data;
    const expiresAt = Date.now() + tokens.expiresIn * 1000;

    return {
      ...token,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresAt,
      error: undefined,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials provider for email/password login
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'checkbox' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call Workers /auth/login endpoint
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error?.message || 'Invalid credentials');
          }

          const { user, tokens } = data.data;
          const expiresAt = Date.now() + tokens.expiresIn * 1000;

          // Return user object with tokens
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            birthdate: user.birthdate,
            timezone: user.timezone,
            emailVerified: user.emailVerified,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt,
          };
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),

    // Google OAuth provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  // Use JWT strategy for session
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days (for remember me)
    updateAge: 24 * 60 * 60, // 24 hours
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/login',
    newUser: '/auth/register',
  },

  // Callbacks
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user && account) {
        // Handle Google OAuth sign in
        if (account.provider === 'google') {
          try {
            // Call Workers to create/link Google user
            const response = await fetch(`${API_BASE_URL}/auth/oauth/google`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                providerAccountId: account.providerAccountId,
                accessToken: account.access_token,
                idToken: account.id_token,
              }),
            });

            const data = await response.json();

            if (data.success) {
              const { user: userData, tokens } = data.data;
              const expiresAt = Date.now() + tokens.expiresIn * 1000;

              return {
                id: userData.id,
                email: userData.email,
                role: userData.role,
                birthdate: userData.birthdate,
                timezone: userData.timezone,
                emailVerified: userData.emailVerified,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                expiresAt,
              };
            }
          } catch (error) {
            console.error('Google OAuth error:', error);
            throw new Error('Failed to authenticate with Google');
          }
        }

        // Credentials sign in - user object already has tokens
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          birthdate: user.birthdate,
          timezone: user.timezone,
          emailVerified: user.emailVerified,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresAt: user.expiresAt,
        };
      }

      // Handle session update
      if (trigger === 'update' && session) {
        return {
          ...token,
          ...session,
        };
      }

      // Check if token needs refresh
      const shouldRefreshToken = token.expiresAt && Date.now() > (token.expiresAt as number) - 60000; // Refresh 1 min before expiry

      if (shouldRefreshToken) {
        return refreshAccessToken(token);
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          role: token.role as 'user' | 'admin',
          birthdate: token.birthdate as string | null,
          timezone: token.timezone as string,
          emailVerified: token.emailVerified as boolean,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
          expiresAt: token.expiresAt as number,
        };
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.expiresAt = token.expiresAt as number;
        session.error = token.error;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Allow credentials provider always
      if (account?.provider === 'credentials') {
        return true;
      }

      // Allow Google OAuth
      if (account?.provider === 'google') {
        return true;
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // Events
  events: {
    async signOut({ token }) {
      // Revoke refresh token on Workers
      if (token?.refreshToken) {
        try {
          await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });
        } catch (error) {
          console.error('Error revoking token on logout:', error);
        }
      }
    },
  },

  // Debug mode in development
  debug: process.env.NODE_ENV === 'development',

  // Secret for signing cookies and tokens
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
