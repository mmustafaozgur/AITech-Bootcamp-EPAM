import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister, onForgotPassword }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Sign In</h2>
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
        autoComplete="current-password"
        style={inputStyle}
      />

      <button type="submit" disabled={loading} style={btnStyle}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <button type="button" onClick={onForgotPassword} style={linkStyle}>
          Forgot password?
        </button>
        <button type="button" onClick={onSwitchToRegister} style={linkStyle}>
          Create account
        </button>
      </div>
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
