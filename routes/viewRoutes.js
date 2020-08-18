const express = require('express')
const viewController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

const router = express.Router()

router.get('/', viewController.getOverview)
// for specific tour
router.get('/tour/:slug',authController.protect, viewController.getTour)
// login route
router.get('/login', viewController.getLoginForm)

module.exports = router