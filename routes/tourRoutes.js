

const express = require('express')

// importing tour controllers
const tourController = require('../controllers/tourControler')

// using multiple routes
const router = express.Router()
// --import the protection middleware
const authController = require('../controllers/authController')

// const reviewController = require('../controllers/reviewController')
const reviewRouter = require('../routes/reviewRoutes') // import reviewRouter and not reviewController

// using param routes
// val is the value of parameter in question
// router.param('id', tourController.checkID)

// using the review router in tour(mounting the reviewRouter)
router.use('/:tourId/reviews',  reviewRouter) //use review router incase it encounters a route like this


///////////////////////////////////////////////////////////
/////////////nested routes
//POST /tour/id/reviews
//GET /tour/id/reviews
//GET /tour/id/reviews/id_of_reviews

// router
//     .route('/:tourId/reviews')
//     .post(
//         authController.protect, 
//         authController.restrictTo('user'),
//         reviewController.createReview
// )

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)

// --router for stats
router.route('/tour-stats').get(tourController.getTourStats)
// --router to get busiest month,we need to pass the year
router.route('/monthly-plan/:year')
.get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan)
// specifying the route we want

// routes for geospatial
// --distance---ie 25okm, center--ur position, latlng--co-ordiantes 
// --unit--either km or miles this is a standard way of specifying urls with alot of options
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get( tourController.getToursWithin)
// we cld also have dne it like tours-within?distance=234&center=-50,45&unit=mi


// Geospatial Aggregation Calculating Distances
router.route('/distances/:latlng/unit/:unit')
    .get(tourController.getDistances)
router
    .route('/')
    .get( tourController.getAllTours) //protecting the getAlltours route
    // implementing multiple requests on the tour
    // --restricting changing and posting to lead guides and admin
    .post(authController.protect, 
        authController.restrictTo('admin', 'lead-guide'), 
        tourController.createTour);

// other routes
// to implement the tour controller
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTour)
    .delete(authController.protect,
         authController.restrictTo('admin', 'lead-guide'), //admin can delete lead-tour and also delete tour guide
         tourController.deleteTour)


module.exports = router


