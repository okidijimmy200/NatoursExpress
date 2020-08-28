const express = require('express')

const bookingController = require('../controllers/bookingController')

// require authCOntroller
const authController = require('../controllers/authController')

const router = express.Router()  //to get access to other router in the tour

router.use( authController.protect)
//route for client to get checkout session
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession)

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);
  
module.exports = router