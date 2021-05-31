module.exports = {
  getDashboard: (req, res) => {
    res.render('tracker/index.ejs', {
      title: 'User Dashboard',
      className: 'page-dashboard'
    })
  }
}