const promisify = require('util.promisify');
const User = require('../models/userModel')
// --import catchAsync
const catchAsync = require('../utils/catchAsync')

// --import the Jwt
const jwt = require('jsonwebtoken')
// --import app error
const AppError = require('../utils/appError')
// --import mail
const sendEmail = require('../utils/email')
// import crypt
const crypto = require('crypto')

// --function for creating token
const signToken = id => {
    // --using the JWT(payload, secret)
    return jwt.sign({ id }, process.env.JWT_SECRET, { //we get id from newUser
        // when the JWT will be invalid(after 90days)
        expiresIn: process.env.JWT_EXPIRES_IN 
     })
}

// --function to create and send token
const createSendToken = (user, statusCode, res) => {
       // --using the JWT(payload, secret)
       const token = signToken(user._id )
       const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true // cookie cant be modified in the browser
    };
    // --to perform secure to true in prod only
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true //secure: true, //cookie will be sent only on https

     ////////////send a cookie
     res.cookie('jwt', token, cookieOptions )

    // --to hide the password display on signup
    user.password = undefined

      
       // send new user to client
       res.status(statusCode).json({
           status: 'Success',
           token, //sending token to client
           data: {
               user
           }
       })
} 

// async bse we wil do some db operations
exports.signup = catchAsync(async(req, res, next) => {
    // creating newUser
    // const newUser = await User.create(req.body)
    // --we will use the 2nd authentication to avoid any user signin up as admin
    // const newUser = await User.create(req.body)
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
      });
    createSendToken(newUser, 201, res)
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
    createSendToken(user, 200, res)

})

//////////////////////////////////////////////////////////
//////////creating logout middleware//////////////
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000), //cookie expires in 10seconds
        httpOnly: true
    })
    res.status(200).json({
        status: 'success'
    })
}



///////////////////////////////////////////////////////////////
///////////Middleware for protecting getAlltours route
exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // 1) Get token and check if it exists
    // --we use http header with token to check if it exists
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
        ){
        token = req.headers.authorization.split(' ')[1] // split bearer array to 2 and take the second part of array
    }
    // --reading jwt from the cookie
    else if (req.cookies.jwt) {
        token = req.cookies.jwt // here we can authenticate users with tokens sent via cookies
    }

    // --check if token exists
    if(!token){
        // 401--not authorized
        return next(new AppError('you are not logged in! please log in to get access', 401))
    }
    // 2) validate the token(JWT algorithm to valdate) or check if it has expired
    // --we need a secret wch is at process.env.jwtsecret
    const decoded =  await promisify(jwt.verify)(token, process.env.JWT_SECRET)


    // 3) Check if user still exists
    const freshUser = await User.findById(decoded.id)
    // check if there is a fresh user
    if(!freshUser) {
        return next(new AppError('The user belonging to this token doesnot exist anymore!.', 401))
    }
    // 4) Check if user changed password after Token was issued
    // (we create an instance method wch is available on all the models of the document in userModel)
    // iat--issued at
    if(freshUser.changedPasswordAfter(decoded.iat)){
        // --if password is changed, we get an error
        return next(new AppError('User recently changed the password! please login again.', 401))
    };

    //Grant access to protected route if it succeds all  the above step
    req.user = freshUser; //place the user data on request
    res.locals.user = freshUser; // to pass user to templates
    next();
});

// middleware to check if the user is loggedin or not
// only for rendered pages and there will be no errors
// NB: for our rendered(client website), the token will only be sent using cookie and never the authorization header

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
      try {
        // 1) verify token
        const decoded = await promisify(jwt.verify)(
          req.cookies.jwt,
          process.env.JWT_SECRET
        );
  
        // 2) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
          return next();
        }
  
        // 3) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
          return next();
        }
  
        // THERE IS A LOGGED IN USER
        res.locals.user = currentUser;
        return next();
      } catch (err) {
        return next();
      }
    }
    next();
  };

///////////////////restrict access to
exports.restrictTo = (...roles) => {
    return (req, res, next) => { //func gets access to the roles
        // roles is an array ['admin', 'lead-guide'], role=user
        if(!roles.includes(req.user.role)){
            return next(new AppError('you donot have permission to perform this action', 403)) //403--forbidden
        }
        next();
    }
}


//////////for forgotten passwords
exports.forgotPassword = catchAsync(async(req, res, next) => {
    // 1) get user based on posted email
    const user = await User.findOne( {email: req.body.email})
    // ifuser doesnot exist
    if(!user) {
        return next(new AppError('There is no user with this email address', 404))

    }
    // 2) generate the random token
    const resetToken = user.createPasswordResetToken()
    // save the document
    await user.save({ validateBeforeSave: false}) // this deactivates all the validators we set
    // 3)send if to the user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message = `forgot your password? submit a patch request with your new password and passwordConfirm to: 
    ${resetURL}.\nif you didn't forget your password, please ignore this email`;


    // --incase of error, we want to perform some actions
    try {
        await sendEmail({
            email: req.body.email,
            subject: 'Your password resettoken (valid for 10 mins)',
            message
        });
        res.status(200).json({
            status: 'success',
            message:'Token sent to email'
        })
    } catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false}) 


        return next(new AppError('There was an error sending to the email! try again later'), 500)
    }

}
)
// reset passwords
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) get user based on the token
    // (we need to encrypt the original token again to compare with the encrypted one in the DB)
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex'); // from the Url
    // get the user based on token only
    const user = await User.findOne(
        {passwordResetToken: hashedToken,
            // --check if the password expiry properrty is greater than time now
        passwordResetExpires:{$gt: Date.now()}
        })
    

    
    
    // 2) set new password only if token has not expired and there is a new user
    // (send an error if the token has expired or if no user)
    if(!user){
        return next(new AppError('Token is invalid or has expired'), 400)
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined // delete reset and expired token
    user.passwordResetExpires = undefined
    await user.save();
    // 3) update changedPasswordAt property for user
    // 4) Log the user in, send the JWT
    createSendToken(user, 200, res);

})

// --password update functionality
exports.updatePassword = catchAsync(async (req, res, next) => {
    // --pass in current password to confirm
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password')
    // 2) check if posted password is correct
if (!(await user.correctPassword(req.body.passwordCurrent, user.password))){
    return next(new AppError('Your current password is wrong!', 401))
}
    // 3) if so, update the password
user.password = req.body.password;
user.passwordConfirm = req.body.passwordConfirm;
await user.save();
// User.findByIdandUpdate will not work
    // 4) log the user in , send JWT
    createSendToken(user, 200, res)
    
})
