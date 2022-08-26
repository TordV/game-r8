// Import dependencies and middleware
import express from 'express';
import router from '../src/router';
import path from 'path';
import db from '../src/mysql-pool';
require('dotenv').config()

const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');

// PassportJS configuration and initialization
const initializePassport = require('./passport-config');
initializePassport(
  passport, 
  (username: string) => {  
    return new Promise<{}>((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
        if (error) return reject(error);
        if (!(results.length > 0)) {
          return reject({ message: "User doesn't exist." });
        }

        resolve(results[0]);
      });
    });
  },
  (id: number) => { 
    return new Promise<{}>((resolve, reject) => {
      db.query('SELECT * FROM users WHERE user_id = ?', [id], (error, results) => {
        if (error) return reject(error);
        if (!(results.length > 0)) {
          return reject({ message: "User doesn't exist." });
        }

        resolve(results[0]);
      });
    });
  }
);

// Initialize server and PassportJS middleware
app.use(express.static(path.join(__dirname, '/../../client/public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 86400000, // ms, aka 24 hours
    secure: false // application is running over localhost and not a production environment
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Function to check if a user is authenticated
// @ts-ignore complaining about the types of req, res, next - these fixes are not working: https://stackoverflow.com/questions/34508081/how-to-add-typescript-definitions-to-express-req-res
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send('You are not logged in.');
  }
}

// API-route that uses the isAuth-function from above to check if the user is authenticated, and returns the user-id to the user on the client
router.get('/auth', isAuth, (req, res) => {
  // @ts-ignore - complaining about passport not being a property of session - but it is correct this way
  res.status(200).json({ id: req.session.passport.user });
});

// API-route for logging in using PassportJS
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash : true
}));

// API-route for logging out
router.get('/logout', (req, res, next) => {
  // @ts-ignore
  req.logout();
  next();
});

// Tell the app to use the router for the API
app.use('/api/v1', router);

// Start the webserver on localhost:3000
const port = 3000;
if (process.env.NODE_ENV !== 'test') {
app.listen(port, () => {
  console.info(`Server running on port ${port}`);
});
}
export default app;