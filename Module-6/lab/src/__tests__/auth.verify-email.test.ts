import request from 'supertest';
import { createApp } from '../app';
import { registerUser, generateEmailVerificationToken, getUserByEmail } from '../services/userService';

describe('POST /auth/verify-email', () => {
  const app = createApp();
  const email = 'verifyme@example.com';
  const password = 'Password123!';

  beforeAll(async () => {
    await registerUser(email, password);
  });

  it('verifies email with valid token', async () => {
    const token = generateEmailVerificationToken(email);
    const res = await request(app)
      .post('/auth/verify-email')
      .send({ token });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Email verified');
    const user = getUserByEmail(email);
    expect(user?.is_verified).toBe(true);
  });

  it('rejects invalid token', async () => {
    const res = await request(app)
      .post('/auth/verify-email')
      .send({ token: 'badtoken' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid or expired token');
  });

  it('requires token', async () => {
    const res = await request(app)
      .post('/auth/verify-email')
      .send({ });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Token is required');
  });
});
