// const express = require('express')


// importing the tour model
const Tour = require('../models/tourModel ')
// const { query } = require('express')
// --import catchAsync
const catchAsync = require('../utils/catchAsync')

// --importing apperror
const AppError = require('../utils/appError')

// --import handlerFactory
const factory = require('./handlerFactory')
// reading data from tours
// we use JSON.parse to pass an array of JS objects
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'UTF-8')
// );

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next();
}


// creating a new function for tours
exports.getAllTours = factory.getAll(Tour)
// creating function for getTour
exports.getTour = factory.getOne(Tour, {path: 'reviews'}) //path is the property we want to fields


// --the catch async function is passed into fn wch is the functin above
exports.createTour =factory.createOne(Tour)

// --update the tour
exports.updateTour = factory.updateOne(Tour)


exports.deleteTour = factory.deleteOne(Tour)
// --function to calculate statics for our tours
exports.getTourStats = catchAsync(async (req, res, next) => {

        const stats = await Tour.aggregate([
            // --we have the stages the documents pass
            // --match: filter some documents
            {   
                // --ratingsAverage greater thn 4.5
                $match: {ratingsAverage: { $gte: 4.5}}
            },
            // group-stage
            {
                // grouping helps us group documents using accumuate
                $group: {
                    // --id difficulty shows us the available tours according to difficulty
                    _id:'$difficulty',
                    // --placing to uppercase
                    // _id:{$toUpper:'$difficulty'},
                    // --selecting by rating
                    // _id:'$ratingsAverage',
                    numTours:{ $sum: 1 },
                    numRatings:{ $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage'},
                    avgPrice: { $avg: '$price' },
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'},
                }               
                
            },
            {
                // --sorting according to price from lowest
                $sort: { avgPrice: 1}
            },
            // {
            //     $match: {
            //         // ne--not easy
            //         _id: {$ne: 'easy'}
            //     }
            // }
        ]);
        // use the param middleware
    res.status(200).json({
        status: 'success',
        data: {
            // we will send an updated string for tour
           stats
        }
    })
   

})


//////////////IMPLEMENTING BUSINESS PLAN TO CALCULLATE BUSSIEST MONTH
exports.getMonthlyPlan = catchAsync(async( req, res,next) => {

    //    --define the year
    const year = req.params.year * 1 //2021

    // --create the plan variable
    const plan = await Tour.aggregate([
        {
            // --$unwind deconstructs an array field from input documents and output one document for each element of the array
            $unwind:'$startDates'
        },
        {
            // --to select documents
            $match:{
                // --date shd be greater thn 1st jan 2021 < 31st dec 2021
                startDates:{
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            },
            
        },
        {
            $group: {
                _id:{$month: '$startDates'},
                // --how many tours start in tht month
                numTourStarts: {$sum:1},
                tours: { $push: '$name' }
            }
        },
        {
            $addFields: {
                month: '$_id'
            }
        },
        {
            $project:{
                // --we make the id not show up
                _id: 0
            }
        },
        {
            $sort: { numTourStarts: -1 }
        },
        {
            //--to get 6 outputs
            $limit: 6 
        }
    ])

       // use the param middleware
       res.status(200).json({
        status: 'success',
        data: {
            // we will send an updated string for tour
           plan
        }
    })

        

})

// we cld also have dne it like tours-distance?distance=234&center=-50,45&unit=mi
// or tours-within/233/center/2.778244, 32.292192/units/mi
// for getToursWithin
exports.getToursWithin =  catchAsync(async(req, res, next) => {
    // to get all our data at once using destructuring
    const { distance, latlng, unit} = req.params //all this comes from req.params
    // var for lat and lng
    const [lat, lng] = latlng.split(',')

    // defining the radius wch is converted to radians wch we get by dividing our distance by radius of earth
    const radius = unit === 'mi' ? distance / 3962.3 : distance / 6378.1 // to get radian in km or miles

    // test if lat and lng is specified
    if(!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat, lng', 400))
    }
    // --we want to query for start location bse its where each tour starts
    // $geoWithin--finds docs within a certain geometry wch starts at given distance within a sphere of lat and lng
    const tours = await Tour.find({ 
        startLocation: {$geoWithin:
            // NB: we mst specify lng then lat not the standard lat and lng way
        {$centerSphere: [[lng,lat], radius]}} }) //specify filter obj

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    })
}
)

exports.getDistances = catchAsync( async (req, res, next) => {
    // to get all our data at once using destructuring
    const {latlng, unit} = req.params //all this comes from req.params
    // var for lat and lng
    const [lat, lng] = latlng.split(',')

    // convert to miles
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001 // /1000

    // test if lat and lng is specified
    if(!lat || !lng) {
        next(new AppError('Please provide latitude and longitude in the format lat, lng', 400))
    }
    
    // --performing the agg pipelinf
    const distances = await Tour.aggregate([
        {
            $geoNear: { //this is always the first stage
                near: { // pt to calc distances
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance', //where all calculated distance will be stored
                // making distance into km
                distanceMultiplier: multiplier  
            }
        },
        {
            // --fields we want tokeep
        $project: {
            distance: 1,
            name: 1
        }
        }
    ])
    
    res.status(200).json({
        status: 'success',
        data: {
            data: distances
        }
    })
})

