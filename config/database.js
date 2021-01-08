const Sequelize = require('sequelize');
require('dotenv').config();

const {DB_HOST, DB_NAME, DB_USERNAME, DB_PASS} = process.env;

module.exports = new Sequelize(DB_NAME, DB_USERNAME, DB_PASS, {
    host: DB_HOST,
    dialect: 'mssql'
});