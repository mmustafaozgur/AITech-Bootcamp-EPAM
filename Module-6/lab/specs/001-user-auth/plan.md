# Implementation Plan: User Authentication System

**Branch**: `001-user-auth` | **Date**: 2026-05-08 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/001-user-auth/spec.md`

---

## Summary

Build a standalone, single-service user authentication REST API using Express.js and TypeScript
(strict mode). The system provides user registration with email verification, JWT-based login
(access token: 24 h, refresh token: 7 days), password reset via single-use email links, and
session management including logout and token refresh. All data is persisted in PostgreSQL via
Drizzle ORM. Passwords are hashed with bcrypt (cost 12). Rate limiting (5 attempts / 15 min)
is enforced in-process. Structured JSON logging covers all security-relevant events. Account
deletion (GDPR) is supported with 30-day PII erasure.

---

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js ≥ 20 LTS, CommonJS modules  
**Primary Dependencies**: Express.js, Drizzle ORM + pg, bcrypt, jose (JWT HS256), nodemailer, zod, dotenv  
**Storage**: PostgreSQL ≥ 15 (entities); in-process Map (rate-limit counters)  
**Testing**: Jest + ts-jest; Istanbul coverage (≥ 80 % lines + branches on business-logic modules)  
**Target Platform**: Linux server (single-region, single-instance)  
**Project Type**: Web service (REST API)  
**Performance Goals**: Login p95 ≤ 2 s at 500 concurrent authenticated users  
**Constraints**: Strict TypeScript — zero `tsc --noEmit` errors; JSDoc on all exports; 80 % coverage gate  
**Scale/Scope**: 500 concurrent users; single-instance; 4 PostgreSQL tables + in-process rate-limit store

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Gate | Status |
|-----------|------|--------|
| I. Clean Code | Functions do one thing; no magic literals; no dead code | ✅ PASS — service layer is pure functions; constants module planned |
| II. TypeScript Strict Mode | `"strict": true` in tsconfig; `tsc --noEmit` CI gate; no bare `any` | ✅ PASS — tsconfig confirmed in research §1; `any` banned |
| III. Testing Pyramid ≥ 80 % | Unit tests for all business-logic services; integration tests for DB + email paths; coverage gate in jest config | ✅ PASS — `coverageThreshold: { global: { lines: 80, branches: 80 } }` configured |
| IV. JSDoc Documentation | All exported symbols documented; TypeDoc CI gate | ✅ PASS — TypeDoc script in npm scripts; all public interfaces will carry JSDoc |

**Result: All gates PASS. No violations to justify.**

---

## Project Structure

### Documentation (this feature)

```text
specs/001-user-auth/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── auth-api.md      # REST endpoint contracts
└── tasks.md             # Phase 2 output (/speckit.tasks — not yet created)
```

### Source Code (repository root)

```text
src/
├── index.ts                  # Express app entry point
├── app.ts                    # App factory (createApp) — testable without starting server
├── config/
│   └── env.ts                # Zod-validated environment config
├── db/
│   ├── client.ts             # Drizzle + pg pool setup
│   └── schema.ts             # Drizzle table definitions (users, refresh_tokens, etc.)
├── middleware/
│   ├── authenticate.ts       # JWT Bearer token guard
│   ├── errorHandler.ts       # Global Express error handler
│   └── requestLogger.ts      # Structured JSON request logging
├── routes/
│   └── auth.router.ts        # Express Router — all /auth/* routes
├── controllers/
│   └── auth.controller.ts    # Route handlers (thin — delegate to services)
├── services/
│   ├── auth.service.ts       # Core business logic: register, login, logout, refresh
│   ├── password.service.ts   # bcrypt hash/verify, complexity validation
│   ├── token.service.ts      # JWT sign/verify, refresh token generation/validation
│   ├── email.service.ts      # Nodemailer send helpers
│   └── rateLimit.service.ts  # In-process rate-limit counter
├── repositories/
│   ├── user.repository.ts    # DB queries for users table
│   ├── refreshToken.repository.ts
│   ├── emailVerificationToken.repository.ts
│   └── passwordResetToken.repository.ts
├── validators/
│   └── auth.validators.ts    # Zod schemas for request bodies
├── types/
│   └── express.d.ts          # Express Request augmentation (userId, etc.)
└── utils/
    ├── crypto.ts             # crypto.randomBytes wrapper
    └── logger.ts             # Structured JSON logger

tests/
├── unit/
│   ├── password.service.test.ts
│   ├── token.service.test.ts
│   ├── rateLimit.service.test.ts
│   └── auth.validators.test.ts
├── integration/
│   ├── auth.register.test.ts
│   ├── auth.login.test.ts
│   ├── auth.refresh.test.ts
│   ├── auth.logout.test.ts
│   ├── auth.forgotPassword.test.ts
│   ├── auth.resetPassword.test.ts
│   └── auth.account.delete.test.ts
└── helpers/
    ├── db.helper.ts          # Test DB setup/teardown
    └── app.helper.ts         # Supertest app factory

docs/
└── api/                      # TypeDoc output (generated; not committed)

migrations/                   # Drizzle-kit generated SQL migrations
```

**Structure Decision**: Single-project layout (Option 1) — pure backend REST API, no frontend.
The service/repository split keeps business logic testable without a real database.

---

## Complexity Tracking

*No constitution violations identified. No entries required.*
