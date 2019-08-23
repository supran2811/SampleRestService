const Post = require('../models/post');
const User = require('../models/user');
const socket = require('../socket');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.countDocuments();
    const posts = await Post.find().populate('creator').sort({createdAt:-1}).skip((currentPage-1)*perPage).limit(perPage);
    res.status(200).json({posts , totalItems});
  } catch(error) {
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getPost = async (req,res,next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if(!post) {
      throw new Error('Post not found!!').statusCode = 404;
    }
    res.status(200).json({post});
  } catch(error) {
    if(!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

exports.createPost = async (req, res, next) => {
  try {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    console.log("Validation failures are ",errors);
    const error = new Error('Validation failure!!');
    error.statusCode = 422;
    throw error;
  }
  if(!req.file && !req.body.image) {
    const error = new Error('No image!!');
    error.statusCode = 422;
    throw error;
  }
  
  const { postId } = req.params;
  
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file ? req.file.path : req.body.image ;
  
  let post,result;
  const user = await User.findById(req.userId);
  if(postId) {
    //// Update post
    post = await Post.findById(postId).populate('creator');

    if(!post) {
      throw new Error('No Post found').statusCode = 422;
    }

    if(post.creator._id.toString() !== req.userId.toString()) {
      throw new Error('Operation not allowed!!!').statusCode = 403;
    }
    if(!req.body.image) {
      clearImage(post.imageUrl);
    } 
    
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    
   result = await post.save();
  }
  else {
    /// Create new post
    
    post = new Post({
      title,
      content,
      imageUrl,
      creator:req.userId
    });
    user.posts.push(post);    
    result = await post.save();
  }
  


    // Create/Update post in db
    res.status(201).json({
      message: 'Post created / updated successfully!',
      post: result,
      creator: {userId: user._id , name: user.name}
    });
  } catch(error) {
    if(!error.statusCode) {
        error.statusCode = 500;
    }
    next(error);
  };
};

exports.deletePost = async (req,res,next) => {

  try {
    const post = await Post.findById(req.params.postId);
    if(!post) {
      throw new Error('No Post found').statusCode = 422;
    }
   
  if(post.creator.toString() !== req.userId.toString()) {
      throw new Error('Operation not allowed!!!').statusCode = 403;
    }
   const result = await Post.findByIdAndRemove(req.params.postId);
   const user = await User.findById(req.userId);
   user.posts.pull(post._id);
   await user.save();
   clearImage(post.imageUrl);
   socket.getIO().emit('post' , {action:'delete'});
   res.status(202).json({message: 'Content Deleted!!'});
  } catch(error) { 
    if(!error.statusCode) {
      error.statusCode = 500;
    }
      next(error);
  }
}

const  clearImage = (filePath) => {

  const fileToDelete = path.join(__dirname , ".." , filePath);
  fs.unlink(fileToDelete, (err) => {
    if (err) {
        throw err;
    }
})
}