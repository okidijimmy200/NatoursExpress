const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync')


// --getting all reviews
exports.getAllReviews = catchAsync(async(req, res, next) => {
    const reviews = await Review.find()

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