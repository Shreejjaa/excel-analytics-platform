const request = require('supertest');
const app = require('../index'); // or wherever your Express app is exported

describe('Auth', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: "test@example.com", password: "test123" });
    expect(res.statusCode).toBe(201);
  });
});
