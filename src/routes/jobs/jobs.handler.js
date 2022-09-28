const currency = require('currency.js');
const { StatusCodes } = require('http-status-codes');
const { Transaction } = require('sequelize');

class JobsHandler {
  async getUnpaidJobs(req, res) {
    const unpaidJobs = await req.profile.getUnpaidJobs();
    res.json(unpaidJobs);
  }

  async payForJob(req, res) {
    if (req.profile.type !== 'client')
      return res.status(StatusCodes.FORBIDDEN).end();
    const sequelize = req.app.get('sequelize');
    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
      async (transaction) => {
        const { id } = req.params;
        const unpaidJob = (
          await req.profile.getUnpaidJobs({ where: { id }, transaction })
        )[0];
        if (!unpaidJob) return res.status(StatusCodes.NOT_FOUND).end();

        await req.profile.reload({ transaction });
        const newBalance = currency(req.profile.balance).subtract(
          unpaidJob.price
        );
        if (newBalance < 0) return res.status(StatusCodes.BAD_REQUEST).end();

        req.profile.balance = newBalance;
        await req.profile.save({ transaction });
        unpaidJob.paid = true;
        unpaidJob.paymentDate = new Date();
        await unpaidJob.save({ transaction });
      }
    );
    res.status(StatusCodes.NO_CONTENT).end();
  }
}

module.exports = { JobsHandler };
