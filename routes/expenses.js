const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenses');
const { ensureAuth } = require('../middleware/auth');

router.get('/', ensureAuth, expenseController.getExpenses);
router.post('/', ensureAuth, expenseController.postExpense);
router.put('/', ensureAuth, expenseController.putExpense);
router.delete('/', ensureAuth, expenseController.deleteExpense);

module.exports = router;