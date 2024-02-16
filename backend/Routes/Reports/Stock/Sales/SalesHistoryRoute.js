const express = require('express')
const router = express.Router()
const { getMasterData } = require('../../../../Controllers/Reports/Stock/Sales/SalesHistoryController')

router.get('/getMasterData', getMasterData)

module.exports = router