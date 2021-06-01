module.exports = {
  getDashboard: async (req, res) => {
    res.render('tracker/index.ejs', {
      title: 'User Dashboard',
      className: 'page-dashboard',
      user_id: req.user._id
    })
  }
}