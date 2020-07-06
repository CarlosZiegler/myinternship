const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DbConnection = require('../configs/db.config');
const Vacancy = require('../models/Vacancy')

//Documentation for Swagger https://github.com/fliptoo/swagger-express 

/**
 * @swagger
 * /vacancy/create:
 *  get:
 *    description: render create page with form to create new Vacancy
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.get('/vacancy/create', async (req, res, next) => {
  res.render('vacancy/addVacancy');
});

/**
 * @swagger
 * /vacancy/create:
 *  post:
 *    description: use to create new Vacancy
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.post('/vacancy/create', async (req, res, next) => {
  const {
    title,
    description,
    category,
    tags,
    location,
    companyId = mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
    contract,
    applications = []
  } = req.body

  try {
    const result = await Vacancy.create({
      title,
      description,
      category,
      tags,
      location,
      companyId,
      contract,
      applications
    })
    res.redirect("/vacancies");
  } catch (error) {
    console.log(error)
  }
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
router.get('/vacancy/details/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const vacancy = await Vacancy.findById(id)
    res.render("vacancy/detailsVacancy", { vacancy });
  } catch (error) {
    console.log(error)
  }
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
router.get('/vacancies', async (req, res, next) => {


  try {
    const vacancies = await Vacancy.find()
    res.render("vacancy/listVacancies", { vacancies });
  } catch (error) {
    console.log(error)
  }
});

/**
 * @swagger
 * /vacancy/delete/:id:
 *  delete:
 *    description: delete vacancy by ID
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.post('/vacancy/delete/:id', async (req, res, next) => {
  const { id } = req.params
  console.log(id)
  try {
    const result = await Vacancy.findByIdAndDelete(id)
    res.redirect("/vacancies");
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
