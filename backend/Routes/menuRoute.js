const express = require('express')
const router = express.Router()
const { getParentMenu, getch, getChildMenu } = require('../Controllers/menuController')

router.get('/getparentmenu', getParentMenu)
router.get('/getchildmenu', getChildMenu)

// router.get('/getchildmenu', protect, getChildMenu)



module.exports = router