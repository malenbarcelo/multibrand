const express = require('express')
const getController = require('../../controllers/getController')

const router = express.Router()

// master
router.get('/master',getController.master)

// prices lists
router.get('/prices-lists-to-print',getController.pricesListsToPrint)

// data
router.get('/suppliers',getController.suppliers)
router.get('/measurement-units',getController.measurementUnits)

// imports
router.get('/imports',getController.imports)



module.exports = router



