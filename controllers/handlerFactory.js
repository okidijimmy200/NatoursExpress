const { Model } = require("mongoose");
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');
const { model } = require("../models/userModel");

exports.deleteOne = Model => 
    catchAsync(async (req, res, next) => { //func to delete tours, reviews and users and other docs
    // in restapi, no data is sent to client wen there is a delete, so no need for variable
        const doc =   await Model.findByIdAndDelete(req.params.id)

 
    //    --implemet if no tour, create error
    if(!doc) {
        // --middeware to apperror
        return next(new AppError('No document found found with that ID', 404));
    }
    // incase the id is valid
    // use the param middleware
    // 204--means no content so we sent data as null
    res.status(204).json({
        status: 'success',
        data: null
    })


})




// update function
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    // querying document we want to update based on id
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    
//    --implemet if no doc, create error
if(!doc) {
    // --middeware to apperror
    return next(new AppError('No document found found with that ID', 404));
}
     // incase the id is valid
// use the param middleware
res.status(200).json({
    status: 'success',
    data: {
        // we will send an updated string for doc
       data: doc
    }
})


})

// creating one
exports.createOne = Model => catchAsync(async (req, res, next) => {
    
    const doc = await Model.create(req.body);
  
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });