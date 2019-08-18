const User = require('../models/user');
const { validationResult } = require('express-validator');
exports.getStatus = async (req,res,next) => {
    try {
        const user = await User.findById(req.userId);
        res.status(200).json({
            status : user.status
        })
    } catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.updateStatus = async (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error =new  Error('Validation error!').statusCode  = 401;
        next(error);
    }
    try {
        const { status } = req.body;
        const user = await User.findById(req.userId);
        user.status = status;
        await user.save();
        res.status(200).json({
            message:"User status updated sucessfully!"
        });
    } catch(error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}