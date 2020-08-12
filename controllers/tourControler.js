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


