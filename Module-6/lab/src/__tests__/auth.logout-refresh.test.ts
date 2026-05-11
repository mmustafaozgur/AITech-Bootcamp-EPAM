import request from 'supertest';
import { createApp } from '../app';

describe('Logout and token refresh', () => {
  const app = createApp();

  it('logs out user', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .send();
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });

  it('refreshes token with valid token', async () => {
    const res = await request(app)
      .post('/auth/refresh-token')
      .send({ token: 'mocktoken' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBe('mocktoken-refreshed');
  });

  it('requires token for refresh', async () => {
    const res = await request(app)
      .post('/auth/refresh-token')
      .send({ });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Token is required');
  });
});
