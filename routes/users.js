const express = require('express');
const router = express.Router();

const passport = require('passport');


//Bcrypt to encrypt the password user creates. 
const bcrypt = require('bcryptjs'); 
 
//User Model
const User = require("../models/users");

//login page
router.get('/login', (req, res) => res.render('login'));

//Register page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    
    //We are going to use a variable to pull out the information entered by user in req.body.
    const {name, email, password, password2} = req.body;

    //We are going to create an array called errors.
    let errors = [];

    //check requiired fields  If any of the filled are not truey, 
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fille in all fields'});
    }

    //Check Password Match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match'});
    }

    //Check Pass Length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters.'});
    }

    if(errors.length > 0 ) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //Validatio Passed
        User.findOne({email: email})
        .then(user => {
            if(user) {
                //User Exists
                errors.push({ msg: `Email is already registered`});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                //has Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        //Set password to hased
                        newUser.password = hash;
                        //save User
                        newUser.save()
                        .then(user => {  //once the user is saved, we will call on the middleware that we created in app.js which constains the global variables.  After those variables display, you continue with the redirect to users/login
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        });
    }

});

//Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

//LogOut Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Your are logged out');
    res.redirect('/users/login');
})
module.exports = router;