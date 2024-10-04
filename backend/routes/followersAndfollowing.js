const cors = require('cors');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const sequelize = require('../../util/db');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const router= express.Router();
const { Op } = require('sequelize');
const io = require('socket.io')

//models
const Users  =require('../models/user');
const Recipe = require('../models/recipe');
const Follow = require('../models/follow');


//middleware 

const authenticate = require('../middleware/auth');

router.get('/get-Users', authenticate ,async(req,res)=>{
    const userList  = await Users.findAll({
        attributes: ['name', 'id']
    })
    res.status(200).json({userList});
})

router.post('/follow/:userId', authenticate ,async(req,res)=>{
    try {
        const io = req.app.get('io'); // Access the io instance
        const followerId = req.body.currentUserId; // assuming req.userId is the logged-in user
        const followingId = req.params.userId; // ID of the user to follow
    
        const follow = await Follow.create({ FollowerId: followerId, FollowingId: followingId });

        // Get the name of the follower
        const followerUser = await Users.findByPk(followerId, {
            attributes: ['name'], // Retrieve only the 'name' attribute
        });
        
        // Emit follow event
        const followedUser = await Users.findByPk(followingId);
        if (followedUser && followedUser) {
            console.log("Follower:", followerUser.name, "is now following:", followedUser.name);
            io.emit('followed', { followerId, followingId: followedUser.id, followerName: followerUser.name });
        }

        res.status(201).json({ message: 'User followed successfully', follow });
      } catch (error) {
        res.status(500).json({ error: 'Failed to follow user' });
      }
});

// to get the the following list 

router.delete('/unfollow/:userId',authenticate, async(req,res)=>{
    try {
        const followerId = req.body.currentUserId;
        const followingId = req.params.userId;
    
        await Follow.destroy({ where: { FollowerId: followerId, FollowingId: followingId } });
        // Emit unfollow event (if necessary)
        const unfollowedUser = await Users.findByPk(followingId);
        if (unfollowedUser) {
            io.emit('unfollowed', { followerId, followingId: unfollowedUser.id });
        }
        res.status(200).json({ message: 'User unfollowed successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
}); 

module.exports = router;