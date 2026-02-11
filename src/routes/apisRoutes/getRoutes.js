const express = require('express')
const getController = require('../../controllers/getController')

const router = express.Router()

// master
router.get('/master',getController.master)

// data
router.get('/suppliers',getController.suppliers)
router.get('/measurement-units',getController.measurementUnits)

// imports
router.get('/imports',getController.imports)



module.exports = router



