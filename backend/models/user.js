const Sequelize = require('sequelize');
const sequelize = require('../../util/db');

const Users  = sequelize.define('SignUp',{
    id : {
        type : Sequelize.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },

    name : {
        type : Sequelize.STRING,
        allowNull : false  
    },

    email : {
        type : Sequelize.STRING,
        allowNull : false,
        unique: true
    },

    passWord: {
        type : Sequelize.STRING,
        allowNull :false
        
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Only one user can be an admin
    },
    banned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
});

module.exports = Users;