const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('shop', 'root', '12345678', {
    host: 'localhost',
    logging:false,
    dialect:'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });

  module.exports = sequelize