const express = require('express')
const router = express.Router()
const { getMasterData } = require('../../../../Controllers/Reports/Stock/Purchase/PurchaseHistoryController')

router.get('/getMasterData', getMasterData)

module.exports = router