# Authentication API Contract

## Overview

The Somatic-Canticles authentication system uses JWT (JSON Web Tokens) with access tokens and refresh tokens for secure session management.

- **Access Token**: Short-lived (15 minutes), contains user claims
- **Refresh Token**: Long-lived (7 days), stored in D1 database for rotation

## Base URL

```
/api/v1/auth
```

---

## Endpoints

### POST /auth/login

Authenticate a user and receive access and refresh tokens.

#### Request

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email address |
| password | string | Yes | User password |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "role": "user",
      "birthdate": "1990-05-15",
      "timezone": "America/New_York"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  }
}
```

**Error (401 Unauthorized)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

**Error (429 Too Many Requests)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_RATE_LIMITED",
    "message": "Too many login attempts. Please try again in 5 minutes."
  }
}
```

---

### POST /auth/register

Register a new user account.

#### Request

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "birthdate": "1990-05-15",
  "timezone": "America/New_York"
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email address (must be unique) |
| password | string | Yes | Password (min 12 chars, complexity requirements) |
| birthdate | string | No | User birthdate (ISO 8601 format) |
| timezone | string | No | User timezone (default: 'UTC') |

#### Response

**Success (201 Created)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "newuser@example.com",
      "role": "user",
      "birthdate": "1990-05-15",
      "timezone": "America/New_York",
      "emailVerified": false
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  }
}
```

**Error (409 Conflict)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_EMAIL_EXISTS",
    "message": "An account with this email already exists"
  }
}
```

**Error (400 Bad Request)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_WEAK_PASSWORD",
    "message": "Password does not meet complexity requirements"
  }
}
```

---

### POST /auth/refresh

Refresh an access token using a valid refresh token.

#### Request

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refreshToken | string | Yes | Valid refresh token |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    }
  }
}
```

**Error (401 Unauthorized)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INVALID_REFRESH_TOKEN",
    "message": "Invalid or expired refresh token"
  }
}
```

---

### POST /auth/logout

Logout the current user and revoke the refresh token.

#### Request

```http
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### POST /auth/logout-all

Logout from all devices by revoking all refresh tokens.

#### Request

```http
POST /api/v1/auth/logout-all
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "message": "Logged out from all devices"
  }
}
```

---

### GET /auth/me

Get the current authenticated user's profile.

#### Request

```http
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "role": "user",
      "birthdate": "1990-05-15",
      "timezone": "America/New_York",
      "emailVerified": true,
      "createdAt": "2024-01-15T08:30:00.000Z"
    }
  }
}
```

**Error (401 Unauthorized)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

### PUT /auth/me

Update the current user's profile.

#### Request

```http
PUT /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "birthdate": "1990-05-15",
  "timezone": "Europe/London"
}
```

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| birthdate | string | No | User birthdate (ISO 8601 format) |
| timezone | string | No | User timezone |

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "role": "user",
      "birthdate": "1990-05-15",
      "timezone": "Europe/London",
      "emailVerified": true
    }
  }
}
```

---

### POST /auth/change-password

Change the current user's password.

#### Request

```http
POST /api/v1/auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!"
}
```

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "message": "Password changed successfully"
  }
}
```

**Error (400 Bad Request)**

```json
{
  "success": false,
  "error": {
    "code": "AUTH_INCORRECT_PASSWORD",
    "message": "Current password is incorrect"
  }
}
```

---

### POST /auth/forgot-password

Request a password reset email.

#### Request

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "message": "If an account exists, a password reset email has been sent"
  }
}
```

---

### POST /auth/reset-password

Reset password using a reset token.

#### Request

```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-abc123",
  "newPassword": "NewPassword789!"
}
```

#### Response

**Success (200 OK)**

```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

---

## Authentication Header

All protected endpoints require an `Authorization` header with a Bearer token:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Token Payload Structure

### Access Token Claims

```json
{
  "sub": "usr_abc123",        // User ID
  "email": "user@example.com",
  "role": "user",
  "iat": 1705312800,           // Issued at
  "exp": 1705313700,           // Expires at (15 minutes)
  "type": "access"
}
```

### Refresh Token Claims

```json
{
  "sub": "usr_abc123",         // User ID
  "jti": "rtk_def456",         // Token ID for rotation
  "iat": 1705312800,
  "exp": 1705917600,           // Expires at (7 days)
  "type": "refresh"
}
```

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/login | 5 attempts | 1 minute |
| POST /auth/register | 3 attempts | 5 minutes |
| POST /auth/refresh | 10 attempts | 1 minute |
| POST /auth/forgot-password | 3 attempts | 1 hour |

## Password Requirements

- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

