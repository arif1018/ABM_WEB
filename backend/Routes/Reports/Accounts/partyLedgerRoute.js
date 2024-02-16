const express = require('express')
const router = express.Router()
const { getData } = require('../../../Controllers/Reports/Accounts/partyLedger')

router.get('/getData', getData)

module.exports = router