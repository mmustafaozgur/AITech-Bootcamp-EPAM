# API Contract: Auth Endpoints

**Feature**: 001-user-auth  
**Base URL**: `/auth`  
**Content-Type**: `application/json`  
**Date**: 2026-05-08

All error responses follow the shape:
```json
{ "error": "<human-readable message>", "code": "<SCREAMING_SNAKE_CASE>" }
```

---

## POST `/auth/register`

Creates a new user account and sends an email-verification link.

**Auth required**: No

### Request Body

```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd!"
}
```

| Field | Type | Rules |
|-------|------|-------|
| `email` | `string` | Valid RFC 5322 email, max 320 chars |
| `password` | `string` | Min 8 chars, ≥1 uppercase, ≥1 digit, ≥1 special char, max 72 bytes |

### Responses

**201 Created**
```json
{ "message": "Registration successful. Please verify your email." }
```

**409 Conflict** — email already registered
```json
{ "error": "Email already in use.", "code": "EMAIL_CONFLICT" }
```

**422 Unprocessable Entity** — validation failure
```json
{
  "error": "Validation failed.",
  "code": "VALIDATION_ERROR",
  "fields": {
    "email": "Must be a valid email address.",
    "password": "Must contain at least one special character."
  }
}
```

---

## POST `/auth/verify-email`

Marks a user's email as verified using the token from the verification link.

**Auth required**: No

### Request Body

```json
{ "token": "<256-bit hex token from email link>" }
```

### Responses

**200 OK**
```json
{ "message": "Email verified successfully." }
```

**400 Bad Request** — token invalid, expired, or already used
```json
{ "error": "Verification token is invalid or has expired.", "code": "INVALID_TOKEN" }
```

---

## POST `/auth/login`

Validates credentials and issues a JWT access token + opaque refresh token.

**Auth required**: No

### Request Body

```json
{
  "email": "user@example.com",
  "password": "P@ssw0rd!"
}
```

### Responses

**200 OK**
```json
{
  "accessToken": "<HS256 JWT, 24h expiry>",
  "refreshToken": "<opaque 256-bit hex, 7-day expiry>",
  "expiresIn": 86400
}
```

**401 Unauthorized** — invalid credentials or unverified email
```json
{ "error": "Invalid credentials.", "code": "INVALID_CREDENTIALS" }
```

**403 Forbidden** — account locked due to rate limit
```json
{
  "error": "Account temporarily locked due to too many failed attempts. Try again later.",
  "code": "ACCOUNT_LOCKED",
  "retryAfterSeconds": 900
}
```

---

## POST `/auth/refresh`

Exchanges a valid refresh token for a new JWT access token.

**Auth required**: No (refresh token in body)

### Request Body

```json
{ "refreshToken": "<opaque 256-bit hex>" }
```

### Responses

**200 OK**
```json
{
  "accessToken": "<HS256 JWT, 24h expiry>",
  "expiresIn": 86400
}
```

**401 Unauthorized** — token invalid, expired, or revoked
```json
{ "error": "Refresh token is invalid or has expired.", "code": "INVALID_REFRESH_TOKEN" }
```

---

## POST `/auth/logout`

Revokes the provided refresh token, ending the session.

**Auth required**: Yes (Bearer access token in `Authorization` header)

### Request Body

```json
{ "refreshToken": "<opaque 256-bit hex>" }
```

### Responses

**200 OK**
```json
{ "message": "Logged out successfully." }
```

**401 Unauthorized** — missing or invalid access token
```json
{ "error": "Authentication required.", "code": "UNAUTHENTICATED" }
```

---

## GET `/auth/me`

Returns the authenticated user's profile.

**Auth required**: Yes (Bearer access token)

### Headers

```
Authorization: Bearer <accessToken>
```

### Responses

**200 OK**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "isVerified": true,
  "createdAt": "2026-05-08T00:00:00.000Z",
  "lastLoginAt": "2026-05-08T12:00:00.000Z"
}
```

**401 Unauthorized**
```json
{ "error": "Authentication required.", "code": "UNAUTHENTICATED" }
```

---

## POST `/auth/forgot-password`

Initiates a password-reset flow by sending a reset link to the email address.

**Auth required**: No

### Request Body

```json
{ "email": "user@example.com" }
```

### Responses

**200 OK** — always returned, even if email is not registered (prevents enumeration)
```json
{ "message": "If that address is registered, a reset link has been sent." }
```

---

## POST `/auth/reset-password`

Completes the password-reset flow using a single-use token.

**Auth required**: No

### Request Body

```json
{
  "token": "<256-bit hex token from reset email link>",
  "newPassword": "N3wP@ssw0rd!"
}
```

### Responses

**200 OK**
```json
{ "message": "Password reset successfully. Please log in with your new password." }
```

**400 Bad Request** — token invalid, expired, or already used
```json
{ "error": "Reset token is invalid or has expired.", "code": "INVALID_TOKEN" }
```

**422 Unprocessable Entity** — password does not meet complexity rules
```json
{
  "error": "Validation failed.",
  "code": "VALIDATION_ERROR",
  "fields": { "newPassword": "Must contain at least one digit." }
}
```

---

## DELETE `/auth/account`

Schedules the account for erasure (GDPR right to erasure, FR-013). PII is overwritten
within 30 days. Immediately revokes all sessions.

**Auth required**: Yes (Bearer access token)

### Request Body

```json
{ "password": "<current password for confirmation>" }
```

### Responses

**200 OK**
```json
{ "message": "Account deletion scheduled. Your data will be erased within 30 days." }
```

**401 Unauthorized** — wrong password or missing token
```json
{ "error": "Authentication required.", "code": "UNAUTHENTICATED" }
```

---

## JWT Access Token Claims

```json
{
  "sub": "<user uuid>",
  "email": "user@example.com",
  "iat": 1715123456,
  "exp": 1715209856
}
```

| Claim | Description |
|-------|-------------|
| `sub` | User UUID (primary identifier) |
| `email` | User email at time of token issuance |
| `iat` | Issued-at (Unix seconds) |
| `exp` | Expiry (Unix seconds, 24 h after `iat`) |

Algorithm: **HS256**  
Secret: from `JWT_SECRET` environment variable (minimum 32 characters)

---

## Security Headers (all responses)

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

Rate limiting headers (on `POST /auth/login` when limit approached):
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: <n>
X-RateLimit-Reset: <Unix timestamp>
```
