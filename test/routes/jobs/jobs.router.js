const request = require('supertest');
const app = require('../../../src/app');
const { StatusCodes } = require('http-status-codes');
const { seed } = require('../../../scripts/seedDb');
const { Profile, Job } = require('../../../src/model');

describe('Jobs Router', () => {
  describe('GET /jobs/unpaid', () => {
    it('returns unpaid jobs', async () => {
      const result = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', 1);

      expect(result.status).toEqual(StatusCodes.OK);
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

  describe('POST /jobs/:id/pay', () => {
    beforeEach(async () => {
      await seed();
    });

    it('pays for a job', async () => {
      const result = await request(app)
        .post('/jobs/2/pay')
        .set('profile_id', 1);

      expect(result.status).toEqual(StatusCodes.NO_CONTENT);

      const profile = await Profile.findByPk(1);
      expect(profile.balance).toBe(949);

      const job = await Job.findByPk(2);
      expect(job.paid).toBe(true);
    });
  });
});
