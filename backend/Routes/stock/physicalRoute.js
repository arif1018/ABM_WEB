const express = require('express')
const router = express.Router()
const { dataForBarCode, dataForBarCodeOld, AddNewRecord, dataForDataTable } = require('../../Controllers/stock/physicalController')

router.get('/IDF_Audit', dataForBarCode)
router.get('/IDFOld_Audit', dataForBarCodeOld)
router.get('/PA_getData', dataForDataTable)
router.post('/add_A_R', AddNewRecord)

module.exports = router