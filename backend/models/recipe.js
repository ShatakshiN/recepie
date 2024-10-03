const Sequelize = require('sequelize');
const sequelize = require('../../util/db');
const { type } = require('os');

const Recipe = sequelize.define('Recipe', {
    id :{
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true

    },

    title :{
        type : Sequelize.STRING,
        allowNull : false,
    },

    imageUrl :{
        type : Sequelize.STRING
    },

    dietaryPreferences :{
        type : Sequelize.STRING,
        allowNull : false
    },

    difficultyLevel :{
        type : Sequelize.STRING,
        allowNull : false
    },

    cookingTime : {
        type : Sequelize.TIME,
        allowNull : false
    }
});

module.exports = Recipe; 