import React, { useState } from 'react';
import { authService } from '../services/authService';

interface Props {
  /** Present when arriving via a reset link (e.g. ?token=…) */
  resetToken?: string;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.';
  return null;
}

export function ResetPasswordForm({ resetToken, onSuccess, onSwitchToLogin }: Props) {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isConfirmMode = Boolean(resetToken);

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const result = await authService.requestPasswordReset(email);
    setLoading(false);

    if (result.success) {
      setInfo(
        result.data?.message ??
          'If that email is registered, you will receive a reset link shortly.'
      );
    } else {
      setError(result.error?.message ?? 'Request failed.');
    }
  }

  async function handleConfirmReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const pwError = validatePassword(newPassword);
    if (pwError) { setError(pwError); return; }
    if (newPassword !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const result = await authService.confirmPasswordReset(resetToken!, newPassword);
    setLoading(false);

    if (result.success) {
      setInfo('Password reset successfully. You can now sign in.');
      setTimeout(onSuccess, 2000);
    } else {
      setError(result.error?.message ?? 'Reset failed.');
    }
  }

  if (isConfirmMode) {
    return (
      <div className="auth-card">
        <h1 className="auth-title">Set New Password</h1>
        <form onSubmit={handleConfirmReset} noValidate>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
            <small className="hint">Min 8 chars · 1 uppercase · 1 number</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-new-password">Confirm Password</label>
            <input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}
          {info  && <p className="auth-info"  role="status">{info}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Reset Password</h1>
      <p className="auth-subtitle">
        Enter your email address and we'll send you a reset link.
      </p>
      <form onSubmit={handleRequestReset} noValidate>
        <div className="form-group">
          <label htmlFor="reset-email">Email</label>
          <input
            id="reset-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}
        {info  && <p className="auth-info"  role="status">{info}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>
      </form>

      <div className="auth-links">
        <button className="link-btn" onClick={onSwitchToLogin}>
          Back to Sign In
        </button>
      </div>
    </div>
  );
}
