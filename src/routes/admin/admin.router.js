const express = require('express');
const { AdminHandler } = require('./admin.handler');
const { query } = require('express-validator');
const { validateRequest } = require('../../middleware/validateRequest');

function getAdminRouter() {
  const router = express.Router();
  const handler = new AdminHandler();

  router.get(
    '/best-profession',
    query(['start', 'end']).isISO8601().toDate(),
    validateRequest,
    handler.getBestProfession
  );
  router.get(
    '/best-clients',
    query(['start', 'end']).isISO8601().toDate(),
    query('limit').default(2).isInt({ min: 1 }),
    validateRequest,
    handler.getBestClients
  );

  return router;
}

module.exports = { getAdminRouter };
