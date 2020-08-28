const express = require('express')
const viewController = require('../controllers/viewsController')
const authController = require('../controllers/authController')
const bookingController = require('../controllers/bookingController');

const router = express.Router()

router.get('/',authController.isLoggedIn, bookingController.createBookingCheckout, viewController.getOverview)
// for specific tour
router.get('/tour/:slug',authController.isLoggedIn, viewController.getTour)
// login route
router.get('/login',authController.isLoggedIn, viewController.getLoginForm)
// get account for signin users
router.get('/me', authController.protect, viewController.getAccount)

router.get(
    '/my-tours',
    bookingController.createBookingCheckout,
    authController.protect,
    viewsController.getMyTours
  );

// route to submit the account form in pug
router.post('/submit-user-data', 
    authController.protect,
    viewController.updateUserData)
module.exports = router

