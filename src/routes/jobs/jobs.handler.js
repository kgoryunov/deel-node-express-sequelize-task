const { Op } = require('sequelize');

class JobsHandler {
  async getUnpaidJobs(req, res) {
    const contractIds = (
      await req.profile.getContracts({
        raw: true,
        attributes: ['id'],
        where: { status: { [Op.ne]: 'terminated' } }
      })
    ).map(({ id }) => id);
    if (!contractIds.length) return res.json([]);
    const { Job } = req.app.get('models');
    const unpaidJobs = await Job.findAll({
      where: { ContractId: contractIds, paid: { [Op.ne]: true } }
    });
    res.json(unpaidJobs);
  }
}

module.exports = { JobsHandler };
