// --import catchAsync
const catchAsync = require('../utils/catchAsync')
// importing the tour model
const User = require('../models/userModel')

// import app error
const AppError = require('../utils/appError')
// --import handlerFactory
const factory = require('./handlerFactory')


///function to filter bodyobj
const filterObj =(obj, ...allowedFields) => {
    // --fileds to pass in to check if its an allowed fields
    const newObj = {}
    Object.keys(obj).forEach(el => {
        // el --current element
        if(allowedFields.includes(el)) newObj[el] = obj[el]
    })
    return newObj
}



//////////////////updating the currently authenticated User
exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password update. please use /updateMyPassword', 400))
    }


    // 3) filter out unwanted fields names that are not allowedto be updated
    const filteredBody = filterObj(req.body, 'name', 'email' ) // fields we can update
    // 3)Update user document
    // --here we use findbyid and updte, x is the data to update
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {

    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    })

})

exports.createUser = (req, res) => {
    // 500 --server error
    res.status(500).json({
        status:'error',
        message:'this route is not defined! Please use signup'
    })
}


// --user getMe function
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next();
}
// creating a function for users
exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
// donot update password with this
exports.updateUser =  factory.updateOne(User) // this is for only admin and only updating data tht is not password
exports.deleteUser = factory.deleteOne(User);