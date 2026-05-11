# ADR-001: Authentication Method Selection

## Status
Accepted

## Context
The project requires a secure and scalable authentication mechanism for user login, registration, and session management. Options considered include:
- Session-based authentication
- JWT (JSON Web Token) authentication
- OAuth2

## Decision
We will use JWT-based authentication for issuing access and refresh tokens. JWTs are stateless, scalable, and widely supported. Refresh tokens will be used for session renewal.

## Consequences
- Stateless authentication simplifies scaling and horizontal deployment.
- JWTs must be securely signed and validated.
- Refresh token storage and revocation must be handled securely.
