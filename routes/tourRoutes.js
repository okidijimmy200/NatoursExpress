const express = require('express')

// importing tour controllers
const tourController = require('./../controllers/tourControler')

// using multiple routes
const router = express.Router()

// specifying the route we want
router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createTour);

// other routes
// to implement the tour controller
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour)

module.exports = router
