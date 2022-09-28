const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const app = require('../../../src/app');

describe('Admin Router', () => {
  describe('GET /admin/best-profession?start=<date>&end=<date>', () => {
    it('returns best professions', async () => {
      const result = await request(app)
        .get('/admin/best-profession?start=2020-08-10&end=2022-09-29')
        .set('profile_id', 1);

      expect(result.status).toEqual(StatusCodes.OK);
      expect(result.body).toEqual([
        {
          profession: 'Programmer',
          total: 2884
        },
        {
          profession: 'Musician',
          total: 221
        },
        {
          profession: 'Fighter',
          total: 200
        }
      ]);
    });
  });

  describe('GET /admin/best-clients?start=<date>&end=<date>', () => {
    it('returns best clients', async () => {
      const result = await request(app)
        .get('/admin/best-clients?start=2020-08-10&end=2022-09-29')
        .set('profile_id', 1);

      expect(result.status).toEqual(StatusCodes.OK);
      expect(result.body).toEqual([
        {
          fullName: 'Ash Kethcum',
          id: 4,
          paid: 2020
        },
        {
          fullName: 'Harry Potter',
          id: 1,
          paid: 643
        }
      ]);
    });
  });
});
