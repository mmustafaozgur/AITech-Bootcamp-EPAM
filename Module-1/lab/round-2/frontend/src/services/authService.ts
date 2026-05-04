const BASE = '/api/auth';

async function request<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data: unknown = await res.json();
  if (!res.ok) {
    const msg =
      data && typeof data === 'object' && 'message' in data
        ? (data as { message: string }).message
        : 'Request failed';
    throw new Error(msg);
  }
  return data as T;
}

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export const authService = {
  register: (email: string, password: string) =>
    request<AuthResponse>('/register', { email, password }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/login', { email, password }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/reset-password', { token, password }),
};
