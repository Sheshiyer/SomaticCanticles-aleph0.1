import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    email: string;
    role: "user" | "admin";
    birthdate: string | null;
    timezone: string;
    emailVerified: boolean;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      role: "user" | "admin";
      birthdate: string | null;
      timezone: string;
      emailVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    role: "user" | "admin";
    birthdate: string | null;
    timezone: string;
    emailVerified: boolean;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
  }
}
