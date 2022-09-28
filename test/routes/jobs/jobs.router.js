const request = require('supertest');
const app = require('../../../src/app');

describe('Jobs Router', () => {
  describe('GET /jobs/unpaid', () => {
    it('returns unpaid jobs', async () => {
      const result = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', 1);

      expect(result.status).toEqual(200);
      expect(result.body).toEqual([
        {
          ContractId: 2,
          createdAt: expect.any(String),
          description: 'work',
          id: 2,
          paid: false,
          paymentDate: null,
          price: 201,
          updatedAt: expect.any(String)
        }
      ]);
    });
  });
});
