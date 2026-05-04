import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { AuthView, AuthData } from './types/auth';
import './App.css';

function Dashboard() {
  const { clearSession } = useAuth();
  return (
    <div className="auth-card">
      <h1 className="auth-title">Welcome!</h1>
      <p>You are signed in.</p>
      <button className="btn-primary" onClick={clearSession}>
        Sign Out
      </button>
    </div>
  );
}

function AuthFlow() {
  const { isAuthenticated, saveSession } = useAuth();

  // Detect ?token= in the URL for the reset-password confirm flow
  const [view, setView] = useState<AuthView>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('token') ? 'reset-confirm' : 'login';
  });

  const resetToken =
    view === 'reset-confirm'
      ? new URLSearchParams(window.location.search).get('token') ?? undefined
      : undefined;

  // Clear the token query param from the URL once consumed
  useEffect(() => {
    if (view === 'reset-confirm') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [view]);

  function handleAuthSuccess(data: AuthData) {
    saveSession(data);
  }

  if (isAuthenticated) return <Dashboard />;

  return (
    <main className="auth-root">
      {view === 'login' && (
        <LoginForm
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={() => setView('register')}
          onSwitchToReset={() => setView('reset-request')}
        />
      )}
      {view === 'register' && (
        <RegisterForm
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setView('login')}
        />
      )}
      {view === 'reset-request' && (
        <ResetPasswordForm
          onSuccess={() => setView('login')}
          onSwitchToLogin={() => setView('login')}
        />
      )}
      {view === 'reset-confirm' && (
        <ResetPasswordForm
          resetToken={resetToken}
          onSuccess={() => setView('login')}
          onSwitchToLogin={() => setView('login')}
        />
      )}
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthFlow />
    </AuthProvider>
  );
}
