const express = require('express')
const router = express.Router()
const { getTableData, BarCode_Production, deleteRecord, addNewRecord, getMachines } = require('../../../Controllers/Reports/Production/productionController')

router.get('/tableData', getTableData)
router.get('/ProductionSticker', BarCode_Production)
router.post('/deleteRecord', deleteRecord)
router.post('/addNewRecord', addNewRecord)
router.get('/getMachines', getMachines)

module.exports = router