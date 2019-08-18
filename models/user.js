const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    email : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    status : {
        type:String,
        default:'Iam new!'
    },
    posts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, {timestamps:true});

module.exports = mongoose.model('User',userSchema);