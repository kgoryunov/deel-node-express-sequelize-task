class ContractsHandler {
  async getContractById(req, res) {
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const { id: profileId, type } = req.profile;
    const ownContract = {
      client: { ClientId: profileId },
      contractor: { ContractorId: profileId }
    }[type];
    const contract = await Contract.findOne({ where: { id, ...ownContract } });
    if (!contract) return res.status(404).end();
    res.json(contract);
  }
}

module.exports = { ContractsHandler };
