const Expense = require('../models/Expense');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc')
const DATE_FORMAT = 'YYYY-MM-DD';
dayjs.extend(utc);

module.exports = {
  getExpenses: async (req, res) => {
    try {
      const user_id = req.user._id;
      const month = req.query.month;
      let results;
      if (month) {
        const dateStart = dayjs(month + '-01');
        const dateEnd = dateStart.add(1, 'month');
        results = await Expense.find({
          user_id: user_id,
          date: {
            $gte: dateStart.format(DATE_FORMAT),
            $lte: dateEnd.format(DATE_FORMAT)
          }
        }).sort({ date: 1 })
      } else {
        results = await Expense.find({ user_id: user_id }).sort({ date: 1 })
      }
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
        date: dayjs(req.body.expense_date).toISOString(),
        amount: Number(req.body.expense_amount),
        category: req.body.expense_category,
        user_id: req.user._id || req.body._id
      };
      let resp = await Expense.create(expense);
      if (resp._id) {
        res.redirect('/tracker');
      }
    } catch (err) {
      console.log(err)
    }
  },
  putExpense: async (req, res) => {
    console.log(req.body.expense_date, dayjs(req.body.expense_date).utc(true))
    try {
      let resp = await Expense.findOneAndUpdate(
        { _id: req.body._id },
        {
          desc: req.body.expense_description,
          date: dayjs(req.body.expense_date).toISOString(),
          amount: Number(req.body.expense_amount),
          category: req.body.expense_category,
        });
      console.log(resp);
      res.redirect('/tracker');
    }
    catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  },
  deleteExpense: async (req, res) => {
    try {
      let result = await Expense.deleteOne({ _id: req.body.id });
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