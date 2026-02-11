const express = require('express')
const updateController = require('../../controllers/updateController')

const router = express.Router()

// master
router.post('/master',updateController.master)

module.exports = router



