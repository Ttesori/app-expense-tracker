module.exports = {
  getExpenses: (req, res) => {
    res.send('Getting expenses...')
  },
  postExpense: (req, res) => {
    res.send('Adding new expense...')
  },
  putExpense: (req, res) => {
    res.send('Updating existing expense...')
  },
  deleteExpense: (req, res) => {
    res.send('Removing expense...')
  }
}