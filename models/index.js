const { Sequelize, postgresql } = require('../configs/databases');

postgresql.authenticate();
postgresql.sync();

module.exports = {
  Sequelize,
  postgresql,
  users: require('./schema/users')(postgresql, Sequelize),
};
