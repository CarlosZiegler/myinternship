const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

//Documentation for Swagger https://github.com/fliptoo/swagger-express 

/**
 * @swagger
 * /:
 *  get:
 *    description: use to request authentication page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */


router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

/**
 * @swagger
 * /:
 *  post:
 *    description: use to post authentication page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */


router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true
  })
)

// github authentication routing
router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  })
);


router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (password.length < 8) {
    res.render('auth/signup', {
      message: 'Your password must be 8 characters minimun.'
    });
    return;
  }
  if (username === '') {
    res.render('auth/signup', { message: 'Your username cannot be empty' });
    return;
  }

  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render('auth/signup', { message: 'Wrong credentials' });
    } else {
      // we can create a user with the username and password pair
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then(dbUser => {
          // passport - login the user
          req.login(dbUser, err => {
            if (err) next(err);
            else res.redirect('/');
          });

          // redirect to login
          res.redirect('/');
        })
        .catch(err => {
          next(err);
        });
    }
  });
});


router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/logout', (req, res, next) => {
  // passport
  req.logout();
  res.redirect('/');
});

module.exports = router;