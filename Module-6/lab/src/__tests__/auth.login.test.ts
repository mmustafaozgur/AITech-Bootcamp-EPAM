import request from 'supertest';
import { createApp } from '../app';
import { registerUser } from '../services/userService';

describe('POST /auth/login', () => {
  const app = createApp();
  const email = 'loginuser@example.com';
  const password = 'Password123!';

  beforeAll(async () => {
    await registerUser(email, password);
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(email);
  });

  it('rejects invalid password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email, password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid credentials/i);
  });

  it('requires email and password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email and password are required');
  });
});
