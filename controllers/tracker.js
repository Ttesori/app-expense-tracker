const Expense = require('../models/Expense');

module.exports = {
  getDashboard: async (req, res) => {
    res.render('tracker/index.ejs', {
      title: 'User Dashboard',
      className: 'page-dashboard',
      user_id: req.user._id
    })
  },
  getAccounts: async (req, res) => {
    res.render('tracker/accounts.ejs', {
      title: 'User Accounts',
      className: 'page-accounts',
      user_id: req.user._id,
    });
  }
}