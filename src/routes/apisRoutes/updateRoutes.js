const express = require('express')
const updateController = require('../../controllers/updateController')

const router = express.Router()

// master
router.post('/master',updateController.master)

// import
router.post('/import',updateController.import)

module.exports = router



