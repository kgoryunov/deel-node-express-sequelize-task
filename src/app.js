const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { getContractsRouter } = require('./routes/contracts/contracts.router');
const { getJobsRouter } = require('./routes/jobs/jobs.router');

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);

app.use('/contracts/', getProfile, getContractsRouter());
app.use('/jobs/', getProfile, getJobsRouter());

module.exports = app;
