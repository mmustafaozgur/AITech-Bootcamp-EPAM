import { useState, FormEvent } from 'react';
import { authService } from '../services/authService';

const PASSWORD_RE = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

interface Props {
  token: string;
  onSuccess?: () => void;
}

export function ResetPasswordForm({ token, onSuccess }: Props) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!PASSWORD_RE.test(password)) {
      setError('Password must be at least 8 characters with 1 uppercase letter and 1 number.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setStatus('loading');
    try {
      await authService.resetPassword(token, password);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <div style={formStyle}>
        <h2>Password Reset</h2>
        <p>Your password has been updated successfully.</p>
        <button type="button" onClick={onSuccess} style={btnStyle}>Go to Sign In</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Reset Password</h2>
      {error && <p style={errorStyle}>{error}</p>}

      <label>New Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
        style={inputStyle}
      />
      <small style={{ color: '#666' }}>Min 8 chars, 1 uppercase, 1 number</small>

      <label>Confirm Password</label>
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        autoComplete="new-password"
        style={inputStyle}
      />

      <button type="submit" disabled={status === 'loading'} style={btnStyle}>
        {status === 'loading' ? 'Resetting…' : 'Reset Password'}
      </button>
    </form>
  );
}

const formStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 8,
  maxWidth: 360, margin: '0 auto', padding: 24,
  border: '1px solid #ddd', borderRadius: 8,
};
const inputStyle: React.CSSProperties = {
  padding: '8px 10px', borderRadius: 4, border: '1px solid #ccc', fontSize: 14,
};
const btnStyle: React.CSSProperties = {
  padding: '10px 0', background: '#2563eb', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 15,
};
const errorStyle: React.CSSProperties = { color: '#dc2626', fontSize: 13 };
