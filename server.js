const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();

// Initialize passport config
require('./config/passport');

const app = express();

// Middleware for sessions and passport
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('<a href="/auth/facebook">Login with Facebook</a>');
});

// Redirect to Facebook login
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect to this URL after approval.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect to profile.
    res.redirect('/profile');
  }
);

// Profile route (after successful login)
app.get('/profile', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.send(`Hello, ${req.user.displayName}! <a href="/logout">Logout</a>`);
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
