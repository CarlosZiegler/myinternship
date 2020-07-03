const express = require('express');
const router = express.Router();

//Documentation for Swagger https://github.com/fliptoo/swagger-express 

/**
 * @swagger
 * /:
 *  get:
 *    description: use to request home page
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */


router.get('/', (req, res, next) => {
  res.send({ value: 200 });
});

/**
 * @swagger
 * /test/:id:
 *   post:
 *    description: use to request id
 *    parameters:
 *        - name: id
 *          description: Your id
 *          paramType: query
 *          required: true
 *          dataType: string
 *         
 */

router.post('/test/:id', (req, res, next) => {
  const id = req.params.id
  res.send({ id });
});

module.exports = router;
