# Data Model: User Authentication System

**Feature**: 001-user-auth  
**Date**: 2026-05-08  
**Storage**: PostgreSQL (Drizzle ORM)

---

## Entities

### 1. `users`

Represents a registered account.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Surrogate primary key |
| `email` | `varchar(320)` | NOT NULL, UNIQUE | Stored lowercase; max per RFC 5321 |
| `password_hash` | `varchar(255)` | NOT NULL | bcrypt hash (cost 12) |
| `is_verified` | `boolean` | NOT NULL, default `false` | Email verification status |
| `is_active` | `boolean` | NOT NULL, default `true` | Admin-disable flag |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Account creation time (UTC) |
| `updated_at` | `timestamptz` | NOT NULL, default `now()` | Last update time (auto-maintained) |
| `last_login_at` | `timestamptz` | NULL | Timestamp of most recent successful login |
| `deleted_at` | `timestamptz` | NULL | Soft-delete timestamp (right to erasure; PII overwritten on erasure job) |

**Indexes**:
- `UNIQUE (email)` — enforces case-insensitive uniqueness (email stored pre-lowercased)

**State transitions**:
```
UNVERIFIED → VERIFIED  (on email link click, FR-002)
ACTIVE     → INACTIVE  (admin disable)
ACTIVE     → DELETED   (right-to-erasure request, FR-013)
```

---

### 2. `refresh_tokens`

Represents an active authenticated session / refresh token.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Surrogate key |
| `user_id` | `uuid` | NOT NULL, FK → `users.id` ON DELETE CASCADE | Owning user |
| `token_hash` | `varchar(255)` | NOT NULL, UNIQUE | SHA-256 hash of the opaque token value |
| `expires_at` | `timestamptz` | NOT NULL | 7 days from issuance |
| `revoked_at` | `timestamptz` | NULL | Set on logout or password reset |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Issuance time |

**Notes**:
- The raw token is returned to the client once and never stored; only `token_hash` is persisted.
- A token is valid when: `revoked_at IS NULL AND expires_at > now()`.
- On logout or password reset, all `refresh_tokens` for the user are revoked (set `revoked_at = now()`).

**Indexes**:
- `UNIQUE (token_hash)` — O(1) lookup on refresh
- `INDEX (user_id)` — fast revocation of all user tokens

---

### 3. `email_verification_tokens`

Represents a single-use email verification link token.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Surrogate key |
| `user_id` | `uuid` | NOT NULL, FK → `users.id` ON DELETE CASCADE | Owning user |
| `token_hash` | `varchar(255)` | NOT NULL, UNIQUE | SHA-256 hash of the token in the link |
| `expires_at` | `timestamptz` | NOT NULL | 24 hours from issuance |
| `used_at` | `timestamptz` | NULL | Set when the link is followed |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Issuance time |

**Notes**:
- Only one active (unused, unexpired) token per user at a time; re-request invalidates previous.
- Token value in the email link is a cryptographically random 32-byte hex string.

---

### 4. `password_reset_tokens`

Represents a single-use password-reset link token.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | Surrogate key |
| `user_id` | `uuid` | NOT NULL, FK → `users.id` ON DELETE CASCADE | Owning user |
| `token_hash` | `varchar(255)` | NOT NULL, UNIQUE | SHA-256 hash of the token in the link |
| `expires_at` | `timestamptz` | NOT NULL | 1 hour from issuance |
| `used_at` | `timestamptz` | NULL | Set when the reset is completed |
| `created_at` | `timestamptz` | NOT NULL, default `now()` | Issuance time |

**Notes**:
- Only one active token per user at a time; re-request supersedes the previous one.
- On reset completion, all `refresh_tokens` for the user are also revoked.

---

### 5. Rate-Limit Store (In-Process, Not Persisted)

Rate-limiting counters are maintained in-process (not in PostgreSQL) for sub-millisecond
access. The store is a `Map<string, RateLimitEntry>`:

```typescript
/** Key: normalised email address. */
interface RateLimitEntry {
  /** Number of failed login attempts in the current window. */
  count: number;
  /** Unix timestamp (ms) when the window resets. */
  resetAt: number;
}
```

Window: 15 minutes. Threshold: 5 failures → account temporarily locked.  
State is lost on process restart; this is acceptable for a single-instance deployment.

---

## Entity Relationships

```
users (1) ──< refresh_tokens          (one user → many tokens)
users (1) ──< email_verification_tokens  (one user → many tokens, only one active)
users (1) ──< password_reset_tokens    (one user → many tokens, only one active)
```

All child records are `ON DELETE CASCADE` from `users`, so a hard-delete of a user record
removes all associated tokens. The right-to-erasure flow (FR-013) overwrites PII fields
(email, password_hash) in `users` and then sets `deleted_at`; a nightly job hard-deletes
rows where `deleted_at < now() - interval '30 days'`.

---

## Validation Rules

| Rule | Detail |
|------|--------|
| Email format | RFC 5322 compatible regex; max 320 characters; stored lowercase |
| Email uniqueness | Case-insensitive (normalised before insert/lookup) |
| Password complexity | ≥ 8 chars, ≥ 1 uppercase, ≥ 1 digit, ≥ 1 special character |
| Password max length | 72 bytes (bcrypt input limit; enforce before hashing) |
| Token randomness | `crypto.randomBytes(32).toString('hex')` — 256 bits entropy |
| Token storage | Only SHA-256 hash stored; raw value returned to client once only |
| Refresh token lifetime | 7 days |
| Reset token lifetime | 1 hour |
| Verification token lifetime | 24 hours |

---

## Drizzle Schema Sketch

```typescript
// src/db/schema.ts
import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id:           uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email:        varchar('email', { length: 320 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  isVerified:   boolean('is_verified').notNull().default(false),
  isActive:     boolean('is_active').notNull().default(true),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:    timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt:  timestamp('last_login_at', { withTimezone: true }),
  deletedAt:    timestamp('deleted_at', { withTimezone: true }),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id:        uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// email_verification_tokens and password_reset_tokens follow the same pattern
```
