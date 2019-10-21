const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../models/users');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email"}, (email, password, done) => {
            //Match User
            User.findOne({ email: email}) //findOne is searching the database for the user
            .then(user => {
                if(!user) {
                    return done(null, false, {message: "That email is not registered"});
                }

                //Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, fals, { message: 'Password Incorrect'})
                    }
                })
            })
            .catch(err => console.log(err));
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}