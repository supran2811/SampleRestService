const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const User = require('../models/user');

const Post = require('../models/post');

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
        try {

        const user = await User.findById(req.userId);

        const post = new Post({
            title,
            content,
            imageUrl,
            creator:user
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
        } catch(error) {
            console.log('Error while saving',error);
            throw error;
        }
   },

   getPosts: async function({ page } , req) {
    // if(!req.isAuth) {
    //     const error = new Error('User is not authenticated');
    //    error.code = 403;
    //    throw error;
    // }
    try {
        const perPage = 2;
        const totalItems = await Post.countDocuments();
        const posts = await Post.find().populate('creator').sort({createdAt:-1}).skip((page-1)*perPage).limit(perPage);;
        return {posts : posts.map(post =>  ({
                ...post._doc ,
                 _id:post._id.toString() , 
                 createdAt:post.createdAt.toISOString() , 
                 updatedAt: post.updatedAt.toISOString()
                })  
            ) , totalItems};
    } catch(error) {
        console.log("Error thrown while fetching post!",error);
        throw error;
    }

   }
}