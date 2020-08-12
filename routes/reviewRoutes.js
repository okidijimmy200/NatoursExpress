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


// --protecting reviews
router.use(authController.protect)

router.route('/')
.get(reviewController.getAllReviews)
.post( 
    authController.restrictTo('user'), 
    reviewController.setTourUserIds, //middleware for checking if user and tour id exists
    reviewController.createReview)



router.route('/:id')
    .get(reviewController.getReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview) //restricted to user & admin
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview) //restricted to user & admin
module.exports = router