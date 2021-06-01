const Expense = require('../models/Expense');

module.exports = {
  getExpenses: async (req, res) => {
    try {
      const user_id = req.user._id || req.params.uid;
      const results = await Expense.find({ user_id: user_id });
      res.status(200).json(results);
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  },
  postExpense: async (req, res) => {
    try {
      let expense = {
        desc: req.body.expense_description,
        date: new Date(req.body.expense_date),
        amount: Number(req.body.expense_amount),
        category: req.body.expense_category,
        user_id: req.user._id || req.body._id
      };
      let resp = await Expense.create(expense);
      if (resp._id) {
        res.redirect('/tracker');
      }
      //res.json(resp);
    } catch (err) {
      console.log(err)
    }
  },
  putExpense: (req, res) => {
    res.send('Updating existing expense...')
  },
  deleteExpense: (req, res) => {
    res.send('Removing expense...')
  }
}