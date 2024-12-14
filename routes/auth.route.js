const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/register', [authMiddleware.validateSignup ], authController.register);
router.post('/login', [authMiddleware.validateLogin], authController.login);
router.get('/userInfo/:userId', authController.getUserInfo)

module.exports = router;