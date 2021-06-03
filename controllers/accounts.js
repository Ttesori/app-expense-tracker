const Account = require('../models/Account');

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
  postAccount: async (req, res) => {
    console.log('Adding account...', req.user.id)
  },
  putAccount: async (req, res) => {
    console.log('Updating account...', req.user.id)
  },
  deleteAccount: async (req, res) => {
    console.log('Deleting accounts...', req.user.id)
  }
}