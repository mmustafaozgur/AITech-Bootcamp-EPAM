import request from 'supertest';
import { createApp } from '../app';
import { registerUser } from '../services/userService';

describe('User profile and account deletion', () => {
  const app = createApp();
  const email = 'profileuser@example.com';
  const password = 'Password123!';

  beforeAll(async () => {
    await registerUser(email, password);
  });

  it('returns user profile', async () => {
    const res = await request(app)
      .get('/auth/profile')
      .query({ email });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(email);
    expect(res.body.is_active).toBe(true);
  });

  it('deletes user account', async () => {
    const res = await request(app)
      .delete('/auth/delete-account')
      .send({ email });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Account deleted');
  });

  it('profile returns inactive after deletion', async () => {
    const res = await request(app)
      .get('/auth/profile')
      .query({ email });
    expect(res.status).toBe(200);
    expect(res.body.is_active).toBe(false);
  });

  it('returns 404 for unknown user', async () => {
    const res = await request(app)
      .get('/auth/profile')
      .query({ email: 'nouser@example.com' });
    expect(res.status).toBe(404);
  });
});
