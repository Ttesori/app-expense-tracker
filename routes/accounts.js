const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accounts');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, accountsController.getAccounts);
router.post('/', ensureAuth, accountsController.postAccount);
router.put('/', ensureAuth, accountsController.putAccount);
router.delete('/', ensureAuth, accountsController.deleteAccount);
router.get('/count', ensureAuth, accountsController.getAccountsWithCount);

module.exports = router;