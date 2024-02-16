const express = require('express')
const router = express.Router()
const { protect } = require('../../../Middleware/authMiddleware')
const { getSuppliers, getDONO, getItems, getNewDCNO, AddNewRecord, DeleteRecord, SaveMasterRecord } = require('../../../Controllers/stock/Purchase/PurchaseDlieveryGRNController')

router.get('/getNewDCNO', protect, getNewDCNO)
router.get('/getPDSuppliers', getSuppliers)
router.get('/getPDDONO', getDONO)
router.get('/getPOItems', getItems)
router.post('/addPDNewRecord', AddNewRecord)
router.post('/delPDNewRecord', DeleteRecord)
router.post('/addPDMasterecord', SaveMasterRecord)


module.exports = router