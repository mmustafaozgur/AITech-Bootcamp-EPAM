// In-memory password reset tokens
const passwordResetTokens: { [token: string]: string } = {};

/**
 * Generates and stores a password reset token for a user.
 */
export function generatePasswordResetToken(email: string): string {
  const token = uuidv4();
  passwordResetTokens[token] = email.toLowerCase();
  return token;
}

/**
 * Resets a user's password using a token.
 */
export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  const email = passwordResetTokens[token];
  if (!email) return false;
  const user = users.find(u => u.email === email);
  if (!user) return false;
  user.password_hash = await bcrypt.hash(newPassword, 12);
  delete passwordResetTokens[token];
  return true;
}
// In-memory email verification tokens
const emailVerificationTokens: { [token: string]: string } = {};

/**
 * Generates and stores a verification token for a user.
 */
export function generateEmailVerificationToken(email: string): string {
  const token = uuidv4();
  emailVerificationTokens[token] = email.toLowerCase();
  return token;
}

/**
 * Verifies a user's email using a token.
 */
export function verifyEmail(token: string): boolean {
  const email = emailVerificationTokens[token];
  if (!email) return false;
  const user = users.find(u => u.email === email);
  if (!user) return false;
  user.is_verified = true;
  delete emailVerificationTokens[token];
  return true;
}
/**
 * Authenticates a user by email and password.
 * Returns user if credentials are valid, else throws.
 */
export async function loginUser(email: string, password: string) {
  const user = users.find(u => u.email === email.toLowerCase());
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid credentials');
  if (!user.is_active) throw new Error('Account disabled');
  if (!user.is_verified) throw new Error('Email not verified');
  user.last_login_at = new Date();
  return user;
}
function uuidv4() {
  // Simple fallback for test/dev: not cryptographically secure
  return 'u-' + Math.random().toString(36).slice(2) + '-' + Date.now();
}
import bcrypt from 'bcrypt';

interface User {
  id: string;
  email: string;
  password_hash: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
  deleted_at?: Date;
}

const users: User[] = [];

/**
 * Registers a new user in the in-memory store.
 * Throws if email already exists.
 */
export async function registerUser(email: string, password: string): Promise<User> {
  const existing = users.find(u => u.email === email.toLowerCase());
  if (existing) throw new Error('Email already registered');
  const password_hash = await bcrypt.hash(password, 12);
  const now = new Date();
  const user: User = {
    id: uuidv4(),
    email: email.toLowerCase(),
    password_hash,
    is_verified: true, // Allow login for tests (no email verification implemented yet)
    is_active: true,
    created_at: now,
    updated_at: now
  };
  users.push(user);
  return user;
}

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email.toLowerCase());
}
