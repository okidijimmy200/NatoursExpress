const { Model } = require("mongoose");
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

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



// // delete tour function
// exports.deleteTour = catchAsync(async (req, res, next) => {
//         // in restapi, no data is sent to client wen there is a delete, so no need for variable
//      const tour =   await Tour.findByIdAndDelete(req.params.id)

     
//     //    --implemet if no tour, create error
//     if(!tour) {
//         // --middeware to apperror
//         return next(new AppError('No tour found found with that ID', 404));
//     }
//         // incase the id is valid
//     // use the param middleware
//     // 204--means no content so we sent data as null
//     res.status(204).json({
//         status: 'success',
//         data: null
//     })

    
// })