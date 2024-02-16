const express = require('express')
const router = express.Router()
const { stockGetAllStock, stockGetItemPartyWise, getAllItemName } = require('../../Controllers/stock/stockController')
const { getDataByBarCode, getDataForTable, addRecordNotAdded } = require('../../Controllers/stock/stockAdjustmentController')

router.get('/getallstock', stockGetAllStock)
router.get('/getallitemname', getAllItemName)
router.get('/partywise', stockGetItemPartyWise)
router.get('/getDataByBarCode', getDataByBarCode)
router.post('/addNewRecord', addRecordNotAdded)
router.get('/getDataForTable', getDataForTable)

module.exports = router