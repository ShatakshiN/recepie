const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const express = require('express');
const sequelize = require('../../util/db');
const router= express.Router();

require('dotenv').config();

//models
const Users = require('../models/user');


function isStrValid(str) {
    return (str === undefined || str.length === 0);
};


router.post('/signUp', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        console.log('backend', { name, email, password });

        if (isStrValid(email) || isStrValid(name) || isStrValid(password)) {
            return res.status(400).json({ err: "bad parameter" });
        }

        // Check if the email already exists
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "user already exists" });
        }

        bcrypt.hash(password, 10, async (error, hash) => { 
            await Users.create({ name, email, passWord: hash });
        });

        return res.status(201).json({ msg: "sign up successful" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

function generateAccessToken(id) {
    return jwt.sign({ userId: id }, process.env.JWT_SECRET);
}

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (isStrValid(email) || isStrValid(password)) {
            return res.status(400).json({ message: "bad parameters" });
        }

        const loginCredentials = await Users.findAll({ where: { email } });

        if (loginCredentials.length > 0) {
            bcrypt.compare(password, loginCredentials[0].passWord, (err, result) => {
                if (err) {
                    res.status(500).json({ msg: "something went wrong" });
                }
                if (result === true) {
                    res.status(200).json({ msg: "user logged in successfully", token: generateAccessToken(loginCredentials[0].id) });
                } else {
                    return res.status(400).json({ msg: 'password incorrect' });
                }
            });
        } else {
            return res.status(404).json({ msg: "user doesn't exist" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = router;
