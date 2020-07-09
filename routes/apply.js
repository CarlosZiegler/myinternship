const express = require('express');
const router = express.Router();
const Vacancy = require('../models/Vacancy');
const User = require('../models/User')
const { loginCheck } = require('./middlewares');
const { sendEmail } = require('./helpers');
/**
 * @swagger
 * /apply/:
 *  post:
 *    description: render details page of Apply id
 *       
 */
router.post('/apply/send/:id', loginCheck(), async (req, res, next) => {
  const subject = req.body.subject;
  const email = req.body.email;
  const content = req.body.content;
  try {
    const response = await sendEmail(email, subject, content)
  } catch (error) {
    console.log(error)
  }

  const { id } = req.params
  try {
    const result = await User.findByIdAndUpdate(req.user._id, {
      $addToSet: {
        vacancies: id
      }
    })
    console.log(result)
    return res.redirect("/myvacancies");
  } catch (error) {
    console.log(error)
  }

});
/**
 * @swagger
 * /vacancy/:id:
 *  get:
 *    description: Successfully   
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