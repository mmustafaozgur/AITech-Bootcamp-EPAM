# Feature Specification: User Authentication System

**Feature Branch**: `001-user-auth`  
**Created**: 2026-05-08  
**Status**: Draft  
**Input**: User description: "User authentication system with user registration (email/password), login with JWT tokens, password reset via email, and session management (24-hour expiry)"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — New User Registration (Priority: P1)

A new visitor provides their email address and a password to create an account.
The system validates the inputs, ensures the email is not already taken,
stores the credentials securely, and confirms registration with a verification email.

**Why this priority**: Registration is the entry gate to the system. Without it no other
authentication flow is accessible to new users, making it the foundational MVP slice.

**Independent Test**: A fresh email address and valid password can be submitted through the
registration endpoint and the system responds with a success confirmation; a second attempt
with the same email is rejected with a clear duplicate-email error.

**Acceptance Scenarios**:

1. **Given** a visitor with a valid email address and a password that meets complexity rules,
   **When** they submit the registration form,
   **Then** their account is created, a verification email is sent to the provided address,
   and they receive a confirmation response within 3 seconds.

2. **Given** a visitor who submits an email address already registered in the system,
   **When** they attempt to register,
   **Then** the system rejects the request with an informative duplicate-email error and does
   NOT create a second account or leak whether the address is active.

3. **Given** a visitor who submits a password that does not meet complexity requirements,
   **When** they attempt to register,
   **Then** the system rejects the request and lists the unmet requirements without revealing
   the existing password hashes.

4. **Given** a visitor who submits a malformed email address,
   **When** they attempt to register,
   **Then** the system rejects the request with a clear format-validation error.

---

### User Story 2 — Login and JWT Token Issuance (Priority: P1)

A registered user provides their email and password to log in.
The system validates the credentials and, on success, issues a signed JWT access token
valid for 24 hours plus an opaque refresh token.

**Why this priority**: Login is the other half of the core authentication contract.
Together with registration it represents the minimum functional surface users need.

**Independent Test**: Using credentials from a registered account, a login request returns
a JWT access token that can be decoded and verified as signed, non-expired, and containing
the correct user identity claims.

**Acceptance Scenarios**:

1. **Given** a registered user with correct credentials,
   **When** they submit a login request,
   **Then** the system returns a signed JWT access token (expiry: 24 hours) and a refresh
   token, and the response arrives within 2 seconds.

2. **Given** a registered user who submits an incorrect password,
   **When** they attempt to log in,
   **Then** the system returns a generic "invalid credentials" error without revealing
   which field is wrong, and does NOT issue any token.

3. **Given** an attacker who makes more than 5 consecutive failed login attempts for the
   same account within 15 minutes,
   **When** the sixth attempt is made,
   **Then** the account is temporarily locked and subsequent attempts are rejected with a
   rate-limit error until the lockout period expires.

4. **Given** a user whose account has not been email-verified,
   **When** they attempt to log in,
   **Then** the system rejects the login and prompts the user to verify their email.

---

### User Story 3 — Password Reset via Email (Priority: P2)

A user who has forgotten their password requests a reset link.
The system sends a time-limited, single-use reset link to their registered email.
Following the link, the user sets a new password and the old one is invalidated.

**Why this priority**: Password reset is critical for user retention and reduces support
burden. It is not blocking for the core auth MVP but must be present for production use.

**Independent Test**: A password-reset request for a registered email generates a reset
link delivered to that address; following the link allows the user to set a new password
and subsequently log in with the new credential while the old one is rejected.

**Acceptance Scenarios**:

1. **Given** a registered user who has forgotten their password,
   **When** they submit their email address to the password-reset endpoint,
   **Then** the system sends a reset link to that address within 60 seconds; the response
   to the request is always a success message regardless of whether the email is registered
   (to prevent account enumeration).

2. **Given** a user who follows a valid, unexpired reset link and submits a new password,
   **When** the reset form is submitted,
   **Then** the new password is stored, all existing sessions for that account are
   invalidated, and the user is redirected to the login page.

3. **Given** a user who attempts to use a reset link that has already been used or has
   expired (links expire after 1 hour),
   **When** they follow the link,
   **Then** the system rejects the request with a clear expiry/used error and invites the
   user to request a new link.

4. **Given** a reset link that was issued before a successful password reset,
   **When** it is submitted again after the reset,
   **Then** the system rejects it (single-use enforcement).

---

### User Story 4 — Session Management and Token Refresh (Priority: P2)

An authenticated user's JWT access token expires after 24 hours.
The system allows the user to obtain a new access token using their refresh token without
re-entering credentials, up to the point the refresh token itself expires (after 7 days) or is revoked.

**Why this priority**: Seamless session continuity is important for user experience but
depends on the login flow (US2) being complete.

**Independent Test**: A valid refresh token can be exchanged for a new access token; after
the refresh token is revoked (via logout), the exchange is rejected.

**Acceptance Scenarios**:

1. **Given** an authenticated user whose access token has expired,
   **When** they present their valid refresh token to the token-refresh endpoint,
   **Then** a new 24-hour access token is issued and the refresh token remains valid until
   its own 7-day lifetime expires.

2. **Given** a user who explicitly logs out,
   **When** the logout request is processed,
   **Then** the refresh token is revoked server-side, and any subsequent refresh attempt
   with that token is rejected.

3. **Given** a refresh token that has expired or been revoked,
   **When** it is presented to the refresh endpoint,
   **Then** the system rejects the request with a clear authentication error and the user
   must log in again.

---

### Edge Cases

- What happens when a user registers with an email address that differs only in letter case
  (e.g., `User@Example.com` vs `user@example.com`)? → Treated as the same address (case-insensitive).
- How does the system handle a password-reset request for an email that is not registered?
  → Always returns a success response to prevent account enumeration.
- What happens when two reset links are requested in quick succession?
  → The earlier link is invalidated; only the most recent link is valid.
- What if the JWT signing secret is rotated?
  → All tokens signed with the old secret are considered invalid; users must log in again.
- What happens when a user account is disabled by an administrator?
  → Login attempts return a generic "account unavailable" error; existing tokens are revoked.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a new user to create an account using a unique email address
  and a password that meets defined complexity rules (minimum 8 characters, at least one uppercase
  letter, one digit, and one special character).
- **FR-002**: The system MUST send an email verification link to the registered address upon
  successful account creation; unverified accounts MUST NOT be permitted to log in.
- **FR-003**: The system MUST authenticate a registered, verified user by validating their email
  and password, then issue a signed JWT access token with a 24-hour expiry.
- **FR-004**: The system MUST issue a refresh token alongside the access token at login; refresh
  tokens MUST be opaque, stored server-side, valid for 7 days, and support access-token renewal
  without requiring re-authentication within that window.
- **FR-005**: The system MUST allow a user to request a password-reset email; the reset link MUST
  be single-use, expire after 1 hour, and invalidate all existing sessions on use.
- **FR-006**: The system MUST enforce rate limiting: no more than 5 failed login attempts per
  account within any 15-minute window; exceeding this locks the account temporarily.
- **FR-007**: The system MUST provide a logout endpoint that revokes the user's refresh token and
  invalidates the current session.
- **FR-008**: The system MUST store passwords using an industry-standard adaptive hashing algorithm
  (e.g., bcrypt or Argon2); plaintext passwords MUST never be persisted or logged.
- **FR-009**: All exported functions and modules MUST be documented with JSDoc comments per the
  project constitution (Principle IV).
- **FR-010**: All TypeScript source files MUST compile under strict mode with zero type errors
  per the project constitution (Principle II).
- **FR-011**: The system MUST persist User, Session, and Password Reset Token records in a
  relational database (PostgreSQL); rate-limiting counters MUST be maintained in an in-process
  cache or Redis to ensure sub-millisecond lookup.
- **FR-012**: The system MUST emit structured JSON log entries for every security-relevant event:
  registration, login success/failure, token refresh, password-reset request, password-reset
  completion, and logout. Log entries MUST include timestamp, event type, anonymised user
  identifier, and outcome.
- **FR-013**: The system MUST support account deletion (right to erasure): all user PII MUST be
  permanently deleted or irreversibly anonymised within 30 days of a deletion request; audit-log
  records MAY be retained in fully anonymised form.

### Key Entities

- **User**: Represents a registered account. Key attributes: unique identifier, email address
  (case-insensitive unique), hashed password, verification status, account-enabled status,
  creation timestamp, last-login timestamp.
- **Session / Refresh Token**: Represents an active authenticated session. Attributes: token
  identifier, associated user identifier, issuance timestamp, expiry timestamp (7-day lifetime),
  revoked flag.
- **Password Reset Token**: Represents a single-use reset credential. Attributes: token value
  (hashed), associated user identifier, issuance timestamp, expiry timestamp, used flag.
- **Failed Login Attempt**: Audit record used for rate-limiting. Attributes: user identifier
  or email, attempt timestamp, source identifier (IP address — stored for security audit
  purposes only and subject to the system's data-retention policy).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete registration end-to-end (form submission → email received)
  in under 3 minutes under normal network conditions.
- **SC-002**: A registered user can log in and receive a token within 2 seconds of submitting
  correct credentials (p95 latency at up to 500 concurrent authenticated users).
- **SC-003**: A password-reset email is delivered to the user's inbox within 60 seconds of the
  reset request being submitted.
- **SC-004**: Business-logic modules (credential validation, token issuance, session management)
  achieve ≥ 80 % line and branch test coverage as required by the project constitution.
- **SC-005**: Zero known credential-exposure vulnerabilities pass code review; all security-related
  paths (login, registration, reset) are covered by integration tests.
- **SC-006**: The system correctly rejects 100 % of login attempts that exceed the rate-limit
  threshold in automated testing.
- **SC-007**: TypeDoc generates API documentation for all exported symbols with zero warnings.

---

## Assumptions

- Email delivery relies on an external mail service (e.g., SMTP relay or transactional email
  provider); the authentication system is not responsible for email delivery guarantees.
- A single user role exists for this phase; role-based access control (RBAC) is out of scope.
- Social/OAuth login (Google, GitHub, etc.) is out of scope for this feature.
- Multi-factor authentication (MFA/2FA) is out of scope for this feature.
- The system operates in a single-region deployment; distributed session synchronisation is
  not required for this phase.
- Password complexity rules (FR-001) are fixed at implementation time and not user-configurable.
- The 24-hour access-token expiry and 1-hour reset-link expiry are fixed; they may be made
  configurable in a future amendment.
- Account lockout (FR-006) auto-resets after the 15-minute window expires; manual admin unlock
  is considered a future enhancement.
- All source code is TypeScript under strict mode; the language choice is a project constitution
  requirement, not a feature decision.
- The primary data store for User, Session, and Password Reset Token entities is PostgreSQL;
  an in-process cache or Redis instance handles rate-limiting counters.
- Account deletion (right to erasure, FR-013) is in scope for this feature; full regulatory
  audit readiness (e.g., GDPR Article 30 records of processing) is a future enhancement.

---

## Clarifications

### Session 2026-05-08

- Q: How long should the refresh token remain valid? → A: 7 days (sliding, revoked on explicit logout or password reset)
- Q: What is the primary persistence storage medium? → A: PostgreSQL for User/Session/ResetToken entities; Redis or in-process cache for rate-limiting counters
- Q: What "expected load" baseline should SC-002 use? → A: Up to 500 concurrent authenticated users
- Q: What observability signals (logging, metrics) are required? → A: Structured JSON logging for all security-relevant auth events; no distributed tracing for this phase
- Q: Is GDPR / right-to-erasure (account deletion) in scope? → A: Yes — PII deleted or anonymised within 30 days of request; anonymised audit logs may be retained
