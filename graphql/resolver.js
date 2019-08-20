const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');

module.exports = {
   createUser: async function({userInput: {email,password,name}}) {
       const existingUser = await User.findOne({email});
        const errors = [];
       if(existingUser) {
           throw new Error('User already exist!');
       }
       if(!validator.isEmail(email)) {
            errors.push({message:'Invalid email format!'});
       }

       if(errors.length > 0) {
           const error = new Error('Invalid input');
           error.data = errors;
           error.code = 422;
           throw error;
       }

       password = await bcrypt.hash(password,12);
       
       
       const user = new User({
           email,
           name,
           password
       });

       const result = await user.save();

       return {
           ...result._doc,
           _id:result._id.toString()
       }
   }
}