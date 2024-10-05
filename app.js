const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const sequelize = require('./util/db');
const socketIo = require('socket.io');
const { Sequelize } = require('sequelize');

require('dotenv').config();

//routes
const loginAndSignUpRoute = require('./backend/routes/loginandsignUp');
const recipeRoute = require('./backend/routes/recipe')
const followRoute = require('./backend/routes/followersAndfollowing')

//Models
const Users  = require('./backend/models/user');
const Recipe = require('./backend/models/recipe');
const Follow = require('./backend/models/follow');
const Activity = require('./backend/models/activity');
const Role =  require('./backend/models/role');

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ["http://127.0.0.1:5500", "http://localhost:4000"], // Adjust this to restrict origins
        methods: ["GET", "POST"]
    },
    path: "/socket.io"  // Ensures Socket.IO uses the correct path
});

app.use(cors());
app.use(bodyparser.json());

app.use(loginAndSignUpRoute);
app.use(recipeRoute);
app.use(followRoute);


// Listen for socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Store the io instance in app
app.set('io', io);


//Associations
Recipe.belongsTo(Users, { constraints: true, onDelete: 'CASCADE' });
Users.hasMany(Recipe);

/* Follow.belongsTo(Users, { as: 'Follower' });
Follow.belongsTo(Users, { as: 'Following' }); */

// Follow associations
Follow.belongsTo(Users, { as: 'Follower', foreignKey: 'FollowerId' });   // A follower (user) in the Follow model
Follow.belongsTo(Users, { as: 'Following', foreignKey: 'FollowingId' }); // A followed user in the Follow model


Activity.belongsTo(Users, { constraints: true, onDelete: 'CASCADE' })
Users.hasMany(Activity);



sequelize.sync()
    .then(()=>{
        server.listen(process.env.PORT || 4000)
        console.log('server is running on 4000')

    })
    .catch((error)=>{
        console.log(error);
    });