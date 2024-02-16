const express = require('express')
const router = express.Router()
const { protect } = require('../Middleware/authMiddleware')
const { getAllAccountType, getAddNewAccountType, getDeleteAccountType } = require('../Controllers/accountTypeController')

router.get('/getAllAccType', getAllAccountType)
router.post('/addNewAccType', getAddNewAccountType)
router.post('/addDeleteAccType', getDeleteAccountType)


module.exports = router