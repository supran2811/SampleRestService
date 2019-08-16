const Post = require('../models/post');
const { validationResult } = require('express-validator');

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({posts});
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
    throw new Error('Validation failure!!').statusCode = 422;
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = 'image';
  const post = new Post({
    title,
    content,
    imageUrl,
    creator:'Supran'
  });
  const result = await post.save();
    // Create post in db
    res.status(201).json({
      message: 'Post created successfully!',
      post: result
    });
  } catch(error) {
    if(!error.statusCode) {
        error.statusCode = 500;
    }
    next(error);
    console.log('Error is thrown',error);
  };


  
};
