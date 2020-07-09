const express = require('express');
const router = express.Router();

//Documentation for Swagger https://github.com/fliptoo/swagger-express 
// access -> http://localhost:3000/api-docs
/**
 * @swagger
 * /:
 *  get:
 *    description: use to request home page  
 *       
 */


router.get('/', (req, res, next) => {
  res.render('index', { user: req.user });
});


module.exports = router;
