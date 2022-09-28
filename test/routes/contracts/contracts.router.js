const request = require('supertest');
const app = require('../../../src/app');

describe('GET /contracts/:id', () => {
  it('returns contract', async () => {
    const result = await request(app).get('/contracts/1').set('profile_id', 1);

    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      ClientId: 1,
      ContractorId: 5,
      createdAt: expect.any(String),
      id: 1,
      status: 'terminated',
      terms: 'bla bla bla',
      updatedAt: expect.any(String)
    });
  });

  it('returns 401 for unauthorized request', async () => {
    const result = await request(app).get('/contracts/1');

    expect(result.status).toEqual(401);
  });

  it('returns 404 for non-existing contract', async () => {
    const result = await request(app)
      .get('/contracts/1001')
      .set('profile_id', 1);

    expect(result.status).toEqual(404);
  });

  it("returns 404 if contract doesn't belong to authorized user", async () => {
    const result = await request(app).get('/contracts/7').set('profile_id', 1);

    expect(result.status).toEqual(404);
  });
});
