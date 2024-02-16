const express = require('express')
const router = express.Router()
const { protect } = require('../Middleware/authMiddleware')
const { getAllCities, getAddNewCity, getDeleteCity } = require('../Controllers/citiesController')

router.get('/getAllCities', getAllCities)
router.post('/getAddNewCity', getAddNewCity)
router.post('/getDeleteCity', getDeleteCity)


module.exports = router