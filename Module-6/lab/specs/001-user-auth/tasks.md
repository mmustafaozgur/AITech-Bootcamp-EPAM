---
description: "Task list for User Authentication System implementation"
---

# Tasks: User Authentication System

**Input**: Design documents from `specs/001-user-auth/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/auth-api.md ✅ · quickstart.md ✅

**Tests**: Unit tests for all business-logic services; integration tests for all HTTP endpoints.
Coverage gate: ≥ 80 % lines + branches on business-logic modules (enforced in jest config).

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: User story label (US1–US4 from spec.md)
- Exact file paths included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialisation, tooling, and foundational configuration.
No user story can begin until this phase is complete.

- [x] T001 Initialise Node.js project: `npm init -y`, create `package.json` with "type": "commonjs" and all production + dev dependencies (`express`, `drizzle-orm`, `pg`, `bcrypt`, `jose`, `nodemailer`, `zod`, `dotenv`, `@types/express`, `@types/bcrypt`, `@types/node`, `@types/nodemailer`, `typescript`, `ts-node-dev`, `jest`, `ts-jest`, `@types/jest`, `supertest`, `@types/supertest`, `drizzle-kit`, `typedoc`, `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`)
- [x] T002 [P] Create `tsconfig.json` with `strict: true`, `target: ES2020`, `module: CommonJS`, `moduleResolution: node`, `outDir: dist`, `rootDir: src`, `esModuleInterop`: true, `sourceMap`: true, `resolveJsonModule`: true, `skipLibCheck`: true
- [x] T003 [P] Create `jest.config.ts` with `preset: ts-jest`, `testEnvironment: node`, `testMatch: ['**/*.test.ts']`, `collectCoverageFrom: ['src/**/*.ts', '!src/index.ts', '!src/**/*.d.ts']`, `coverageThreshold: { global: { lines: 80, branches: 80 } }`, path alias `@/ → src/`
- [x] T004 [P] Create `.env.example` with all required variables: `NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `BCRYPT_ROUNDS`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `BASE_URL`
- [x] T005 [P] Add npm scripts to `package.json`: `dev` (ts-node-dev), `build` (tsc), `start` (node dist/index.js), `test` (jest), `test:coverage` (jest --coverage), `type-check` (tsc --noEmit), `migrate` (drizzle-kit push), `docs` (typedoc --out docs/api src/), `lint` (eslint src)
- [x] T007 [P] Create `.eslintrc.json` with `@typescript-eslint` recommended rules, `no-explicit-any: error`, `strict-boolean-expressions`, parser set to `@typescript-eslint/parser`
- [x] T008 [P] Create `.gitignore` covering `node_modules/`, `dist/`, `.env`, `docs/api/`, `coverage/`
- [x] T009 Create `src/config/env.ts` — zod schema parsing all `.env` variables; exports typed `env` object; crashes at startup on missing/invalid values; JSDoc on all exports
- [x] T012 [P] Create `src/utils/logger.ts` — structured JSON logger (uses `JSON.stringify`); exports `log(level, event, meta)` and convenience `logger.info / warn / error`; JSDoc on all exports
- [x] T013 [P] Create `src/utils/crypto.ts` — exports `generateSecureToken(): string` (32-byte hex via `crypto.randomBytes`) and `hashToken(token: string): string` (SHA-256 hex); JSDoc on exports
- [x] T014 Create `src/middleware/errorHandler.ts` — Express error-handling middleware; maps known error types to HTTP status codes; logs via `logger`; never leaks stack traces in production; JSDoc
- [x] T015 [P] Create `src/middleware/requestLogger.ts` — logs method, path, status, duration as structured JSON on every response; JSDoc
- [x] T016 Create `src/app.ts` — `createApp()` factory; registers JSON body parser, `requestLogger`, all routers, `errorHandler`; does NOT call `listen`; JSDoc
- [x] T017 Create `src/index.ts` — calls `createApp()`, starts server on `env.PORT`, logs startup; imports `env` first to trigger validation
- [x] T018 [P] Create `src/types/express.d.ts` — augments `Express.Request` with `userId?: string` and `userEmail?: string`
- [x] T020 [P] [US1] Create `src/validators/auth.validators.ts` — zod schemas: `RegisterSchema` (email RFC 5322, password complexity: ≥8 chars, ≥1 upper, ≥1 digit, ≥1 special, max 72 bytes), `VerifyEmailSchema` (token string); export inferred TypeScript types; JSDoc
- [x] T027 [P] [US1] Create `tests/unit/password.service.test.ts` — test `hashPassword` (returns bcrypt string, different hash each call) and `verifyPassword` (correct/incorrect/empty)
- [x] T041 [US2] Create `tests/integration/auth.login.test.ts` — valid login → 200 + tokens, wrong password → 401, unverified account → 401, inactive account → 401, 6th failed attempt → 403 with `retryAfterSeconds`, successful login clears lockout
- [x] T046 [US3] Create `tests/integration/auth.forgotPassword.test.ts` — registered email → 200 (email sent), unregistered email → 200 (no leak), second request invalidates first token
- [x] T047 [US3] Create `tests/integration/auth.resetPassword.test.ts` — valid token + valid password → 200, old refresh tokens revoked, expired token → 400, used token → 400, weak password → 422
- [x] T051 [US4] Create `tests/integration/auth.refresh.test.ts` — valid refresh token → 200 + new `accessToken`, expired token → 401, revoked token → 401, non-existent token → 401
- [x] T052 [US4] Create `tests/integration/auth.logout.test.ts` — authenticated logout → 200, subsequent refresh rejected → 401, unauthenticated request → 401
- [x] T056 [US4] Create `tests/integration/auth.account.delete.test.ts` — valid password → 200, sessions revoked, subsequent login → 401; wrong password → 401; unauthenticated → 401

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure all user stories depend on — DB schema, env config, logger,
error handler, app factory, and crypto utilities.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T009 Create `src/config/env.ts` — zod schema parsing all `.env` variables; exports typed `env` object; crashes at startup on missing/invalid values; JSDoc on all exports
- [ ] T010 [P] Create `src/db/schema.ts` — Drizzle table definitions for `users`, `refresh_tokens`, `email_verification_tokens`, `password_reset_tokens` exactly matching data-model.md; JSDoc on every table and column export
- [ ] T011 Create `src/db/client.ts` — `pg` Pool using `env.DATABASE_URL`; Drizzle instance exported as `db`; graceful shutdown hook; JSDoc on exports
- [ ] T012 [P] Create `src/utils/logger.ts` — structured JSON logger (uses `JSON.stringify`); exports `log(level, event, meta)` and convenience `logger.info / warn / error`; JSDoc on all exports
- [ ] T013 [P] Create `src/utils/crypto.ts` — exports `generateSecureToken(): string` (32-byte hex via `crypto.randomBytes`) and `hashToken(token: string): string` (SHA-256 hex); JSDoc on exports
- [ ] T014 Create `src/middleware/errorHandler.ts` — Express error-handling middleware; maps known error types to HTTP status codes; logs via `logger`; never leaks stack traces in production; JSDoc
- [ ] T015 [P] Create `src/middleware/requestLogger.ts` — logs method, path, status, duration as structured JSON on every response; JSDoc
- [ ] T016 Create `src/app.ts` — `createApp()` factory; registers JSON body parser, `requestLogger`, all routers, `errorHandler`; does NOT call `listen`; JSDoc
- [ ] T017 Create `src/index.ts` — calls `createApp()`, starts server on `env.PORT`, logs startup; imports `env` first to trigger validation
- [ ] T018 [P] Create `src/types/express.d.ts` — augments `Express.Request` with `userId?: string` and `userEmail?: string`
- [ ] T019 Run `npm run migrate` to push schema to local PostgreSQL and verify tables are created

**Checkpoint**: `npm run type-check` exits 0 · `npm run dev` starts without errors · tables visible in DB

---

## Phase 3: User Story 1 — New User Registration (Priority: P1) 🎯 MVP

**Goal**: A visitor can register with email + password, receive a verification email,
and be rejected on duplicate email or invalid inputs.

**Independent Test**: `POST /auth/register` with valid data → 201; same email again → 409;
bad password → 422; `POST /auth/verify-email` with valid token → 200.

### Validators

- [x] T020 [P] [US1] Create `src/validators/auth.validators.ts` — zod schemas: `RegisterSchema` (email RFC 5322, password complexity: ≥8 chars, ≥1 upper, ≥1 digit, ≥1 special, max 72 bytes), `VerifyEmailSchema` (token string); export inferred TypeScript types; JSDoc

### Unit Tests — Validators

- [x] T021 [P] [US1] Create `tests/unit/auth.validators.test.ts` — unit tests for `RegisterSchema`: valid input, duplicate-field rejection, each password rule independently, email case normalisation, 73-byte password rejection

### Services

- [x] T022 [P] [US1] Create `src/services/password.service.ts` — exports `hashPassword(plain: string): Promise<string>` (bcrypt cost from `env.BCRYPT_ROUNDS`) and `verifyPassword(plain: string, hash: string): Promise<boolean>`; JSDoc with `@throws`
- [x] T023 [US1] Create `src/repositories/user.repository.ts` — Drizzle queries: `createUser`, `findUserByEmail`, `findUserById`, `updateUserVerified`, `updateLastLogin`, `softDeleteUser`; email normalised to lowercase before all operations; JSDoc
- [x] T024 [US1] Create `src/repositories/emailVerificationToken.repository.ts` — `createToken`, `findActiveToken`, `markTokenUsed`, `invalidatePreviousTokens`; JSDoc
- [x] T025 [US1] Create `src/services/email.service.ts` — nodemailer transporter from env; exports `sendVerificationEmail(to: string, token: string): Promise<void>` and `sendPasswordResetEmail(to: string, token: string): Promise<void>`; link built from `env.BASE_URL`; JSDoc
- [x] T026 [US1] Create `src/services/auth.service.ts` (registration slice) — `registerUser(email, password)`: validate uniqueness, hash password, insert user, generate + store verification token (hashed), send email; `verifyEmail(token)`: lookup hash, check expiry + used, mark used, set `is_verified = true`; JSDoc with `@throws`

### Unit Tests — Services

- [x] T027 [P] [US1] Create `tests/unit/password.service.test.ts` — test `hashPassword` (returns bcrypt string, different hash each call) and `verifyPassword` (correct/incorrect/empty)

### Integration Tests — Registration

- [x] T028 [P] [US1] Create `tests/helpers/app.helper.ts` — `buildTestApp()` returning a Supertest agent wrapping `createApp()`; JSDoc
- [x] T029 [P] [US1] Create `tests/helpers/db.helper.ts` — `resetDb()` truncates all tables in test DB; `closeDb()` ends pool; JSDoc
- [x] T030 [US1] Create `tests/integration/auth.register.test.ts` — integration tests: valid registration → 201, duplicate email → 409, invalid email → 422, weak password → 422, verify-email happy path → 200, expired token → 400, reused token → 400

### Controller + Router

- [x] T031 [US1] Create `src/controllers/auth.controller.ts` (register + verifyEmail handlers) — thin handlers: parse validated body, call service, return response; no business logic; JSDoc
- [x] T032 [US1] Create `src/routes/auth.router.ts` — register `POST /auth/register` and `POST /auth/verify-email` with zod validation middleware; mount on `createApp()`

---

## Phase 4: User Story 2 — Login and JWT Token Issuance (Priority: P1)

**Goal**: A verified registered user can log in and receive a JWT access token (24 h)
and opaque refresh token (7 days). Failed attempts are rate-limited (5 / 15 min).

**Independent Test**: `POST /auth/login` with correct creds → 200 with `accessToken` + `refreshToken`;
wrong password → 401; unverified account → 401; 6th failed attempt → 403 with `ACCOUNT_LOCKED`.

### Validators

- [x] T033 [P] [US2] Add `LoginSchema` to `src/validators/auth.validators.ts` — email + password (non-empty strings only, no complexity rules at login); JSDoc

### Services

- [x] T034 [P] [US2] Create `src/services/token.service.ts` — `signAccessToken(payload): Promise<string>` (jose HS256, 24 h), `verifyAccessToken(token): Promise<JwtPayload>`, `generateRefreshToken(): string` (calls `generateSecureToken()`); exports `JwtPayload` interface; JSDoc with `@throws`
- [x] T035 [P] [US2] Create `src/services/rateLimit.service.ts` — in-process Map; `recordFailedAttempt(email)`, `isLocked(email): boolean`, `getRemainingLockSeconds(email): number`, `clearAttempts(email)`; window 15 min, threshold 5; JSDoc
- [x] T036 [P] [US2] Create `src/repositories/refreshToken.repository.ts` — `createRefreshToken`, `findByTokenHash`, `revokeToken`, `revokeAllForUser`; JSDoc
- [x] T037 [US2] Extend `src/services/auth.service.ts` with `loginUser(email, password)` — check rate limit → find user (verified + active) → verify password → on failure record attempt → on success clear attempts, update `last_login_at`, issue access token + refresh token, store refresh token hash; JSDoc

### Unit Tests — Services

- [x] T038 [P] [US2] Create `tests/unit/token.service.test.ts` — sign/verify round-trip, expired token rejected, tampered token rejected, claims present (`sub`, `email`, `exp`)
- [x] T039 [P] [US2] Create `tests/unit/rateLimit.service.test.ts` — under threshold allowed, at threshold locked, window reset after expiry, clearAttempts resets state

### Middleware

- [x] T040 [P] [US2] Create `src/middleware/authenticate.ts` — extracts Bearer token, calls `verifyAccessToken`, attaches `req.userId` + `req.userEmail`; rejects 401 on missing/invalid token; JSDoc

### Integration Tests — Login

- [x] T041 [US2] Create `tests/integration/auth.login.test.ts` — valid login → 200 + tokens, wrong password → 401, unverified account → 401, inactive account → 401, 6th failed attempt → 403 with `retryAfterSeconds`, successful login clears lockout

### Controller + Router

- [x] T042 [US2] Add `login` and `getMe` handlers to `src/controllers/auth.controller.ts`; add `GET /auth/me` (protected by `authenticate` middleware) and `POST /auth/login` to `src/routes/auth.router.ts`

---

## Phase 5: User Story 3 — Password Reset via Email (Priority: P2)

**Goal**: A user who forgot their password can request a reset email, follow the single-use
1-hour link, set a new password, and have all existing sessions revoked.

**Independent Test**: `POST /auth/forgot-password` with any email → always 200;
`POST /auth/reset-password` with valid token + new password → 200; old sessions rejected;
expired or reused token → 400.

### Validators

- [x] T043 [P] [US3] Add `ForgotPasswordSchema` (`email` string) and `ResetPasswordSchema` (`token` string, `newPassword` with full complexity rules) to `src/validators/auth.validators.ts`; JSDoc

### Services + Repositories

- [x] T044 [P] [US3] Create `src/repositories/passwordResetToken.repository.ts` — `createToken`, `findActiveToken`, `markTokenUsed`, `invalidatePreviousTokens`; JSDoc
- [x] T045 [US3] Extend `src/services/auth.service.ts` with `forgotPassword(email)` — always resolves (no enumeration); if user found: invalidate previous tokens, generate + store (hashed) new token, send reset email; and `resetPassword(token, newPassword)` — find + validate token (expiry, used), hash new password, update user, mark token used, revoke all refresh tokens; JSDoc

### Integration Tests — Password Reset

- [x] T046 [US3] Create `tests/integration/auth.forgotPassword.test.ts` — registered email → 200 (email sent), unregistered email → 200 (no leak), second request invalidates first token
- [x] T047 [US3] Create `tests/integration/auth.resetPassword.test.ts` — valid token + valid password → 200, old refresh tokens revoked, expired token → 400, used token → 400, weak password → 422

### Controller + Router

- [x] T048 [US3] Add `forgotPassword` and `resetPassword` handlers to `src/controllers/auth.controller.ts`; register `POST /auth/forgot-password` and `POST /auth/reset-password` in `src/routes/auth.router.ts`

---

## Phase 6: User Story 4 — Session Management and Token Refresh (Priority: P2)

**Goal**: An authenticated user can exchange a valid refresh token for a new access token.
Logout revokes the refresh token. Expired/revoked tokens are rejected.

**Independent Test**: `POST /auth/refresh` with valid 7-day refresh token → 200 with new `accessToken`;
`POST /auth/logout` → 200; subsequent `POST /auth/refresh` with same token → 401.

### Validators

- [x] T049 [P] [US4] Add `RefreshTokenSchema` (`refreshToken` non-empty string) and `LogoutSchema` (`refreshToken` non-empty string) to `src/validators/auth.validators.ts`; JSDoc

### Services

- [x] T050 [US4] Extend `src/services/auth.service.ts` with `refreshSession(refreshToken)` — hash token, find record (not revoked, not expired), issue new access token; and `logout(userId, refreshToken)` — hash token, revoke matching record; JSDoc

### Integration Tests — Session Management

- [x] T051 [US4] Create `tests/integration/auth.refresh.test.ts` — valid refresh token → 200 + new `accessToken`, expired token → 401, revoked token → 401, non-existent token → 401
- [x] T052 [US4] Create `tests/integration/auth.logout.test.ts` — authenticated logout → 200, subsequent refresh rejected → 401, unauthenticated request → 401

### Controller + Router

- [x] T053 [US4] Add `refresh` and `logout` handlers to `src/controllers/auth.controller.ts`; register `POST /auth/refresh` and `POST /auth/logout` (protected) in `src/routes/auth.router.ts`

---

## Phase 7: Account Deletion (FR-013 — GDPR Right to Erasure)

**Goal**: An authenticated user can schedule their account for deletion; PII is overwritten
immediately and a hard-delete job removes the row after 30 days.

**Independent Test**: `DELETE /auth/account` with correct password → 200, all sessions revoked,
subsequent login rejected; wrong password → 401.

### Validators

- [x] T054 [P] [US4] Add `DeleteAccountSchema` (`password` non-empty string) to `src/validators/auth.validators.ts`; JSDoc

### Services

- [x] T055 [US4] Extend `src/services/auth.service.ts` with `deleteAccount(userId, password)` — verify password, revoke all refresh tokens, overwrite `email` with anonymised placeholder and `password_hash` with sentinel value, set `deleted_at = now()`; JSDoc

### Integration Tests — Account Deletion

- [x] T056 [US4] Create `tests/integration/auth.account.delete.test.ts` — valid password → 200, sessions revoked, subsequent login → 401; wrong password → 401; unauthenticated → 401

### Controller + Router

- [x] T057 [US4] Add `deleteAccount` handler to `src/controllers/auth.controller.ts`; register `DELETE /auth/account` (protected) in `src/routes/auth.router.ts`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Security hardening, observability completeness, documentation, and CI readiness.

- [x] T058 Add `helmet` middleware to `src/app.ts` for security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, etc.)
- [x] T059 [P] Emit rate-limit headers (`X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) on `POST /auth/login` responses — add to `src/services/rateLimit.service.ts` return value and `src/controllers/auth.controller.ts`
- [x] T060 [P] Audit all exported symbols in `src/` for missing JSDoc — add `@description`, `@param`, `@returns`, `@throws` where absent; run `npm run docs` and fix all TypeDoc warnings
- [x] T061 [P] Run `npm run type-check` — fix any remaining TypeScript strict-mode errors
- [x] T062 [P] Run `npm run test:coverage` — confirm all business-logic modules meet ≥ 80 % line + branch coverage; add targeted tests for any gaps
- [x] T063 [P] Run `npm run lint` — fix all ESLint errors; add inline `eslint-disable` comments with justification only where absolutely necessary
- [x] T064 [P] Create `migrations/` folder — run `npx drizzle-kit generate` to produce initial SQL migration file; commit migration alongside schema

---

## Dependencies (Story Completion Order)

```
Phase 1 (Setup)
    └── Phase 2 (Foundation)
            ├── Phase 3 (US1 — Registration) ← MVP
            │       └── Phase 4 (US2 — Login)    ← MVP
            │               ├── Phase 5 (US3 — Password Reset)
            │               └── Phase 6 (US4 — Session Management)
            │                       └── Phase 7 (US4 — Account Deletion)
            └── (all phases) → Phase 8 (Polish)
```

**MVP scope**: Phases 1–4 (Setup + Foundation + Registration + Login) deliver a fully functional,
independently testable authentication core.

---

## Parallel Execution Examples

Within each phase, tasks marked `[P]` can be executed simultaneously:

**Phase 1 (Setup)**: T002, T003, T004, T005, T006, T007, T008 all run in parallel after T001.

**Phase 2 (Foundation)**: T010, T012, T013, T015, T018 in parallel after T009; T011 after T010; T014 after T012; T016 after T014 + T015; T017 after T016.

**Phase 3 (US1)**: T020, T021 in parallel; T022, T023, T024, T025 in parallel (after T009–T018); T027 in parallel with T023; T028, T029 in parallel; T030 after T026 + T028 + T029.

**Phase 4 (US2)**: T033, T034, T035, T036, T038, T039, T040 all in parallel; T037 after T034 + T035 + T036; T041 after T037 + T040.

---

## Implementation Strategy

1. **Start with MVP** (Phases 1–4): delivers a working register + login flow independently testable.
2. **Add password reset** (Phase 5): self-contained slice with its own integration tests.
3. **Add session management + deletion** (Phases 6–7): builds on the token infrastructure from Phase 4.
4. **Polish last** (Phase 8): run all quality gates once all features are complete.

Each phase produces a commit that leaves the codebase in a green, type-checking, passing-tests state.
