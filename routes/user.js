const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/is-auth');
const userController = require('../controllers/user');
const router = express.Router();

router.get('/status' , isAuth ,userController.getStatus);

router.put('/status' , isAuth , [
    body('status').not().isEmpty()
], userController.updateStatus);

module.exports = router;