const express = require('express')
const composedController = require('../../controllers/composedController')

const router = express.Router()

// session
router.get('/get-branch',composedController.getBranch)

// master
router.post('/get-master',composedController.getMaster)
router.post('/download-master',composedController.downloadMaster)

// prices lists
router.post('/print-excel',composedController.printExcel)
router.post('/print-pdf',composedController.printPdf)
router.post('/print-erp',composedController.printErp)

// imports
router.get('/get-new-po-number',composedController.getPoNumber)
router.post('/download-purchase-order',composedController.downloadPoExcel)

// currencies exchanges
router.get('/get-last-currencies-exchanges',composedController.getLastCurrenciesExchanges)

module.exports = router



