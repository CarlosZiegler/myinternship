const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

//Documentation for Swagger https://github.com/fliptoo/swagger-express 
// access -> http://localhost:3000/api-docs

/**
 * @swagger
 * /auth/signup:
 *  get:
 *    description: use to request authentication signup page      
 */
router.get('/auth/signup', (req, res) => {
  res.render('auth/signup');
});

/**
 * @swagger
 * /auth/login:
 *  post:
 *    description: use to post authentication login page     
 */
router.post('/auth/login', passport.authenticate('local', {

  successRedirect: '/vacancies',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true
})

)

/**
 * @swagger
 * /auth/github:
 *  get:
 *    description: use to request github authentication page      
 */
router.get('/auth/github', passport.authenticate('github'));

/**
 * @swagger
 * /:
 *  get:
 *    description: use to callback github authentication page      
 */
router.get('/auth/github/callback', passport.authenticate('github', {

  successRedirect: '/vacancies',
  failureRedirect: '/auth/login',
})

);


/**
 * @swagger
 * /auth/google:
 *  get:
 *    description: use to request google authentication page      
 */
router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

/**
 * @swagger
 * /auth/google/callback:
 *  get:
 *    description: use to callback github authentication page      
 */
router.get('/auth/google/callback', passport.authenticate('google', {

  failureRedirect: 'auth/login'
}),
  function (req, res) {
    res.redirect('/vacancies');

  });


/**
 * @swagger
 * /auth/linkedin:
 *  get:
 *    description: use to signup to linkedIn's authentication page     
 */

router.get('/auth/linkedin',
  passport.authenticate('linkedin'));

/**
 * @swagger
 * /auth/linkedin/callback:
 *  get:
 *    description: used to sign in to linkedIn's authentication callback      
 */
router.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/auth/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/vacancies');
  });

/**
 * @swagger
 * /auth/xing:
 *  get:
 *    description: use to signup to xing's authentication page      
 */
router.get('/auth/xing',
  passport.authenticate('xing'));

/**
 * @swagger
 * /auth/xing/callback:
 *  get:
 *    description: used to sign in to xing's authentication callback      
 */

router.get('/auth/xing/callback',
  passport.authenticate('xing', { failureRedirect: '/auth/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/vacancies');
  });


/**
 * @swagger
 * /auth/signup:
 *  post:
 *    description: use to signup page       
 */

router.post('/auth/signup', (req, res, next) => {
  const { username, password, role } = req.body;
  let avatarUrl;

  if (role === 'company') {
    avatarUrl = "https://images.unsplash.com/photo-1549399905-5d1bad747576?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=761&q=80"
  }

  if (password.length < 8) {
    res.render('auth/signup', {
      message: 'Your password must be 8 characters minimun.'
    });
    return;
  }
  try {
    User.findOne({ username: username }).then(found => {
      if (found !== null) {
        res.render('auth/signup', { message: 'Wrong credentials' });
      } else {
        // we can create a user with the username and password pair
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);

        User.create({ username: username, password: hash, role: role, displayName: username, avatarUrl })
          .then(dbUser => {
            // passport - login the user
            req.login(dbUser, err => {
              if (err) next(err);
              else res.redirect('/vacancies');
            });

            // redirect to login
            res.redirect('/auth/signin');
          })
          .catch(err => {
            next(err);
          });
      }
    });
  } catch (error) {
    console.error("Error router signup", error)
  }
});

/**
 * @swagger
 * /auth/login:
 *  get:
 *    description: use to login page     
 */

router.get('/auth/login', (req, res) => {
  res.render('auth/login');
});

/**
 * @swagger
 * /auth/logout:
 *  get:
 *    description: use to logout page      
 */

router.get('/auth/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;