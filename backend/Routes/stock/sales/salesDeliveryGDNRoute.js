const express = require('express')
const router = express.Router()
const { protect } = require('../../../Middleware/authMiddleware')
const { getDONO, getNewDCNO, dataForBarCode, AddNewRecord, deleteRecord, SaveMasterRecord, getDONODetail } = require('../../../Controllers/stock/sales/salesDeliveryGDNController')

router.get('/getNewDCNO', protect, getNewDCNO)
router.get('/getSDDONO', getDONO)
router.get('/getSDDONODetail', getDONODetail)
router.get('/getBarCodeDetail', dataForBarCode)
router.post('/addSDNewRecord', AddNewRecord)
router.post('/deleteSDNewRecord', deleteRecord)
router.post('/addSDMasterecord', SaveMasterRecord)


module.exports = router