const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser  = async (req,res,next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const errorArray = errors.array();
            throw new Error('Validation error!!!').statusCode = 422;
        }
        const { email , name , password } = req.body;

        const hashedPassword = await bcrypt.hash(password,12);
        
        const user = new User({
            email,
            name,
            password:hashedPassword
        });

        await user.save();

        res.status(201).json({message: 'User Created Sucessfully!!'});


    } catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.loginUser = async (req,res,next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const errorArray = errors.array();
            throw new Error('Validation error!!!').statusCode = 422;
        }
        
        const { email , password } = req.body;
        const user = await User.findOne({email});
        if(!user) {
            throw new Error('User does not exist!').statusCode = 401;
        }
        const isEqual = await bcrypt.compare(password,user.password);
        if(!isEqual) {
            throw new Error('Invalid password').statusCode = 401;
        }
        const token = jwt.sign({
            email,
            userId: user._id.toString()
        },
        "supersecretsecretkey",{
            expiresIn:'1h'
        });
        res.status(200).json({token,userId:user._id.toString()});
    } catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}