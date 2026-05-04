import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';

type View = 'login' | 'register' | 'forgot' | 'reset';

export default function App() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');

  const [view, setView] = useState<View>(resetToken ? 'reset' : 'login');

  if (user) {
    return (
      <div style={centerStyle}>
        <div style={cardStyle}>
          <h2>Welcome</h2>
          <p>Signed in as <strong>{user.email}</strong></p>
          <button onClick={logout} style={btnStyle}>Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div style={centerStyle}>
      {view === 'login' && (
        <LoginForm
          onSuccess={() => { /* user state updates via context */ }}
          onSwitchToRegister={() => setView('register')}
          onForgotPassword={() => setView('forgot')}
        />
      )}
      {view === 'register' && (
        <RegisterForm
          onSuccess={() => { /* user state updates via context */ }}
          onSwitchToLogin={() => setView('login')}
        />
      )}
      {view === 'forgot' && (
        <ForgotPasswordForm onSwitchToLogin={() => setView('login')} />
      )}
      {view === 'reset' && resetToken && (
        <ResetPasswordForm token={resetToken} onSuccess={() => setView('login')} />
      )}
      {view === 'reset' && !resetToken && (
        <div style={{ textAlign: 'center' }}>
          <p>Invalid reset link.</p>
          <button onClick={() => setView('login')} style={btnStyle}>Back to Sign In</button>
        </div>
      )}
    </div>
  );
}

const centerStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#f8fafc',
};
const cardStyle: React.CSSProperties = {
  padding: 32, border: '1px solid #ddd', borderRadius: 8,
  background: '#fff', textAlign: 'center', minWidth: 280,
};
const btnStyle: React.CSSProperties = {
  padding: '10px 24px', background: '#2563eb', color: '#fff',
  border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 15,
};
