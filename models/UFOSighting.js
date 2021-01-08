const Sequelize = require('sequelize');
const db = require('../config/database');

module.exports = db.define('UFOSighting', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    dateTime: {
        type: Sequelize.DATE,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    shape: {
        type: Sequelize.STRING,
        allowNull: false
    },
    duration: {
        type: Sequelize.STRING,
        allowNull: false
    },
    summary: {
        type: Sequelize.STRING(1234),
        allowNull: false
    },
    datePosted: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false
    },
    longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false
    }
}, {
    timestamps: false
});