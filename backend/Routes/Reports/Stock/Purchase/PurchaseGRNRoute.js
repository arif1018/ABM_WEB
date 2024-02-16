const express = require('express')
const router = express.Router()
const { protect } = require('../../../../Middleware/authMiddleware')
const { getMasterData, updatedEditStatus, BarCode_GRN } = require('../../../../Controllers/Reports/Stock/Purchase/PurchaseGRNMasterController')

router.get('/DataMasterTable', protect, getMasterData)
router.get('/updateEditStatusGRN', updatedEditStatus)
router.get('/getDataForBarCode', BarCode_GRN)


module.exports = router