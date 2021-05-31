const express = require('express');
const app = express();
const connectDB = require('./config/db');
const homeRoutes = require('./routes/home');

// Settings and whatnot
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect DB
connectDB();

// Routes come last before starting server
app.use('/', homeRoutes);

// Start Server
app.listen(process.env.PORT, () => {
  console.log('Your server is running, you better go catch it!');
})