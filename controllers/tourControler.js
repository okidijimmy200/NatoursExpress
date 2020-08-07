// const express = require('express')

// --calling apifeatures
const APIFeatures = require('../utils/apiFeatures')

// importing the tour model
const Tour = require('../models/tourModel ')
// const { query } = require('express')
// --import catchAsync
const catchAsync = require('../utils/catchAsync')

// --importing apperror
const AppError = require('../utils/appError')
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
exports.getAllTours = catchAsync(async (req, res, next) => {

   
        console.log(req.query)
   
     //EXEUTE THE QUERY
        // --if we use await, thereis no way to perform sorting or pagination
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate()
        const tours = await features.query

    //SEND RESPONSE
    // send back all the tours
    res.status(200).json({
        status: 'success',
        // sending requestTime to tour
        // requestedAt: req.requestTime,
        // to have results of array(this shows us the number of items available)
        results: tours.length,
        data:{
            // this contains the response tht we want to send
            tours
        }
    })    
   
  
    
})
// creating function for getTour
exports.getTour =  catchAsync(async (req, res, next) => {
    //add populate to query and field to populate from our models
    // const tour = await Tour.findById(req.params.id).populate('guides')
    // --we can also create object for populate fn
    const tour = await Tour.findById(req.params.id)

    //    --implemet if no tour, create error
    if(!tour) {
        // --middeware to apperror
        return next(new AppError('No tour found found with that ID', 404));
    }
   
    //    --similar to
    // Tour.findOne({_id: req.params.id})

         // send back all the tours
    res.status(200).json({
        status: 'success',
        data:{
            // this contains the response tht we want to send
            tour
        }
    })
  
})


// --the catch async function is passed into fn wch is the functin above
exports.createTour = catchAsync(async (req, res, next) => {
    
    const newTour = await Tour.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  });

// update tour function
exports.updateTour = catchAsync(async (req, res, next) => {
        // querying document we want to update based on id
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        
    //    --implemet if no tour, create error
    if(!tour) {
        // --middeware to apperror
        return next(new AppError('No tour found found with that ID', 404));
    }
         // incase the id is valid
    // use the param middleware
    res.status(200).json({
        status: 'success',
        data: {
            // we will send an updated string for tour
            tour
        }
    })

   
})
// delete tour function
exports.deleteTour = catchAsync(async (req, res, next) => {
        // in restapi, no data is sent to client wen there is a delete, so no need for variable
     const tour =   await Tour.findByIdAndDelete(req.params.id)

     
    //    --implemet if no tour, create error
    if(!tour) {
        // --middeware to apperror
        return next(new AppError('No tour found found with that ID', 404));
    }
        // incase the id is valid
    // use the param middleware
    // 204--means no content so we sent data as null
    res.status(204).json({
        status: 'success',
        data: null
    })

    
})
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


