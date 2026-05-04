import { AuthResponse } from '../types/auth';

const API_BASE = '/api/auth';

async function request(path: string, body: object): Promise<AuthResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: 'Connection failed. Please try again.' },
    };
  }

  const json = (await response.json()) as AuthResponse;
  return json;
}

export const authService = {
  register: (email: string, password: string) =>
    request('/register', { email, password }),

  login: (email: string, password: string) =>
    request('/login', { email, password }),

  requestPasswordReset: (email: string) =>
    request('/reset-password', { email }),

  confirmPasswordReset: (token: string, newPassword: string) =>
    request('/reset-password', { token, newPassword }),
};
