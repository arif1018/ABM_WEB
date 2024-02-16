const express = require('express')
const router = express.Router()
const { userLogin, userCreate, userGetAllUsers } = require('../Controllers/userController')

router.post('/login', userLogin)
router.get('/getallusers', userGetAllUsers)
router.post('/createuser',userCreate)

module.exports = router