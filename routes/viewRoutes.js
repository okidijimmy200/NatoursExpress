const express = require('express')
const viewController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

const router = express.Router()

router.get('/',authController.isLoggedIn, viewController.getOverview)
// for specific tour
router.get('/tour/:slug',authController.isLoggedIn, viewController.getTour)
// login route
router.get('/login',authController.isLoggedIn, viewController.getLoginForm)
// get account for signin users
router.get('/me', authController.protect, viewController.getAccount)

// route to submit the account form in pug
router.post('/submit-user-data', 
    authController.protect,
    viewController.updateUserData)
module.exports = router

