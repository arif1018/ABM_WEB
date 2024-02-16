const express = require('express')
const router = express.Router()
const { protect } = require('../../../../Middleware/authMiddleware')
const { getMasterData, updatedEditStatus } = require('../../../../Controllers/Reports/Stock/Sales/SalesGDNMasterController')

router.get('/DataMasterTable', protect, getMasterData)
router.get('/updateEditStatus', updatedEditStatus)

module.exports = router