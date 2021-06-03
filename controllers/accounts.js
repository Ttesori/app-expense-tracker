const Account = require('../models/Account');
const Expense = require('../models/Expense');


module.exports = {
  getAccounts: async (req, res) => {
    try {
      let result = await Account.find({ user_id: req.user.id });
      if (!result) res.status(404).json(result);
      res.status(200).json(result);
    } catch (err) {
      console.log(err)
    }
  },
  getAccountsWithCount: async (req, res) => {
    try {
      // Get accounts from accounts model
      let accounts = await Account.find({ user_id: req.user._id }).lean();
      accounts.forEach(account => account.count = 0);
      // add in counts from expenses model
      let expenses = await Expense.find({ user_id: req.user._id }).populate('account_id').lean();
      expenses.forEach(expense => {
        let accountIndex = accounts.findIndex(account => String(expense.account_id._id) === String(account._id))
        accounts[accountIndex].count += 1;
      });
      res.status(200).json(accounts);
    } catch (err) {
      console.log(err)
    }
  },
  postAccount: async (req, res) => {
    try {
      let account = {
        user_id: req.user._id,
        desc: req.body.account_desc
      }
      // Find if account exists
      let exists = await Account.find(account);
      console.log(exists);
      if (exists.length === 0) {
        // create account
        let resp = await Account.create(account);
        console.log(resp);
        res.redirect('/tracker/accounts');
      }
      req.flash('errors', { msg: 'Account already exists' });
      res.redirect('/tracker/accounts');
      //res.status(400).json({ 'error': 'Account already exists' });

      // If exists, return error
      // Else create new account
    } catch (error) {

    }


  },
  putAccount: async (req, res) => {
    // Check to see if new name exists
    console.log(req.body, req.body._id, req.body.desc);
    let account = {
      user_id: req.user._id,
      desc: req.body.desc
    }
    // Find if account exists
    let exists = await Account.find(account);
    console.log('exists', exists);
    if (exists.length > 0) {
      req.flash('errors', { msg: 'Account already exists' });
      return res.redirect('/tracker/accounts');
    }
    let account_id = req.body._id;
    let resp = await Account.findOneAndUpdate({ _id: account_id }, { desc: req.body.desc });
    console.log(resp);
    res.status(200).send();
  },
  deleteAccount: async (req, res) => {
    try {
      let result = await Account.deleteOne({ _id: req.body.id });
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).send();
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
}