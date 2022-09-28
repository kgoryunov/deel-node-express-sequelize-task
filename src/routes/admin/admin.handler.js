const { Op } = require('sequelize');

class AdminHandler {
  async getBestProfession(req, res) {
    const sequelize = req.app.get('sequelize');
    const { Profile, Contract, Job } = req.app.get('models');
    const { start, end } = req.query;

    const result = await Profile.findAll({
      attributes: [
        'profession',
        [sequelize.fn('sum', sequelize.col('price')), 'total']
      ],
      where: { type: 'contractor' },
      group: 'profession',
      include: [
        {
          model: Contract,
          as: 'Contractor',
          attributes: [],
          include: [
            {
              model: Job,
              where: {
                paid: true,
                paymentDate: { [Op.between]: [start, end] }
              },
              attributes: []
            }
          ]
        }
      ],
      order: [[sequelize.col('total'), 'DESC']]
    });

    res.json(result);
  }

  async getBestClients(req, res) {
    // TODO looks similar to the code above, maybe should refactor it
    const sequelize = req.app.get('sequelize');
    const { Profile, Contract, Job } = req.app.get('models');
    const { start, end, limit } = req.query;

    const result = await Profile.findAll({
      attributes: [
        'id',
        [sequelize.literal("firstName || ' ' || lastName"), 'fullName'],
        [sequelize.fn('sum', sequelize.col('price')), 'paid']
      ],
      where: { type: 'client' },
      group: 'Profile.id',
      include: [
        {
          model: Contract,
          as: 'Client',
          attributes: [],
          include: [
            {
              model: Job,
              where: {
                paid: true,
                paymentDate: { [Op.between]: [start, end] }
              },
              attributes: []
            }
          ]
        }
      ],
      order: [[sequelize.col('paid'), 'DESC']]
      // limit // TODO figure out why it doesn't work as one would expect
    });

    res.json(result.slice(0, limit));
  }
}

module.exports = { AdminHandler };
