/** Validates email format. */
export function isValidEmail(email: string): boolean {
  // RFC-5322 simplified
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates password strength:
 *  - At least 8 characters
 *  - At least one uppercase letter
 *  - At least one digit
 */
export function isValidPassword(password: string): boolean {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
}
