import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AuthData } from '../types/auth';

const TOKEN_KEY = 'auth_token';
const EXPIRES_KEY = 'auth_expires_at';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  saveSession: (data: AuthData) => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const expiresAt = Number(sessionStorage.getItem(EXPIRES_KEY) ?? '0');
    if (token && Date.now() < expiresAt) {
      return { token, isAuthenticated: true };
    }
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRES_KEY);
    return { token: null, isAuthenticated: false };
  });

  const saveSession = useCallback((data: AuthData) => {
    const expiresAt = Date.now() + data.expiresIn * 1000;
    sessionStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(EXPIRES_KEY, String(expiresAt));
    setState({ token: data.token, isAuthenticated: true });
  }, []);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRES_KEY);
    setState({ token: null, isAuthenticated: false });
  }, []);

  // Auto-logout when the token expires
  useEffect(() => {
    if (!state.isAuthenticated) return;
    const expiresAt = Number(sessionStorage.getItem(EXPIRES_KEY) ?? '0');
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) { clearSession(); return; }
    const timer = setTimeout(clearSession, remaining);
    return () => clearTimeout(timer);
  }, [state.isAuthenticated, clearSession]);

  return (
    <AuthContext.Provider value={{ ...state, saveSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
