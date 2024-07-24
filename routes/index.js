const router = require('express').Router();
const passport = require('passport');
const passwordUtils = require('../lib/passwordUtils');
const db = require('../config/database');

/**
 * -------------- POST ROUTES ----------------
 */

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/login-success',
  })
);

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  const { salt, hash } = passwordUtils.genPassword(password);

  try {
    await db.query('INSERT INTO users (username, hash, salt) VALUES ($1, $2, $3)', [username, hash, salt]);
    res.redirect('/login');
  } catch (err) {
    next(err);
  }
});

/**
 * -------------- GET ROUTES ----------------
 */

router.get('/', (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get('/login', (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="username">\
    <br>Enter Password:<br><input type="password" name="password">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get('/register', (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="username">\
                    <br>Enter Password:<br><input type="password" name="password">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get('/protected-route', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout and reload</a></p>');
  } else {
    res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
  }
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/protected-route');
  });
});

router.get('/login-success', (req, res, next) => {
  res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

router.get('/login-failure', (req, res, next) => {
  res.send('You entered the wrong password.');
});

module.exports = router;
