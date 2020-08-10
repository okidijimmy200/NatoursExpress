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

//creating new review
exports.createReview = catchAsync(async(req, res, next) => {
    //allow nested routes, if we didnt specify the req.tour.body, then we allow it to come in
    if(!req.body.tour) req.body.tour = req.params.tourId // for tour
    if(!req.body.user) req.body.user = req.user.id; // if no req.body.user, then the body shd be req.body.user
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    })

})

// --to implement the delete of reviews  
exports.deleteReview = factory.deleteOne(Review)