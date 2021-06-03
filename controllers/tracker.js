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
    // Figure out which accounts are ok to delete
    try {
      let expenses = await Expense.find({ user_id: req.user._id }).populate('account_id');
      let accountCounts = expenses.reduce((accountMap, expense) => {
        let account = expense.account_id;
        console.log(accountMap);
        if (accountMap[account._id] !== undefined) {
          accountMap[account._id].count = accountMap[account._id].count++;
          return accountMap;
        } else {
          accountMap[account._id] = {
            count: 1,
            name: account.desc
          }
          return accountMap;
        }
      }, {});
      console.log(accountCounts);
    } catch (error) {
    }

    res.render('tracker/accounts.ejs', {
      title: 'User Accounts',
      className: 'page-accounts',
      user_id: req.user._id
    })
  }
}