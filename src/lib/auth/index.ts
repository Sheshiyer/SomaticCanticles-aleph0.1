// Authentication library exports for Somatic-Canticles Frontend

// Re-export NextAuth hooks
export { signIn, signOut, useSession, getSession } from 'next-auth/react';

// Types
export type {
  User,
  UserRole,
  AuthTokens,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutRequest,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SuccessResponse,
  ApiError,
  AuthErrorCode,
  AuthState,
  AuthContextValue,
  JWTPayload,
  RefreshTokenPayload,
} from './types';

// API functions (for backward compatibility and server-side use)
export {
  // Authentication
  register,

  // Password
  changePassword,
  forgotPassword,
  resetPassword,
} from './api';
