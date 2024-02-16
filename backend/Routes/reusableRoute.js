const express = require('express')
const router = express.Router()
const { dataForBarCode, getItems, getParties, getCurrency } = require('../Controllers/Reusable/reusableController')

router.get('/barCodeData', dataForBarCode)
router.get('/getItems', getItems)
router.get('/getParties', getParties)
router.get('/getCurrency', getCurrency)


module.exports = router