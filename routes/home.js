const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');

router.get('/', homeController.getHome);
router.post('/login', homeController.loginUser);
router.get('/register', homeController.getRegisterUser);
router.post('/register', homeController.registerUser);
router.get('/logout', homeController.logoutUser);

module.exports = router;