const { Op } = require('sequelize');

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
    if (!contracts.length) return res.status(404).end();
    res.json(contracts[0]);
  }
}

module.exports = { ContractsHandler };
