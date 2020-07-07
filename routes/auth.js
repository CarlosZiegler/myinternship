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
 *    description: use to request authentication signup page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */


router.get('/auth/signup', (req, res) => {
  res.render('auth/signup');
});

/**
 * @swagger
 * /:
 *  post:
 *    description: use to post authentication login page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */


router.post('/auth/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true,
  passReqToCallback: true
})
)

/**
 * @swagger
 * /:
 *  get:
 *    description: use to request github authentication page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */

// github authentication routing
router.get('/auth/github', passport.authenticate('github'));

/**
 * @swagger
 * /:
 *  get:
 *    description: use to callback github authentication page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */

router.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
})
);


/**
 * @swagger
 * /:
 *  get:
 *    description: use to request google authentication page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));



/**
 * @swagger
 * /:
 *  get:
 *    description: use to callback github authentication page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: 'auth/login'
}),
  function (req, res) {
    res.redirect('/');
  });

/**
 * @swagger
 * /:
 *  post:
 *    description: use to signup page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */

router.post('/auth/signup', (req, res, next) => {
  const { username, password } = req.body;

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
  } catch (error) {
    console.error("Error router signup", error)
  }
});

/**
 * @swagger
 * /:
 *  get:
 *    description: use to login page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */

router.get('/auth/login', (req, res) => {
  res.render('auth/login');
});

/**
 * @swagger
 * /:
 *  get:
 *    description: use to logout page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */

router.get('/auth/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;