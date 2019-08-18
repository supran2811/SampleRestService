const express = require('express');

const { body } = require('express-validator');

const isAuth = require('../middlewares/is-auth');

const feedController = require('../controllers/feed');

const router = express.Router();

// GET /feed/posts
router.get('/posts', isAuth, feedController.getPosts);

router.get('/post/:postId', isAuth,feedController.getPost);

// POST /feed/post
router.post('/post',isAuth, [
   body('title').trim().isLength({min: 5}),
   body('content').trim().isLength({min: 5})
] ,feedController.createPost);

router.put('/post/:postId',isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
 ] ,feedController.createPost);

 router.delete('/post/:postId' ,isAuth, feedController.deletePost);

module.exports = router;