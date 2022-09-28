const express = require('express');
const { JobsHandler } = require('./jobs.handler');

function getJobsRouter() {
  const router = express.Router();
  const handler = new JobsHandler();

  router.get('/unpaid', handler.getUnpaidJobs);
  router.post('/:id/pay', handler.payForJob);

  return router;
}

module.exports = { getJobsRouter };
