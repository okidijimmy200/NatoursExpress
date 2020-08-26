// --import catchAsync
const catchAsync = require('../utils/catchAsync')
// importing the tour model
const User = require('../models/userModel')
const multer = require('multer')
// import app error
const AppError = require('../utils/appError')
// --import handlerFactory
const factory = require('./handlerFactory')
const uniqueValidator = require('mongoose-unique-validator')

const sharp = require('sharp');

// --multer storage
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => //destination is a callback tht has access to the req, currently uploaded file and to a callback function
//     {
//         cb(null, 'public/img/users' ) //cb---callback
//     },
//     filename: (req, file, cb) => {
//         // --user id
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
//     }
// })

// multer storage(to store image as a buffer)
const multerStorage = multer.memoryStorage()

// --creating a multer filter
const multerFilter = (req, file, cb) => {
    // --test if uploaded file is an image
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false)
    }
}

// configure multer upload
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadUserPhoto = upload.single('photo');

// --performing image processing
exports.resizeUserPhoto =catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    // when doing image processing like this,store it in the memory
    // (call the sharp to create object to perform multipleimage processing)
    await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/users/${req.file.filename}`)

    next();

    
})
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

    // --update photo
    // 1) create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password update. please use /updateMyPassword', 400))
    }


    // 3) filter out unwanted fields names that are not allowedto be updated
    const filteredBody = filterObj(req.body, 'name', 'email' ) // fields we can update
    
    // --saving image name to database
    if(req.file) filteredBody.photo = req.file.filename
    // 3)Update user document
    // --here we use findbyid and updte, x is the data to update
    
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        // new: true,
        // runValidators: true
        new: true,
        uniqueValidator: true,
        context: 'query'
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



