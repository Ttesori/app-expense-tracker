const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const { ensureGuest } = require('../middleware/auth');

router.get('/', ensureGuest, homeController.getHome);
router.post('/login', homeController.loginUser);
router.get('/register', ensureGuest, homeController.getRegisterUser);
router.post('/register', homeController.registerUser);
router.get('/logout', homeController.logoutUser);

module.exports = router;