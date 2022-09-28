const express = require('express');
const { StatusCodes } = require('http-status-codes');

function getBalancesRouter() {
  const router = express.Router();

  router.get('/deposit/:userId', async (req, res) => {
    // TODO: I skipped the implementation as I need to clarify the requirement on who deposits what
    // > Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
    res.status(StatusCodes.NOT_IMPLEMENTED).end();
  });

  return router;
}

module.exports = { getBalancesRouter };
