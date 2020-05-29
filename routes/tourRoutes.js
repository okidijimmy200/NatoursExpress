const express = require('express')

// importing tour controllers
const tourController = require('./../controllers/tourControler')

// using multiple routes
const router = express.Router()

// using param routes
// val is the value of parameter in question
// router.param('id', tourController.checkID)

// specifying the route we want
router
    .route('/')
    .get(tourController.getAllTours)
    // implementing multiple requests on the tour
    .post(tourController.checkBody,tourController.createTour);

// other routes
// to implement the tour controller
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

module.exports = router
