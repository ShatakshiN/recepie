const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const Fav = sequelize.define('fav', {
    id :{
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    }
})