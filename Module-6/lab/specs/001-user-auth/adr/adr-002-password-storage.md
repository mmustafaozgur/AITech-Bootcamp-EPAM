# ADR-002: Password Storage Strategy

## Status
Accepted

## Context
User passwords must be stored securely to prevent credential theft in case of a data breach. Options considered:
- Plaintext (unacceptable)
- Simple hashing (e.g., SHA256)
- Salted and iterated hashing (bcrypt, Argon2)

## Decision
Passwords will be stored using bcrypt with a strong work factor. Each password will be salted uniquely.

## Consequences
- Passwords are resilient to brute-force and rainbow table attacks.
- The system must manage bcrypt configuration and upgrades as best practices evolve.
