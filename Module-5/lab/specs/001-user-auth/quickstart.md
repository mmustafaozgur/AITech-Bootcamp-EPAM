# Quickstart: User Authentication System

**Feature**: 001-user-auth  
**Stack**: Node.js · Express.js · TypeScript (strict) · PostgreSQL · Drizzle ORM · bcrypt · jose · Jest  
**Date**: 2026-05-08

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | ≥ 20 LTS | Runtime |
| npm | ≥ 10 | Package management |
| PostgreSQL | ≥ 15 | Primary data store |
| Git | any | Source control |

---

## 1. Clone and Install

```bash
git clone <repo-url>
cd <repo>
npm install
```

---

## 2. Configure Environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

**.env.example** (minimum required):
```env
NODE_ENV=development
PORT=3000

# PostgreSQL — update with your local credentials
DATABASE_URL=postgres://postgres:postgres@localhost:5432/auth_dev

# JWT — must be at least 32 random characters
JWT_SECRET=change-me-to-a-random-32-char-secret

# bcrypt cost factor (12 recommended for production, 4-6 for tests)
BCRYPT_ROUNDS=12

# SMTP for email (use Ethereal Email or MailHog for local dev)
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=<ethereal-user>
SMTP_PASS=<ethereal-pass>

# Base URL used in email links
BASE_URL=http://localhost:3000
```

> **Dev tip**: Create a free [Ethereal Email](https://ethereal.email/create) account in 10 seconds
> for a catch-all SMTP inbox — no real emails are delivered.

---

## 3. Set Up the Database

Create the database and run migrations:

```bash
# Create the database (run once)
createdb auth_dev

# Push schema to database
npx drizzle-kit push
```

---

## 4. Start Development Server

```bash
npm run dev
```

The server starts on `http://localhost:3000`. Hot-reload is provided by `ts-node-dev`.

---

## 5. Verify the Setup

Register a user:

```bash
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"P@ssw0rd!"}' | jq
```

Expected response:
```json
{ "message": "Registration successful. Please verify your email." }
```

---

## 6. Run Tests

```bash
# Run all tests
npm test

# Run with coverage (must stay ≥ 80% on business-logic modules)
npm run test:coverage

# Run a single test file
npx jest src/services/auth.service.test.ts
```

---

## 7. Type-Check (CI gate)

```bash
npm run type-check
# → runs: tsc --noEmit
# Must exit 0 before any merge.
```

---

## 8. Generate API Documentation

```bash
npm run docs
# → runs: typedoc --out docs/api src/
# Builds to docs/api/index.html
# Must complete with zero warnings.
```

---

## npm Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `ts-node-dev --respawn src/index.ts` | Hot-reload dev server |
| `build` | `tsc` | Compile TypeScript → `dist/` |
| `start` | `node dist/index.js` | Run compiled production build |
| `test` | `jest` | Run all tests |
| `test:coverage` | `jest --coverage` | Tests + coverage report |
| `type-check` | `tsc --noEmit` | Type-check without emitting |
| `migrate` | `drizzle-kit push` | Apply schema changes to DB |
| `docs` | `typedoc --out docs/api src/` | Generate JSDoc API docs |
| `lint` | `eslint src/**/*.ts` | Lint source files |

---

## Common Issues

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `Error: connect ECONNREFUSED` | PostgreSQL not running | `brew services start postgresql` or `sudo systemctl start postgresql` |
| `Error: Invalid environment variables` | Missing `.env` key | Run `cat .env.example` and add missing keys to `.env` |
| `tsc` type errors on `bcrypt` | Missing `@types/bcrypt` | `npm install --save-dev @types/bcrypt` |
| Coverage below 80% | Business-logic not tested | Add unit tests in `src/services/*.test.ts` |
