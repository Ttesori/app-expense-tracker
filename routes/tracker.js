const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/tracker');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, trackerController.getDashboard);
router.get('/accounts', ensureAuth, trackerController.getAccounts);
router.get('/profile', ensureAuth, trackerController.getProfile);
router.put('/profile', ensureAuth, trackerController.putProfile);

module.exports = router;