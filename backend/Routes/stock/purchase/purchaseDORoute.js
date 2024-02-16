const express = require('express')
const router = express.Router()
const { protect } = require('../../../Middleware/authMiddleware')
const { getSuppliers, getItems, getUnits, getNewDONO, getCurrency, AddNewRecord, SaveMasterRecord } = require('../../../Controllers/stock/Purchase/purchaseDoController')

router.get('/getNewDONO', protect, getNewDONO)
router.get('/getPOSuppliers', getSuppliers)
router.get('/getPOItems', getItems)
router.get('/getPOUnits', getUnits)
router.get('/getPOCurrency', getCurrency)
router.post('/addPONewRecord', AddNewRecord)
router.post('/addPOMasterecord', SaveMasterRecord)


module.exports = router