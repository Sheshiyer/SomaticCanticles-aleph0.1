// Authentication API Client for Somatic-Canticles
// This file contains API calls to the backend auth endpoints

import type {
  RegisterRequest,
  RegisterResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  SuccessResponse,
  ApiError,
} from './types';

// API Base URL - configured via environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

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

// ============================================
// AUTHENTICATION API METHODS
// ============================================

/**
 * Register a new user
 * POST /auth/register
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Change password
 * POST /auth/change-password
 */
export async function changePassword(
  data: ChangePasswordRequest,
  accessToken: string
): Promise<SuccessResponse> {
  return apiRequest<SuccessResponse>('/auth/change-password', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
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
  return apiRequest<SuccessResponse>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

