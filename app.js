const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const sequelize = require('./util/db');
const { Sequelize } = require('sequelize');

require('dotenv').config();

//routes
const loginAndSignUpRoute = require('./backend/routes/loginandsignUp');
const recipeRoute = require('./backend/routes/recipe')

//Models
const Users  = require('./backend/models/user');
const Recipe = require('./backend/models/recipe');

app.use(cors());
app.use(bodyparser.json());

//app.use(loginAndSignUpRoute);
app.use(recipeRoute);

//Associations
Recipe.belongsTo(Users, { constraints: true, onDelete: 'CASCADE' });
Users.hasMany(Recipe);


sequelize.sync()
    .then(()=>{
        app.listen(process.env.PORT || 4000)
        console.log('server is running on 4000')

    })
    .catch((error)=>{
        console.log(error);
    });