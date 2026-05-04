// Shared auth types matching the API response contract

export interface AuthData {
  token: string;
  expiresIn: number;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthResponse {
  success: boolean;
  data?: AuthData & { message?: string };
  error?: AuthError;
}

export type AuthView = 'login' | 'register' | 'reset-request' | 'reset-confirm';
