// Authentication Types for Somatic-Canticles Frontend

// User role type
export type UserRole = 'user' | 'admin';

// User model
export interface User {
  id: string;
  email: string;
  role: UserRole;
  birthdate: string | null;
  timezone: string;
  emailVerified: boolean;
  createdAt?: string;
}

// Token response
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  tokenType: 'Bearer';
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  success: true;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

// Register request
export interface RegisterRequest {
  email: string;
  password: string;
  birthdate?: string;
  timezone?: string;
}

// Register response
export interface RegisterResponse {
  success: true;
  data: {
    user: User;
    tokens: AuthTokens;
  };
}

// Refresh token request
export interface RefreshRequest {
  refreshToken: string;
}

// Refresh token response
export interface RefreshResponse {
  success: true;
  data: {
    tokens: AuthTokens;
  };
}

// Logout request
export interface LogoutRequest {
  refreshToken: string;
}

// Profile update request
export interface UpdateProfileRequest {
  birthdate?: string;
  timezone?: string;
}

// Profile update response
export interface UpdateProfileResponse {
  success: true;
  data: {
    user: User;
  };
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Forgot password request
export interface ForgotPasswordRequest {
  email: string;
}

// Reset password request
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Generic success response
export interface SuccessResponse {
  success: true;
  data: {
    message: string;
  };
}

// Error response
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

// Auth error codes
export type AuthErrorCode =
  | 'AUTH_MISSING_CREDENTIALS'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_MISSING_TOKEN'
  | 'AUTH_INVALID_TOKEN_FORMAT'
  | 'AUTH_INVALID_TOKEN'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_WRONG_TOKEN_TYPE'
  | 'AUTH_INVALID_REFRESH_TOKEN'
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_FORBIDDEN'
  | 'AUTH_EMAIL_EXISTS'
  | 'AUTH_WEAK_PASSWORD'
  | 'AUTH_VALIDATION_ERROR'
  | 'AUTH_INCORRECT_PASSWORD'
  | 'AUTH_RATE_LIMITED'
  | 'AUTH_USER_NOT_FOUND'
  | 'AUTH_NO_FIELDS_TO_UPDATE';

// Auth state
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context value
export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

// JWT payload structure
export interface JWTPayload {
  sub: string;    // User ID
  email: string;
  role: UserRole;
  iat: number;    // Issued at
  exp: number;    // Expires at
  type: 'access';
}

// Refresh token payload
export interface RefreshTokenPayload {
  sub: string;    // User ID
  jti: string;    // Token ID
  iat: number;
  exp: number;
  type: 'refresh';
}
