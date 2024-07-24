const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const pgSession = require('connect-pg-simple')(session);
const db = require('./config/database');
const routes = require('./routes');

// Create the Express application
const app = express();

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(
  session({
    store: new pgSession({
      pool: db,
      tableName: 'session',
    }),
    secret: 'lol', // Use an environment variable for the secret
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

// Passport authentication setup
app.use(passport.initialize());
app.use(passport.session());

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

// Routes
app.use(routes);

// Server listens on http://localhost:3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
