# Error Codes Reference

## Overview

This document defines all error codes returned by the Somatic-Canticles API. All errors follow a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description"
  }
}
```

---

## Authentication Errors (AUTH_*)

### AUTH_MISSING_CREDENTIALS
- **HTTP Status**: 400 Bad Request
- **Description**: Email and/or password were not provided in the request
- **Context**: Login attempts without required fields

### AUTH_INVALID_CREDENTIALS
- **HTTP Status**: 401 Unauthorized
- **Description**: Email or password is incorrect
- **Context**: Failed login attempts
- **Security Note**: Returns same message for unknown email vs wrong password to prevent user enumeration

### AUTH_MISSING_TOKEN
- **HTTP Status**: 401 Unauthorized
- **Description**: Authorization header is missing from the request
- **Context**: Protected endpoint access without authentication

### AUTH_INVALID_TOKEN_FORMAT
- **HTTP Status**: 401 Unauthorized
- **Description**: Authorization header is not in the expected Bearer token format
- **Expected Format**: `Authorization: Bearer <token>`

### AUTH_INVALID_TOKEN
- **HTTP Status**: 401 Unauthorized
- **Description**: The provided token is malformed, has an invalid signature, or cannot be parsed
- **Context**: Corrupted or tampered tokens

### AUTH_TOKEN_EXPIRED
- **HTTP Status**: 401 Unauthorized
- **Description**: The access token has expired and needs to be refreshed
- **Solution**: Use the `/auth/refresh` endpoint with a valid refresh token

### AUTH_WRONG_TOKEN_TYPE
- **HTTP Status**: 401 Unauthorized
- **Description**: Token type mismatch (e.g., using a refresh token as an access token)
- **Context**: Wrong token used for the operation

### AUTH_INVALID_REFRESH_TOKEN
- **HTTP Status**: 401 Unauthorized
- **Description**: The refresh token is invalid, expired, or has been revoked
- **Context**: Token rotation, logout, or expiration

### AUTH_UNAUTHORIZED
- **HTTP Status**: 401 Unauthorized
- **Description**: Authentication is required but not provided or failed
- **Context**: Protected endpoint access

### AUTH_FORBIDDEN
- **HTTP Status**: 403 Forbidden
- **Description**: User does not have permission to access the resource
- **Context**: Admin-only endpoints accessed by regular users

### AUTH_EMAIL_EXISTS
- **HTTP Status**: 409 Conflict
- **Description**: An account with this email address already exists
- **Context**: Registration with duplicate email

### AUTH_WEAK_PASSWORD / AUTH_VALIDATION_ERROR
- **HTTP Status**: 400 Bad Request
- **Description**: Password does not meet complexity requirements
- **Requirements**:
  - Minimum 12 characters
  - At least one uppercase letter (A-Z)
  - At least one lowercase letter (a-z)
  - At least one number (0-9)
  - At least one special character (!@#$%^&*)

### AUTH_INCORRECT_PASSWORD
- **HTTP Status**: 400 Bad Request
- **Description**: Current password is incorrect (during password change)
- **Context**: Password change requests with wrong current password

### AUTH_RATE_LIMITED
- **HTTP Status**: 429 Too Many Requests
- **Description**: Too many requests have been made to this endpoint
- **Retry-After Header**: Contains seconds until the next attempt is allowed
- **Rate Limits**:
  | Endpoint | Limit | Window |
  |----------|-------|--------|
  | POST /auth/login | 5 attempts | 1 minute |
  | POST /auth/register | 3 attempts | 5 minutes |
  | POST /auth/refresh | 10 attempts | 1 minute |
  | POST /auth/forgot-password | 3 attempts | 1 hour |

### AUTH_USER_NOT_FOUND
- **HTTP Status**: 404 Not Found
- **Description**: The requested user account could not be found
- **Context**: Profile lookups, password reset attempts

### AUTH_NO_FIELDS_TO_UPDATE
- **HTTP Status**: 400 Bad Request
- **Description**: Profile update request contained no valid fields to update
- **Context**: PUT /auth/me with empty body

---

## Chapter Errors (CHAPTER_*)

### CHAPTER_NOT_FOUND
- **HTTP Status**: 404 Not Found
- **Description**: The requested chapter does not exist
- **Context**: Invalid chapter ID (valid range: 1-12)

### CHAPTER_LOCKED
- **HTTP Status**: 403 Forbidden
- **Description**: The chapter has not been unlocked for this user yet
- **Context**: Attempting to access chapters before completing prerequisites

### CHAPTER_ALREADY_COMPLETED
- **HTTP Status**: 409 Conflict
- **Description**: The chapter has already been marked as completed
- **Context**: Redundant completion attempts

---

## Progress Errors (PROGRESS_*)

### PROGRESS_NOT_FOUND
- **HTTP Status**: 404 Not Found
- **Description**: No progress record found for the user/chapter combination
- **Context**: Progress lookups before chapter initialization

### PROGRESS_INVALID_PERCENTAGE
- **HTTP Status**: 400 Bad Request
- **Description**: Completion percentage must be between 0 and 100
- **Context**: Invalid progress updates

---

## Biorhythm Errors (BIORHYTHM_*)

### BIORHYTHM_NO_BIRTHDATE
- **HTTP Status**: 400 Bad Request
- **Description**: User has not provided a birthdate required for biorhythm calculation
- **Solution**: User should update their profile with a birthdate

### BIORHYTHM_INVALID_DATE
- **HTTP Status**: 400 Bad Request
- **Description**: The requested date is invalid or outside the allowed range
- **Context**: Date format errors or future dates beyond calculation limit

---

## Validation Errors (VALIDATION_*)

### VALIDATION_ERROR
- **HTTP Status**: 400 Bad Request
- **Description**: Request body validation failed
- **Format**: Includes specific field errors

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email: Invalid email address; password: Must be at least 12 characters"
  }
}
```

### VALIDATION_INVALID_JSON
- **HTTP Status**: 400 Bad Request
- **Description**: Request body is not valid JSON
- **Context**: Malformed request bodies

---

## Server Errors (SERVER_*)

### INTERNAL_SERVER_ERROR
- **HTTP Status**: 500 Internal Server Error
- **Description**: An unexpected error occurred on the server
- **Note**: In production, detailed error messages are not exposed

### SERVICE_UNAVAILABLE
- **HTTP Status**: 503 Service Unavailable
- **Description**: The service is temporarily unavailable
- **Context**: Database connection issues, maintenance mode

### NOT_IMPLEMENTED
- **HTTP Status**: 501 Not Implemented
- **Description**: The requested feature is not yet implemented
- **Context**: Placeholder endpoints, upcoming features

---

## HTTP Status Code Reference

| Code | Name | Usage |
|------|------|-------|
| 200 | OK | Successful GET, PUT requests |
| 201 | Created | Successful POST requests (resource creation) |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Validation errors, malformed requests |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource conflict (duplicate, etc.) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 501 | Not Implemented | Feature not yet available |
| 503 | Service Unavailable | Service temporarily down |

---

## Error Handling Best Practices

### Client-Side

1. **Check HTTP status first** - Use the status code for broad categorization
2. **Parse error.code** - For specific error handling logic
3. **Display error.message** - Show user-friendly messages to users
4. **Handle rate limiting** - Check `Retry-After` header for 429 responses
5. **Token expiration** - Automatically refresh on AUTH_TOKEN_EXPIRED

### Example Error Handling

```typescript
async function apiRequest(endpoint: string, options?: RequestInit) {
  const response = await fetch(endpoint, options);
  
  if (!response.ok) {
    const error = await response.json();
    
    switch (error.error.code) {
      case 'AUTH_TOKEN_EXPIRED':
        // Attempt token refresh
        await refreshToken();
        return apiRequest(endpoint, options);
        
      case 'AUTH_INVALID_CREDENTIALS':
        throw new AuthError('Invalid email or password');
        
      case 'AUTH_RATE_LIMITED':
        const retryAfter = response.headers.get('Retry-After');
        throw new RateLimitError(`Please try again in ${retryAfter} seconds`);
        
      case 'VALIDATION_ERROR':
        throw new ValidationError(error.error.message);
        
      default:
        throw new ApiError(error.error.message);
    }
  }
  
  return response.json();
}
```

