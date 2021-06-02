const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('express-flash');
const connectDB = require('./config/db');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const methodOverride = require('method-override')
const homeRoutes = require('./routes/home');
const expenseRoutes = require('./routes/expenses');
const trackerRoutes = require('./routes/tracker');

// Settings and whatnot
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(flash());
app.use(methodOverride('_method'));

// Connect DB
connectDB();

// THE ORDER OF THIS IS REALLY IMPORTANT -- session must come BEFORE passport setup stuff
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.DB_STRING })
}));

// Set up passport
require('./config/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());


// Routes come last before starting server
app.use('/', homeRoutes);
app.use('/expenses', expenseRoutes);
app.use('/tracker', trackerRoutes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log('Your server is running, you better go catch it!');
})