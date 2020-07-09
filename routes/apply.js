const express = require('express');
const router = express.Router();
const Vacancy = require('../models/Vacancy');
const { loginCheck } = require('./middlewares');

router.post('/apply', loginCheck(), async (req, res, next) => {
  const title = req.body.title;
  const email = req.body.userEmail;
  const content = req.body.content;
  console.log("POST", title, email, content)
});

/**
 * @swagger
 * /vacancy/:id:
 *  get:
 *    description: render details page of Vacancy id
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.get('/apply/:id', loginCheck(), async (req, res, next) => {
  const vacancyId = req.params.id;
  console.log(req.user)
  if (req.user.role === 'company') {
    return res.redirect("/vacancies");
  }
  
  try {
    const vacancy = await Vacancy.findById(vacancyId).populate('companyId')
    return res.render("apply/vacancyApply", { vacancy: vacancy, user: req.user });
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;