const express = require('express')

const reviewController = require('../controllers/reviewController')

// require authCOntroller
const authController = require('../controllers/authController')

const router = express.Router()

// --we want only logged in users to post reviews and also regular users not tour guides
router.route('/')
.get(reviewController.getAllReviews)
.post(
    authController.protect, 
    authController.restrictTo('user'), 
    reviewController.createReview)


module.exports = router