const User = require('../models/userModel')
// --import catchAsync
const catchAsync = require('../utils/catchAsync')

// --import the Jwt
const jwt = require('jsonwebtoken')
// --import app error
const AppError = require('../utils/appError')

// --function for creating token
const signToken = id => {
    // --using the JWT(payload, secret)
    return jwt.sign({ id }, process.env.JWT_SECRET, { //we get id from newUser
        // when the JWT will be invalid(after 90days)
        expiresIn: process.env.JWT_EXPIRES_IN 
     })
}

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
    const token = signToken(newUser._id )

    
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
// logging in the user
exports.login =catchAsync(async (req, res, next) =>{
    // read email and pas from body
    const { email, password } = req.body; //getting email and password

   
    //1st check if email and password exists
    if(!email || !password) {
        // --we will use our global app error
        return next(new AppError('Please provide email and password!', 400 ))
    }

    // 2nd check if user exists && password is correct(we implicity check if the passord is correct)
    const user = await User.findOne({email}).select('+password')
    // console.log(user)
    // --comparing password in the database with the one the user jst placed in
    // --(we use bcrypt to compare password in the hash form and the plain password)
    // --we use a func to encrypt the jst entered password to compare with the original password in the userModel
    // --call the compare function
    // const correct =await user.correctPassword(password, user.password)

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }

    // 3rd if everything ok, send the token
    ///token implemenatation
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})