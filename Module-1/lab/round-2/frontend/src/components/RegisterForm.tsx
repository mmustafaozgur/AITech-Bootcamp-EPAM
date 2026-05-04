import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

const PASSWORD_RE = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

interface Props {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSuccess, onSwitchToLogin }: Props) {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      await register(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Create Account</h2>
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

      <label>Password</label>
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

      <button type="submit" disabled={loading} style={btnStyle}>
        {loading ? 'Creating account…' : 'Register'}
      </button>

      <button type="button" onClick={onSwitchToLogin} style={{ ...linkStyle, marginTop: 8 }}>
        Already have an account? Sign in
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
