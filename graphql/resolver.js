const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
   },

   loginUser: async function ({email,password}) {
        const user = await User.findOne({email});
        if(!user) {
            const error = new Error('User not found!');
            error.code = 401;
            throw error;
        }
        const isEqual = await bcrypt.compare(password,user.password);
        if(!isEqual) {
            const error = new Error('Invalid user or password!');
            error.code = 401;
            throw error;
        }

        const token = jwt.sign({
            email,
            userId: user._id.toString()
        },
        "supersecretsecretkey",{
            expiresIn:'1h'
        });

        return {
            userId: user._id.toString(),
            token
        }

   },

   createPost : async function({postInput:{title,content,imageUrl}},req) {
        if(!req.isAuth) {
            const error = new Error('User is not authenticated');
           error.code = 403;
           throw error;
        }

        const errors = [];

        if(validator.isEmpty(title) || !validator.isLength(title , {
            min: 5
        })) {
            errors.push({message:'Invalid title!'});
        }

        if(validator.isEmpty(content) || !validator.isLength(content , {
            min: 10
        })) {
            errors.push({message:'Invalid content!'});
        }

        if(!validator.isURL(imageUrl)) {
            errors.push({message:'Invalid image url!'});
        }

        if(errors.length > 0) {
            const error = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = await User.findById(req.userId);

        post = new Post({
            title,
            content,
            imageUrl,
            creator:req.userId
          });
          user.posts.push(post);    
          await user.save();
          
         result = await post.save();

         return {
             ...result._doc,
             _id: result._id.toString(),
             createdAt: result.createdAt.toISOString(),
             updatedAt: result.updatedAt.toISOString()
         }
 
   }
}