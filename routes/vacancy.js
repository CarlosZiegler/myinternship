const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const DbConnection = require('../configs/db.config');
const Vacancy = require('../models/Vacancy')
const User = require('../models/User')
const { loginCheck } = require('./middlewares')

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
router.get('/vacancy/create', loginCheck(), async (req, res, next) => {
  if (req.user.role !== 'company') {
    return res.redirect("/vacancies");
  }
  res.render('vacancy/addVacancy', { user: req.user });
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
router.post('/vacancy/create', loginCheck(), async (req, res, next) => {

  if (req.user.role !== 'company') {
    return res.redirect("/vacancies");
  }

  const {
    title,
    description,
    category,
    tags,
    location,
    companyId = req.user._id,
    contract,
    applications = []
  } = req.body

  try {
    const result = await Vacancy.create({
      title,
      description,
      category,
      tags: tags.split(','),
      location,
      companyId,
      contract,
      applications
    })
    return res.redirect("/vacancies");
  } catch (error) {
    console.log(error)
  }
});

/**
 * @swagger
 * /vacancy/details/:id :
 *  get:
 *    description: render details page of Vacancy id
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.get('/vacancy/details/:id', loginCheck(), async (req, res, next) => {
  const { id } = req.params
  try {
    const vacancy = await Vacancy.findById(id).populate('companyId')
    return res.render("vacancy/detailsVacancy", { vacancy, user: req.user });
  } catch (error) {
    console.log(error)
  }
});

/**
 * @swagger
 * /vacancies:
 *  get:
 *    description: render list of Vacancies
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.get('/vacancies', loginCheck(), async (req, res, next) => {
  try {

    if (req.user.role === "company") {
      const vacancies = await Vacancy.find({ companyId: req.user._id }).populate('companyId')
      const uniqueCategories = [... new Set(vacancies.map(item => item.category.toLowerCase()))]
      const uniqueLocations = [... new Set(vacancies.map(item => item.location.toLowerCase()))]
      return res.render("vacancy/listVacancies", { vacancies: vacancies, user: req.user, uniqueCategories, uniqueLocations });
    } else {
      const vacancies = await Vacancy.find().populate('companyId')
      const uniqueCategories = [... new Set(vacancies.map(item => item.category.toLowerCase()))]
      const uniqueLocations = [... new Set(vacancies.map(item => item.location.toLowerCase()))]
      return res.render("vacancy/listVacanciesPersonal", { vacancies: vacancies, uniqueCategories, uniqueLocations, user: req.user });
    }

  } catch (error) {
    console.log(error)
  }
});
/**
 * @swagger
 * /vacancies:
 *  get:
 *    description: render list of Vacancies
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.get('/myvacancies', loginCheck(), async (req, res, next) => {
  try {

    if (req.user.role === "company") {
      res.redirect('/vacancies')
    } else {
      const [{ vacancies }] = await User.find({ _id: req.user._id }).populate('vacancies')
      console.log(vacancies)
      let uniqueCategories
      let uniqueLocations

      if (vacancies) {
        uniqueCategories = [... new Set(vacancies.map(item => item.category))]
        uniqueLocations = [... new Set(vacancies.map(item => item.location))]
      }
      return res.render("vacancy/listVacanciesPersonal", { vacancies: vacancies, uniqueCategories, uniqueLocations, user: req.user });
    }

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
router.post('/vacancy/delete/:id', loginCheck(), async (req, res, next) => {
  if (req.user.role !== 'company') {
    return res.redirect("/vacancies");
  }
  const { id } = req.params
  try {
    const result = await Vacancy.findByIdAndDelete(id)
    return res.redirect("/vacancies");
  } catch (error) {
    console.log(error)
  }
});

/**
 * @swagger
 * /vacancy/edit/:id:
 *  put:
 *    description: edit vacancy by ID
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.post('/vacancy/edit/:id', loginCheck(), async (req, res, next) => {
  if (req.user.role !== 'company') {
    return res.redirect("/vacancies");
  }
  const { id } = req.params
  const {
    title,
    description,
    category,
    tags,
    location,
    contract,
  } = req.body

  try {
    const result = await Vacancy.findByIdAndUpdate(id, {
      title,
      description,
      category,
      tags,
      location,
      contract,
    })
    console.log(result)
    return res.redirect("/vacancies");
  } catch (error) {
    console.log(error)
  }
});
/**
 * @swagger
 * /vacancies/filters:
 *  get:
 *    description: render vacancies page with filters
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.get('/vacancies/filters', loginCheck(), async (req, res, next) => {

  const { title = "", category = "", tags = "", location = "" } = req.query
  const filters = { title, category, location }
  let query;
  try {
    if (req.user.role === "company") {
      query = { companyId: req.user._id, title: { $regex: `^${title}.*`, $options: 'si' }, category: { $regex: `^${category}.*`, $options: 'si' }, location: { $regex: `^${location}.*`, $options: 'si' } }
    } else {
      query = { title: { $regex: `^${title}.*`, $options: 'si' }, category: { $regex: `^${category}.*`, $options: 'si' }, location: { $regex: `^${location}.*`, $options: 'si' } }
    }

    const vacancies = await Vacancy.find(query)
    const uniqueCategories = [... new Set(vacancies.map(item => item.category))]
    const uniqueLocations = [... new Set(vacancies.map(item => item.location))]
    if (req.user.role !== "company") {
      return res.render("vacancy/listVacanciesPersonal", { vacancies: vacancies, uniqueCategories, uniqueLocations, filters, user: req.user });
    } else {
      return res.render("vacancy/listVacancies", { vacancies: vacancies, uniqueCategories, uniqueLocations, filters, user: req.user });
    }
  } catch (error) {
    console.log(error)
  }
});
/**
 * @swagger
 * /vacancy/edit/:id:
 *  get:
 *    description: render edit page vacancy by ID
 *    responses:
 *       '200': 
 *       description: Successfully   
 *       
 */
router.get('/vacancy/edit/:id', loginCheck(), async (req, res, next) => {
  if (req.user.role !== 'company') {
    return res.redirect("/vacancies");
  }
  const { id } = req.params

  try {
    const result = await Vacancy.findByIdAndUpdate(id)
    return res.render("vacancy/editVacancy", { vacancy: result });
  } catch (error) {
    console.log(error)
  }
});

module.exports = router;
