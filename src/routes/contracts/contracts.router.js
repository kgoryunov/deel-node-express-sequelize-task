const express = require('express');
const { ContractsHandler } = require('./contracts.handler');

function getContractsRouter() {
  const router = express.Router();
  const handler = new ContractsHandler();

  router.get('/:id', handler.getContractById);

  return router;
}

module.exports = { getContractsRouter };
