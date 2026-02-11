const express = require('express')
const createController = require('../../controllers/createController')

const router = express.Router()

// master
router.post('/master',createController.master)

// import
router.post('/import',createController.import)

module.exports = router



