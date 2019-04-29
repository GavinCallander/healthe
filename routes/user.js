const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');

// GET /user - get all users
router.get('/', (req, res) => {
    res.send('users found, users found!')
})


// GET /user/:id - get one user by id
router.get('/:id', (req, res) => {
    User.findById(req.params.id).populate('profile').exec((err, user) => {
        if (!err) {
            res.status(200).json(user);
        } else {
            res.status(500).json(err);
        }
    })
})

