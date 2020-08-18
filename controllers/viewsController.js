const Tour = require('../models/tourModel ')
const catchAysnc = require('../utils/catchAsync')


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

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    })
}