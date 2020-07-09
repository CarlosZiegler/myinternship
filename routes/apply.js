const express = require('express');
const router = express.Router();
const Vacancy = require('../models/Vacancy');
const { loginCheck } = require('./middlewares');

router.post('/vacancy/apply', loginCheck(), async (req, res, next) => {
  console.log("POST")
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

  if (req.user.role === 'company') {
    return res.redirect("/vacancies");
  }
  console.log(vacancyId, "ID")
  try {
    const vacancy = await Vacancy.findById(vacancyId).populate('companyId')
    return res.render("apply/vacancyApply", { vacancy: vacancy, user: req.user });
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;