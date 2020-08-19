const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync')
// --import handlerFactory
const factory = require('./handlerFactory')




exports.setTourUserIds = (req, res, next) => {
     //allow nested routes, if we didnt specify the req.tour.body, then we allow it to come in
     if(!req.body.tour) req.body.tour = req.params.tourId // for tour
     if(!req.body.user) req.body.user = req.user.id; // if no req.body.user, then the body shd be req.body.user
     next()
}

// --getting all reviews
exports.getAllReviews = factory.getAll(Review)
// getting one review
exports.getReview = factory.getOne(Review)
//creating new review
exports.createReview = factory.createOne(Review)
// --update review
exports.updateReview = factory.updateOne(Review)
// --to implement the delete of reviews  
exports.deleteReview = factory.deleteOne(Review)
