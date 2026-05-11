import request from 'supertest';
import { createApp } from '../app';
import { registerUser } from '../services/userService';

describe('Password reset flow', () => {
  const app = createApp();
  const email = 'resetme@example.com';
  const password = 'Password123!';

  beforeAll(async () => {
    await registerUser(email, password);
  });

  let resetToken: string;

  it('generates a password reset token', async () => {
    const res = await request(app)
      .post('/auth/request-password-reset')
      .send({ email });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    resetToken = res.body.token;
  });

  it('resets password with valid token', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ token: resetToken, newPassword: 'NewPass456!' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Password reset successful');
  });

  it('rejects invalid token', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ token: 'badtoken', newPassword: 'Whatever123' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Invalid or expired token');
  });

  it('requires token and newPassword', async () => {
    const res = await request(app)
      .post('/auth/reset-password')
      .send({ token: resetToken });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Token and newPassword are required');
  });
});
