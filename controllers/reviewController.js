const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync')
// --import handlerFactory
const factory = require('./handlerFactory')


// --getting all reviews
exports.getAllReviews = catchAsync(async(req, res, next) => {
    let filter = {}
    if(req.params.tourId) filter = {tour: req.params.tourId} // here all the reviews matching the tourId will be matched
    const reviews = await Review.find(filter)

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    })
})

exports.setTourUserIds = (req, res, next) => {
     //allow nested routes, if we didnt specify the req.tour.body, then we allow it to come in
     if(!req.body.tour) req.body.tour = req.params.tourId // for tour
     if(!req.body.user) req.body.user = req.user.id; // if no req.body.user, then the body shd be req.body.user
     next()
}
//creating new review
exports.createReview = factory.createOne(Review)
// --update review
exports.updateReview = factory.updateOne(Review)
// --to implement the delete of reviews  
exports.deleteReview = factory.deleteOne(Review)