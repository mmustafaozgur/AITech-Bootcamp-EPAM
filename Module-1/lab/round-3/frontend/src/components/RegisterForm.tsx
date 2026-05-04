import React, { useState } from 'react';
import { authService } from '../services/authService';
import { AuthData } from '../types/auth';

interface Props {
  onSuccess: (data: AuthData) => void;
  onSwitchToLogin: () => void;
}

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.';
  return null;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const pwError = validatePassword(password);
    if (pwError) { setError(pwError); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const result = await authService.register(email, password);
    setLoading(false);

    if (result.success && result.data?.token) {
      onSuccess({ token: result.data.token, expiresIn: result.data.expiresIn });
    } else {
      setError(result.error?.message ?? 'Registration failed.');
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Create Account</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <small className="hint">
            Min 8 chars · 1 uppercase · 1 number
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm">Confirm Password</label>
          <input
            id="reg-confirm"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <div className="auth-links">
        <button className="link-btn" onClick={onSwitchToLogin}>
          Already have an account? Sign in
        </button>
      </div>
    </div>
  );
}
