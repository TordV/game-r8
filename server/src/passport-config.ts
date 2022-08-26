// @ts-nocheck - due to this being based on a guide in JavaScript - attempts to translate it to TypeScript were not successful.
// This file declares the PassportJS config
// Source for this file is https://www.youtube.com/watch?v=-RCnNyD0L-s

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByUsername, getUserById) {
  const authenticateUser = async (username, password, done) => {
    const user = await getUserByUsername(username);

    if (user == null) {
      return done(null, false, { message: 'No user exists that matches the given username.' })
    }
    
    try {
      if (await bcrypt.compare(password, user.passwd)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Wrong username or password.' })
      }
    } catch (error) {
      return done(error)
    }
  }

  passport.use(new LocalStrategy({ usernameField : 'username', passwordField : 'password'}, authenticateUser));
  
  passport.serializeUser((user, done) => {
    done(null, user.user_id)
  });
  
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
};

module.exports = initialize; 