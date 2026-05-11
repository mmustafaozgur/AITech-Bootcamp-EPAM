# ADR-003: Email Verification Requirement

## Status
Accepted

## Context
To ensure account ownership and reduce fraud, new users must verify their email address before accessing protected features. Options considered:
- No verification (open registration)
- Email verification with a unique link

## Decision
All new accounts require email verification via a unique, time-limited link sent to the user's email address.

## Consequences
- Reduces fake or spam account creation.
- Adds a step to onboarding, but improves security and trust.
