const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
const { Type } = require('@aws-sdk/client-s3');

const Activity = sequelize.define('activity', {
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true

    },
    activityType :{
        type : Sequelize.STRING,
        allowNull : false
    }
});

module.exports = Activity;