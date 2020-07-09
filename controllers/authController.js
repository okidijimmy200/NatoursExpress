const User = require('../models/userModel')
// --import catchAsync
const catchAsync = require('../utils/catchAsync')

// --import the Jwt
const jwt = require('jsonwebtoken')

// async bse we wil do some db operations
exports.signup = catchAsync(async(req, res, next) => {
    // creating newUser
    // const newUser = await User.create(req.body)
    // --we will use the 2nd authentication to avoid any user signin up as admin
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfrim: req.body.passwordConfrim
    })

    // --using the JWT(payload, secret)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { //we get id from newUser
       // when the JWT will be invalid(after 90days)
       expiresIn: process.env.JWT_EXPIRES_IN 
    }) 
    
    // sendnew user to client
    res.status(201).json({
        status: 'Success',
        token, //sending token to client
        data: {
            user: newUser
        }
    })
    // wrap the func into the catch async function
})