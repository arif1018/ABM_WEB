const express = require('express')
const router = express.Router()
const { protect } = require('../Middleware/authMiddleware')
const { getAllTransactions, getTransactionsAddressWise, updatedReceiverStatus, getTransID, AddNewRecord } = require('../Controllers/transactionsController')

router.get('/getTransID', protect, getTransID)
router.get('/getAllTransactions', getAllTransactions)
router.get('/getTransactionsAddressWise', getTransactionsAddressWise)
router.post('/updatedReceiverStatus', updatedReceiverStatus)
router.post('/addTRNewRecord', AddNewRecord)


module.exports = router