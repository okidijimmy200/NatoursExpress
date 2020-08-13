const { Model } = require("mongoose");
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError');
const { model } = require("../models/userModel");
// --calling apifeatures
const APIFeatures = require('../utils/apiFeatures')


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
    return next(new AppError('No document found with that ID', 404));
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

///getOne factory
// --here we pass in the model and the option of populate
exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
//    --we will create a query and if there is a populate option, we will add it to the query then awaitt tht query
    let query = Model.findById(req.params.id)
    if(popOptions) query = query.populate(popOptions);   
    //add populate to query and field to populate from our models
    // const tour = await Tour.findById(req.params.id).populate('guides')
    // --we can also create object for populate fn
    const doc = await query

    //    --implemet if no doc, create error
    if(!doc) {
        // --middeware to apperror
        return next(new AppError('No document found with that ID', 404));
    }
   
    //    --similar to
    // doc.findOne({_id: req.params.id})

         // send back all the docs
    res.status(200).json({
        status: 'success',
        data:{
            // this contains the response tht we want to send
            data: doc
        }
    })
  
})

exports.getAll = Model => catchAsync(async (req, res, next) => {

//    for nested get reviews on tour
   let filter = {}
    if(req.params.tourId) filter = {tour: req.params.tourId}
    console.log(req.query)

 //EXEUTE THE QUERY
    // --if we use await, thereis no way to perform sorting or pagination
    const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    // adding an explain method
    const doc = await features.query
    // const doc = await features.query.explain()

//SEND RESPONSE
// send back all the doc
res.status(200).json({
    status: 'success',
    // sending requestTime to tour
    // requestedAt: req.requestTime,
    // to have results of array(this shows us the number of items available)
    results: doc.length,
    data:{
        // this contains the response tht we want to send
        data:doc
    }
})    



})