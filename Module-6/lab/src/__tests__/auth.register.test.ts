import request from 'supertest';
import { createApp } from '../app';

describe('POST /auth/register', () => {
  const app = createApp();

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'Password123!' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('test@example.com');
    expect(res.body.is_verified).toBe(true);
  });

  it('rejects duplicate email', async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: 'dupe@example.com', password: 'Password123!' });
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'dupe@example.com', password: 'Password123!' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already registered/i);
  });

  it('requires email and password', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: '' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Email and password are required');
  });
});
