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

exports.getTour =  (req,res) => {
    res.status(200).render('tour', {
        title: 'The forest hiker'
    })
}