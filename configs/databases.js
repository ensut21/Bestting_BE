const { Sequelize } = require('sequelize');
const config = require('../configs');

const databases = {
    get postgresql() {
        const sequelize = new Sequelize(
            config.postgres.dbName,
            config.postgres.options.user,
            config.postgres.options.pass,
            {
                host: config.postgres.host,
                port: config.postgres.port,
                dialect: 'postgres'
            }
        );

        return sequelize;
    }
};

module.exports = { Sequelize, ...databases }; 