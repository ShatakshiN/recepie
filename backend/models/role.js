const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
const { Type } = require('@aws-sdk/client-s3');

const Role = sequelize.define('role', {
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true

    }
});

module.exports = Role;