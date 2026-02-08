const express = require('express');
const router = express.router();
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;