const Account = require('../models/Account');
const User = require('../models/User');

module.exports = {
  getDashboard: async (req, res) => {
    // If this is user's first visit, create default accounts
    try {
      let result = await Account.find({ user_id: req.user._id });
      if (result.length === 0) {
        let accounts = [{
          desc: 'Cash',
          user_id: req.user._id
        }, {
          desc: 'Credit Card',
          user_id: req.user._id
        }];
        let resp = await Account.insertMany(accounts);
        console.log('created default accounts', resp);
      }
    } catch (err) {
      console.log(err)
    }

    res.render('tracker/index.ejs', {
      title: 'User Dashboard',
      className: 'page-dashboard',
      user: req.user,
      user_id: req.user._id
    })
  },
  getAccounts: async (req, res) => {
    res.render('tracker/accounts.ejs', {
      title: 'User Accounts',
      className: 'page-accounts',
      user: req.user,
      user_id: req.user._id,
    });
  },
  getReports: async (req, res) => {
    res.render('tracker/reports.ejs', {
      title: 'Report',
      className: 'page-reports',
      user: req.user,
      user_id: req.user._id
    });
  },
  getProfile: async (req, res) => {
    res.render('tracker/profile.ejs', {
      title: 'User Profile',
      className: 'page-profile',
      user: req.user
    })
  },
  putProfile: async (req, res) => {
    let user = {
      display_name: req.body.user_name,
      date_format: req.body.date_format,
      number_format: req.body.number_format,
      currency_symbol: req.body.curr_symbol
    }
    let resp = await User.findByIdAndUpdate({ _id: req.user._id }, user);
    if (resp._id) {
      res.redirect('/tracker/profile');
    }
  },
  getReports: (req, res) => {
    res.render('tracker/reports.ejs', {
      title: 'Reports',
      className: 'page-reports',
      user: req.user
    })
  }
}