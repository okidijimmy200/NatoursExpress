

const express = require('express')

// importing tour controllers
const tourController = require('../controllers/tourControler')

// using multiple routes
const router = express.Router()
// --import the protection middleware
const authController = require('../controllers/authController')

const reviewController = require('../controllers/reviewController')
const reviewRouter = require('../routes/reviewRoutes')

// using param routes
// val is the value of parameter in question
// router.param('id', tourController.checkID)

// using the review router in tour
router.use(':/tourId/reviews',  reviewRouter)

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

// --router for stats
router.route('/tour-stats').get(tourController.getTourStats)
// --router to get busiest month,we need to pass the year
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan)
// specifying the route we want


router
    .route('/')
    .get(authController.protect, tourController.getAllTours) //protecting the getAlltours route
    // implementing multiple requests on the tour
    .post(tourController.createTour);

// other routes
// to implement the tour controller
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect,
         authController.restrictTo('admin', 'lead-guide'), //admin can delete lead-tour and also delete tour guide
         tourController.deleteTour)


///////////////////////////////////////////////////////////
/////////////nested routes
//POST /tour/id/reviews
//GET /tour/id/reviews
//GET /tour/id/reviews/id_of_reviews

router
    .route('/:tourId/reviews')
    .post(
        authController.protect, 
        authController.restrictTo('user'),
        reviewController.createReview
)
module.exports = router


