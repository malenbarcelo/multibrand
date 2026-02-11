const express = require('express')
const appController = require('../controllers/appController.js')

const router = express.Router()

// login
router.get('/',appController.login)
router.get('/login',appController.login)
router.post('/login',appController.loginProcess)
router.get('/logout',appController.logout)

// main menu
router.get('/menu',appController.selectBranch)
router.post('/set-branch',appController.setBranch)

// imports
router.get('/importaciones',appController.imports)

// masters
router.get('/maestro',appController.master)

module.exports = router


