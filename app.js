const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('express-flash');
const connectDB = require('./config/db');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const homeRoutes = require('./routes/home');
const expenseRoutes = require('./routes/expenses');

// Settings and whatnot
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.use(flash());
// Routes come last before starting server
app.use('/', homeRoutes);
app.use('/expenses', expenseRoutes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log('Your server is running, you better go catch it!');
})