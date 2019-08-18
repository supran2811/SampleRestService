const express = require('express');
const authController  = require('../controllers/auth');
const User  = require('../models/user');
const { body } = require('express-validator');

const router = express.Router();

router.post('/signup' ,[
    body('email').isEmail().withMessage('Email address is not valid!')
    .custom((value , {req}) => {
        return User.findOne({email:value}).then(user => {
            if(user) {
                return Promise.reject('User already exist!');
            }
        });
    }).normalizeEmail(),
    body('password').trim().isLength({min: 6}),
    body('name').trim().isLength({min: 6})
    
],authController.createUser);

router.post('/login' , [
    body('email').isEmail().withMessage('Email address is not valid!').normalizeEmail(),
    body('password').trim().isLength({min: 6})
 ] , authController.loginUser)
module.exports = router;

