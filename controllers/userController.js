// --import catchAsync
const catchAsync = require('../utils/catchAsync')
// importing the tour model
const User = require('../models/userModel')
// creating a function for users
exports.getAllUsers = catchAsync(async(req, res, next) => {

    const users = await User.find();
    // send back all the users
    res.status(200).json({
        status: 'success',
        // sending requestTime to tour
        // requestedAt: req.requestTime,
        // to have results of array(this shows us the number of items available)
        results: users.length,
        data:{
            // this contains the response tht we want to send
            users
        }
    })
})

exports.getUser = (req, res) => {
    // 500 --server error
    res.status(500).json({
        status:'error',
        message:'this route is not yet defined'
    })
}
exports.createUser = (req, res) => {
    // 500 --server error
    res.status(500).json({
        status:'error',
        message:'this route is not yet defined'
    })
}
exports.updateUser = (req, res) => {
    // 500 --server error
    res.status(500).json({
        status:'error',
        message:'this route is not yet defined'
    })
}
exports.deleteUser = (req, res) => {
    // 500 --server error
    res.status(500).json({
        status:'error',
        message:'this route is not yet defined'
    })
}
