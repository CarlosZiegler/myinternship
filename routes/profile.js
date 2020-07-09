const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DbConnection = require('../configs/db.config');
const User = require('../models/User')
const { loginCheck } = require('./middlewares')

//Documentation for Swagger https://github.com/fliptoo/swagger-express 

/**
 * @swagger
 * /profile :
 *  get:
 *    description: render profile details 
 *       
 */

router.get('/profile', (req, res) => {
  res.render('profile/details', { user: req.user } );
});

/**
 * @swagger
 * /profile/update :
 *  post:
 *    description: update profile details
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */

router.post('/profile/update', loginCheck(), async (req, res, next) => {
  const {username, displayName, email} = req.body;

  try {
    const result = await User.findOneAndUpdate({_id: req.user._id} , {username, displayName, email} )
    console.log(result)
    res.redirect("/vacancies")
  } catch (error){
    console.error(error)
  }
});


module.exports = router;