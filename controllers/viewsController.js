const Tour = require('../models/tourModel ')
const catchAysnc = require('../utils/catchAsync')
const appError = require('../utils/appError')
const User = require('../models/userModel')
const Booking = require('../models/bookingModel')
const uniqueValidator = require('mongoose-unique-validator')

exports.getOverview = catchAysnc( async(req,res) => {

    // get tour data from collection
    const tours = await Tour.find()
    // 2) build our template

    // 3) render template using tour data from 1
    res.status(200).render('overview', {
        tours
    })
})

exports.getTour =  catchAysnc(async(req,res, next) => {
    // 1) get the data for the requested tour including reviews and guides
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        fields: 'review rating user' 
    })

    // --incase of no tour
    if(!tour) {
        return next(new appError('There is no tour with that name', 404 ))
    }
    // 2) Build our template
    // 3) Render template using data from 1
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    })
    
})

// login controller
exports.getLoginForm = (req, res) => {
    // create login template
    res.status(200).render('login', {
        title: 'log into your account'
    })
}

// get accounts form
exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    })
}

  //signup users
exports.getSignupForm =  (req, res ) => {
      res.status(200).render('signup', {
          title: 'Signup to get an account'
      })
}

exports.getMyTours = catchAysnc(async (req, res, next) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });
  
    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });
  
    res.status(200).render('overview', {
      title: 'My Tours',
      tours
    });
  });



// --updateUserData
exports.updateUserData = catchAysnc(async(req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id, 
        {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        uniqueValidator: true,
        context: 'query'
    }
    )
    // --render the account page again with diff content
    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    })
})