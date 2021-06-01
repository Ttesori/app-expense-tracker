const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  desc: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now()
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Expense', ExpenseSchema);