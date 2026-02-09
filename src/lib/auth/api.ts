// Authentication API Client for Somatic-Canticles
// This file contains both mocked and real API calls for authentication

import type {
  User,
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
} from './types';

// API Base URL - configured via environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/api/v1';

// Flag to enable mocking (for development)
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

// Mock user for development
const MOCK_USER: User = {
  id: 'test-001',
  email: 'test@example.com',
  role: 'user',
  birthdate: '1990-05-15',
  timezone: 'America/New_York',
  emailVerified: true,
  createdAt: '2024-01-15T08:30:00.000Z',
};

// Mock tokens for development
const MOCK_TOKENS: AuthTokens = {
  accessToken: 'mock_access_token_' + Date.now(),
  refreshToken: 'mock_refresh_token_' + Date.now(),
  expiresIn: 900,
  tokenType: 'Bearer',
};

/**
 * Helper function to make API requests
 */
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as ApiError;
  }

  return data as T;
}

/**
 * Get stored tokens from localStorage
 */
function getStoredTokens(): AuthTokens | null {
  if (typeof window === 'undefined') return null;
  
  const tokens = localStorage.getItem('auth_tokens');
  return tokens ? JSON.parse(tokens) : null;
}

/**
 * Store tokens in localStorage
 */
function storeTokens(tokens: AuthTokens): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
}

/**
 * Clear stored tokens
 */
function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_tokens');
  localStorage.removeItem('user');
}

/**
 * Store user in localStorage
 */
function storeUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Get stored user from localStorage
 */
function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// ============================================
// AUTHENTICATION API METHODS
// ============================================

/**
 * Login with email and password
 * POST /auth/login
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCKS) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock credential validation
    if (data.email === 'test@example.com' && data.password === 'TestUser13!') {
      const response: LoginResponse = {
        success: true,
        data: {
          user: MOCK_USER,
          tokens: MOCK_TOKENS,
        },
      };
      storeTokens(response.data.tokens);
      storeUser(response.data.user);
      return response;
    }
    
    throw {
      success: false,
      error: {
        code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      },
    } as ApiError;
  }

  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  storeTokens(response.data.tokens);
  storeUser(response.data.user);
  return response;
}

/**
 * Register a new user
 * POST /auth/register
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock duplicate email check
    if (data.email === 'test@example.com') {
      throw {
        success: false,
        error: {
          code: 'AUTH_EMAIL_EXISTS',
          message: 'An account with this email already exists',
        },
      } as ApiError;
    }
    
    const newUser: User = {
      id: 'user-' + Date.now(),
      email: data.email,
      role: 'user',
      birthdate: data.birthdate || null,
      timezone: data.timezone || 'UTC',
      emailVerified: false,
    };
    
    const response: RegisterResponse = {
      success: true,
      data: {
        user: newUser,
        tokens: MOCK_TOKENS,
      },
    };
    
    storeTokens(response.data.tokens);
    storeUser(response.data.user);
    return response;
  }

  const response = await apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  storeTokens(response.data.tokens);
  storeUser(response.data.user);
  return response;
}

/**
 * Refresh access token
 * POST /auth/refresh
 */
export async function refreshToken(): Promise<RefreshResponse> {
  const tokens = getStoredTokens();
  
  if (!tokens?.refreshToken) {
    throw {
      success: false,
      error: {
        code: 'AUTH_INVALID_REFRESH_TOKEN',
        message: 'No refresh token available',
      },
    } as ApiError;
  }

  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTokens: AuthTokens = {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: tokens.refreshToken,
      expiresIn: 900,
      tokenType: 'Bearer',
    };
    
    const response: RefreshResponse = {
      success: true,
      data: {
        tokens: newTokens,
      },
    };
    
    storeTokens(newTokens);
    return response;
  }

  const response = await apiRequest<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: tokens.refreshToken } as RefreshRequest),
  });
  
  storeTokens(response.data.tokens);
  return response;
}

/**
 * Logout user
 * POST /auth/logout
 */
export async function logout(): Promise<SuccessResponse> {
  const tokens = getStoredTokens();
  
  if (!USE_MOCKS && tokens?.refreshToken) {
    try {
      await apiRequest<SuccessResponse>('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: tokens.refreshToken } as LogoutRequest),
      });
    } catch {
      // Ignore errors during logout
    }
  }
  
  clearTokens();
  
  return {
    success: true,
    data: { message: 'Logged out successfully' },
  };
}

/**
 * Logout from all devices
 * POST /auth/logout-all
 */
export async function logoutAll(): Promise<SuccessResponse> {
  if (!USE_MOCKS) {
    const tokens = getStoredTokens();
    
    if (tokens?.accessToken) {
      await apiRequest<SuccessResponse>('/auth/logout-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      });
    }
  }
  
  clearTokens();
  
  return {
    success: true,
    data: { message: 'Logged out from all devices' },
  };
}

/**
 * Get current user profile
 * GET /auth/me
 */
export async function getMe(): Promise<{ success: true; data: { user: User } }> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const user = getStoredUser() || MOCK_USER;
    return {
      success: true,
      data: { user },
    };
  }

  const tokens = getStoredTokens();
  
  return apiRequest('/auth/me', {
    headers: {
      'Authorization': `Bearer ${tokens?.accessToken}`,
    },
  });
}

/**
 * Update user profile
 * PUT /auth/me
 */
export async function updateProfile(
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const currentUser = getStoredUser() || MOCK_USER;
    const updatedUser: User = {
      ...currentUser,
      ...data,
    };
    
    storeUser(updatedUser);
    
    return {
      success: true,
      data: { user: updatedUser },
    };
  }

  const tokens = getStoredTokens();
  
  const response = await apiRequest<UpdateProfileResponse>('/auth/me', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${tokens?.accessToken}`,
    },
    body: JSON.stringify(data),
  });
  
  storeUser(response.data.user);
  return response;
}

/**
 * Change password
 * POST /auth/change-password
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<SuccessResponse> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (data.currentPassword !== 'TestUser13!') {
      throw {
        success: false,
        error: {
          code: 'AUTH_INCORRECT_PASSWORD',
          message: 'Current password is incorrect',
        },
      } as ApiError;
    }
    
    return {
      success: true,
      data: { message: 'Password changed successfully' },
    };
  }

  const tokens = getStoredTokens();
  
  return apiRequest<SuccessResponse>('/auth/change-password', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokens?.accessToken}`,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Request password reset
 * POST /auth/forgot-password
 */
export async function forgotPassword(
  data: ForgotPasswordRequest
): Promise<SuccessResponse> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: { message: 'If an account exists, a password reset email has been sent' },
    };
  }

  return apiRequest<SuccessResponse>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Reset password with token
 * POST /auth/reset-password
 */
export async function resetPassword(
  data: ResetPasswordRequest
): Promise<SuccessResponse> {
  if (USE_MOCKS) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: { message: 'Password reset successfully' },
    };
  }

  return apiRequest<SuccessResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============================================
// AUTH STATE HELPERS
// ============================================

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getStoredTokens()?.accessToken;
}

/**
 * Get current access token
 */
export function getAccessToken(): string | null {
  return getStoredTokens()?.accessToken || null;
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  return getStoredUser();
}

/**
 * Initialize auth state from storage
 */
export function initAuth(): { user: User | null; tokens: AuthTokens | null } {
  return {
    user: getStoredUser(),
    tokens: getStoredTokens(),
  };
}

// Export all functions
export {
  getStoredTokens,
  storeTokens,
  clearTokens,
  getStoredUser,
  storeUser,
};
