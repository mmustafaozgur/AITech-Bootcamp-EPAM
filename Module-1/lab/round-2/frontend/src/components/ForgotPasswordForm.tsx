import { useState, FormEvent } from 'react';
import { authService } from '../services/authService';

interface Props {
  onSwitchToLogin?: () => void;
}

export function ForgotPasswordForm({ onSwitchToLogin }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus('loading');
    try {
      await authService.forgotPassword(email);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <div style={formStyle}>
        <h2>Check Your Email</h2>
        <p>If <strong>{email}</strong> is registered, you will receive a password reset link shortly.</p>
        <button type="button" onClick={onSwitchToLogin} style={btnStyle}>Back to Sign In</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Forgot Password</h2>
      <p style={{ color: '#555', fontSize: 14 }}>Enter your email and we will send you a reset link.</p>
      {error && <p style={errorStyle}>{error}</p>}

      <label>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        style={inputStyle}
      />

      <button type="submit" disabled={status === 'loading'} style={btnStyle}>
        {status === 'loading' ? 'Sending…' : 'Send Reset Link'}
      </button>

      <button type="button" onClick={onSwitchToLogin} style={{ ...linkStyle, marginTop: 8 }}>
        Back to Sign In
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
const linkStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 13,
};
const errorStyle: React.CSSProperties = { color: '#dc2626', fontSize: 13 };
