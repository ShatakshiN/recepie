const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
const { Type } = require('@aws-sdk/client-s3');

const Follow = sequelize.define('follow', {
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true

    }
});

module.exports = Follow;