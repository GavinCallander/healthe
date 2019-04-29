require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Route for signup
router.post('/signup', (req, res) => {
    // Check if email already exists
    User.findOne({email: req.body.email}, (err, user) => {
    // if yes, return an error
        if (user) {
            res.json({type: 'Error', message: 'Email already exists'})
        } else {
    // if no, create the user in the db 
            let user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
            user.save( (err, user) => {
                if (err) {
                    res.json({type: 'Error', message: 'Database error creating user'})
                } else {
                    // sign a token (this is the login step)
                    var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
                        expiresIn: "1d"
                    });
                    // return the token
                    res.status(200).json({type: 'success', user: user.toObject(), token})
                }
            })
        }
    })
});
// Route for login
router.post('/login', (req, res) => {
    // Find user in db
    User.findOne({email: req.body.email}, (err, user) => {
        // if no user, return error
        if (!user) {
            res.json({type: 'Error', message: 'Account not found'})
        } else {
            // if user, check authentication
            if ( user.authenticated(req.body.password) ) {
                // if authenticated, sign a token (login)
                var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
                    expiresIn: "1d"
                });
                // return the token
                res.json({type: 'Success', message: 'Login successful', user: user.toObject(), token})
            } else {
                res.json({type: 'Error', message: 'Authentication failure'})
            }
        }
    })
})
// Route for token validation
router.post('/me/from/token', (req, res) => {
    // Make sure they sent us a token to check
    let token = req.body.token;
    // if no token, return error
    if (!token) {
        res.json({type: 'Error', message: 'You must pass a valid token'})
    } else {
        // if token, verify it
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            // if invalid, return an error
            if (err) {
                res.json({type: 'error', message: 'Invalid token. Please log in again'})
            } else {
                // if token is valid...
                //  look up user in the db
                User.findById(user._id, (err, user) => {
                    //  if user doesn't exist, return an error
                    if (err) {
                        res.json({type: 'Error', message: 'Database error during validation'})
                    } else {
                        //  if user exists, send user and token back to React
                        res.json({type: 'Success', user: user.toObject(), token})
                    }
                })
            }
        })
    }
});

module.exports = router;