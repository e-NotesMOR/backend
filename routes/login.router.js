const express = require('express');
const router = express.Router();
const { loginController } = require('../controllers');

router.route('/')
    .get(loginController.getAllUsers)
    .post(loginController.loginUser)

module.exports = router;