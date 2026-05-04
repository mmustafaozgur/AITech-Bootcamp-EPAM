import React, { useState } from 'react';
import { authService } from '../services/authService';
import { AuthData } from '../types/auth';

interface Props {
  onSuccess: (data: AuthData) => void;
  onSwitchToRegister: () => void;
  onSwitchToReset: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister, onSwitchToReset }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await authService.login(email, password);
    setLoading(false);

    if (result.success && result.data?.token) {
      onSuccess({ token: result.data.token, expiresIn: result.data.expiresIn });
    } else {
      setError(result.error?.message ?? 'Login failed.');
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Sign In</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div className="auth-links">
        <button className="link-btn" onClick={onSwitchToReset}>
          Forgot password?
        </button>
        <button className="link-btn" onClick={onSwitchToRegister}>
          Create account
        </button>
      </div>
    </div>
  );
}
