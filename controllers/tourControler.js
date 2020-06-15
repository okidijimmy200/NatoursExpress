const express = require('express')

// importing the tour model
const Tour = require('../models/tourModel ')
const { query } = require('express')

// reading data from tours
// we use JSON.parse to pass an array of JS objects
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'UTF-8')
// );


// creating a new function for tours
exports.getAllTours = async (req, res) => {

    try {
        console.log(req.query)
        // BUILD THE QUERY
        // 1) Filtering
        const queryObj= {...req.query}
        // array of fields to exclude
        const excludedFields= ['page', 'sort', 'limit', 'fields']
        // --removing fields from queryObj
        excludedFields.forEach(el => delete queryObj[el])

        
          // checking out request tours middleware
    // console.log(req.requestTime)
    // --reading data from documents
    // --querying using filtering

    // 2) Advanced filtering
    
        // -----implementing the advanced query
        // {difficulty: 'easy', duration: {$gte: 5}}
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let query =  Tour.find(JSON.parse(queryStr));
       

    // 3) SORTING
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(req.query.sort)
        // --sorting according to 2 different fields
        // sort('price ratingsAverage')
    }
    // --setting a default 
    else {
        // --sorting according to created last
        query = query.sort('-createdAt')
    }

    // 4) FIeld limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        // --this expects string like name, duration and price and will return only that
        query = query.select('name duration price')
    }
    // --setting the default
    else {
        // --excluding items we dont want
        query = query.select('-__v')
    }
     //EXEUTE THE QUERY
        // --if we use await, thereis no way to perform sorting or pagination
        const tours = await query

       
    // const tours = await Tour.find({
    //     duration: 5,
    //     difficulty: 'easy'
    // });
    // --second way of writing query
    // const tours = await Tour.find()
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy');




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
    }
    catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
  
    
}
// creating function for getTour
exports.getTour =  async (req, res) => {
    try {
       const tour = await Tour.findById(req.params.id)
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
    
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
    // request params is where all the variables of the parameter are stored
    // console.log(req.params);
    // converting string of id into numbers(pure JS)
    const id = req.params.id * 1;
    
    // getting the tours with the id
    // const tour = tours.find(el => el.id === id)


  
}
// function for creating a request
exports.createTour = async (req, res) => {
    // to catch errors
    try {
          // creating a tour with data from body
    const newTour = await Tour.create(req.body);

    // when file is written, 201 stands for created
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    })
    } catch (err) {
        // when an error happens
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
 
}
// update tour function
exports.updateTour = async (req, res) => {
    try {
        // querying document we want to update based on id
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
         // incase the id is valid
    // use the param middleware
    res.status(200).json({
        status: 'success',
        data: {
            // we will send an updated string for tour
            tour
        }
    })
    }
    catch (err) {
          // when an error happens
          res.status(400).json({
            status: 'fail',
            message: err
        })
    }
   
}
// delete tour function
exports.deleteTour = async (req, res) => {
    try {
        // in restapi, no data is sent to client wen there is a delete, so no need for variable
        await Tour.findByIdAndDelete(req.params.id)
        // incase the id is valid
    // use the param middleware
    // 204--means no content so we sent data as null
    res.status(204).json({
        status: 'success',
        data: null
    })
    }
    catch(err) {
          // when an error happens
          res.status(400).json({
            status: 'fail',
            message: err
        })
    }

    
}