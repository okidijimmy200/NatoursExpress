const fs = require('fs')
const express = require('express')

// reading data from tours
// we use JSON.parse to pass an array of JS objects
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'UTF-8')
);


// param middleware for checkID
exports.checkID = (req, res, next, val) => {
    
// incase one sends for id of 2 items yet specified one, we use id.length
    // if (!tour) ---one way of checking tours
     if (req.params.id * 1 > tours.length){
        console.log(`Tour id is: ${val}`);
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }
    // call the middleware
    next()
}

// middleware for checking the body Checkbody
exports.checkBody = (req, res, next) => {
    
    // check incase there is no body or price
         if (!req.body.name || !req.body.price){
            
            return res.status(400).json({
                status:'fail',
                message:'Missing name or Price'
            });
        }
        // call the middleware
        next();
    }

// creating a new function for tours
exports.getAllTours =  (req, res) => {
    // checking out request tours middleware
    console.log(req.requestTime)
    
    // send back all the tours
    res.status(200).json({
        status: 'success',
        // sending requestTime to tour
        requestedAt: req.requestTime,
        // to have results of array(this shows us the number of items available)
        results: tours.length,
        data:{
            // this contains the response tht we want to send
            tours
        }
    })
    
}
// creating function for getTour
exports.getTour =  (req, res) => {
    // request params is where all the variables of the parameter are stored
    console.log(req.params);
    // converting string of id into numbers(pure JS)
    const id = req.params.id * 1;
    
    // getting the tours with the id
    const tour = tours.find(el => el.id === id)


    // send back all the tours
    res.status(200).json({
        status: 'success',
        data:{
            // this contains the response tht we want to send
            tour
        }
    })
    
}
// function for creating a request
exports.createTour =  (req, res) => {
    
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    // push tours into tours section array
    tours.push(newTour)

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // when file is written, 201 stands for created
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
    
}
// update tour function
exports.updateTour = (req, res) => {
    // incase the id is valid
    // use the param middleware
    res.status(200).json({
        status: 'success',
        data: {
            // we will send an updated string for tour
            tour: '<Updated Tour...>'
        }
    })
}
// delete tour function
exports.deleteTour = (req, res) => {
    // incase the id is valid
    // use the param middleware
    // 204--means no content so we sent data as null
    res.status(204).json({
        status: 'success',
        data: null
    })
}