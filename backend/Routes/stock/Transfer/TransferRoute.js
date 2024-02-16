const express = require('express')
const router = express.Router()
const { protect } = require('../../../Middleware/authMiddleware')
const {  } = require('../../../Controllers/stock/Transfer/TransferController')

router.get('/getNewDCNO', protect, getNewDCNO)
// router.post('/addPDMasterecord', SaveMasterRecord)


module.exports = router