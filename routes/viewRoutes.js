const express = require('express')
const viewController = require('../controllers/viewsController')

const router = express.Router()

router.get('/', viewController.getOverview)
// for specific tour
router.get('/tour/:slug',viewController.getTour)
// login route
router.get('/login', viewController.getLoginForm)

module.exports = router