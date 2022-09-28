const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
});

class Profile extends Sequelize.Model {
  async getContracts(options) {
    const ownContract = {
      client: { ClientId: this.id },
      contractor: { ContractorId: this.id }
    }[this.type];

    return await Contract.findAll({
      ...options,
      where: { ...options?.where, ...ownContract }
    });
  }

  async getUnpaidJobs(options) {
    const contractIds = (
      await this.getContracts({
        raw: true,
        attributes: ['id'],
        where: { status: { [Op.ne]: 'terminated' } }
      })
    ).map(({ id }) => id);

    if (!contractIds.length) return [];

    return await Job.findAll({
      ...options,
      where: {
        ...options?.where,
        paid: { [Op.ne]: true },
        ContractId: contractIds
      }
    });
  }
}
Profile.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    profession: {
      type: Sequelize.STRING,
      allowNull: false
    },
    balance: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM('client', 'contractor'),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Profile'
  }
);

class Contract extends Sequelize.Model {}
Contract.init(
  {
    terms: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('new', 'in_progress', 'terminated'),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Contract'
  }
);

class Job extends Sequelize.Model {}
Job.init(
  {
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    price: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false
    },
    paid: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    paymentDate: {
      type: Sequelize.DATE
    }
  },
  {
    sequelize,
    modelName: 'Job'
  }
);

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Contract.belongsTo(Profile, { as: 'Contractor' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.hasMany(Job);
Job.belongsTo(Contract);

module.exports = {
  sequelize,
  Profile,
  Contract,
  Job
};
