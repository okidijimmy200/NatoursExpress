const express = require('express')

const reviewController = require('../controllers/reviewController')

// require authCOntroller
const authController = require('../controllers/authController')
const Review = require('../models/reviewModel')

const router = express.Router({mergeParams: true})  //to get access to other router in the tour

// --we want only logged in users to post reviews and also regular users not tour guides
//POST /tour/id/reviews
//GET /tour/id/reviews
//GET /tour/id/reviews/id_of_reviews
// --all these routes get into the review handler
router.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.protect, 
    authController.restrictTo('user'), 
    reviewController.setTourUserIds, //middleware for checking if user and tour id exists
    reviewController.createReview)



router.route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview)
module.exports = router