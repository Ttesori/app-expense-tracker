const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/tracker');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, trackerController.getDashboard);
router.get('/accounts', ensureAuth, trackerController.getAccounts);

module.exports = router;