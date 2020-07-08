const User = require('../models/userModel')
// --import catchAsync
const catchAsync = require('../utils/catchAsync')

// async bse we wil do some db operations
exports.signup = catchAsync(async(req, res, next) => {
    // creating newUser
    const newUser = await User.create(req.body)

    // sendnew user to client
    res.status(201).json({
        status: 'Success',
        data: {
            user: newUser
        }
    })
    // wrap the func into the catch async function
})