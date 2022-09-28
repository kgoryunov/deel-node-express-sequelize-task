const { Op } = require('sequelize');
const { StatusCodes } = require('http-status-codes');

class ContractsHandler {
  async getContracts(req, res) {
    const contracts = await req.profile.getContracts({
      where: { status: { [Op.ne]: 'terminated' } }
    });
    res.json(contracts);
  }

  async getContractById(req, res) {
    const { id } = req.params;
    const contracts = await req.profile.getContracts({ where: { id } });
    if (!contracts.length) return res.status(StatusCodes.NOT_FOUND).end();
    res.json(contracts[0]);
  }
}

module.exports = { ContractsHandler };
