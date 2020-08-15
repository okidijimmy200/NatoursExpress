// --import path
const path = require('path')
const fs = require('fs')
const express = require('express')
// importing morgan
const morgan = require('morgan')

// import rateLimit
const rateLimit = require('express-rate-limit')
// import helmet
const helmet = require('helmet')
// import mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize')
// --import xss
const xss = require('xss-clean')
// --import hpp
const hpp = require('hpp')
// --import apperror
const AppError = require('./utils/appError')

// --import global error handler
const globalErrorHandler = require('./controllers/errorController')
// import reviewRouter
const reviewRouter = require('./routes/reviewRoutes')

// importing the tour router
const tourRouter = require('./routes/tourRoutes')
// importing userRouter
const userRouter = require('./routes/userRoutes')


const app = express();

// --setting up pug
app.set('view engine', 'pug')
// --path from inbuild express to avoid scenarios of /
app.set('views', path.join(__dirname, 'views')) // or pug templates r called views

// using the GLOBAL middleware

// --call helmet(Security HTTP Header middleware)
app.use(helmet())

// --development logging
// app.use(morgan('dev'));
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

// --limit requests from same API
const limiter = rateLimit({
    // --how many requests per IP
    max: 100,
    windowMs: 60 * 60 * 1000,  // 100 requests from the same ip per hr
    message:  'Too many requests from the this IP address, Please try again in 1 hr'
});
app.use('/api', limiter) // this affects all routes tht start with api

// Body parser, reading data from body into req.body
// using middleware
app.use(express.json({ limit: '10kb'}))


// --cleaning the data(data sanitization against nosql query injections)

app.use(mongoSanitize()) // this filters out $ and dots
// --cleaning the data(data sanitization against XSS attacks)

app.use(xss()) //clean user from html malicious code


// --hpp
app.use(hpp({
    // params to whitelist(to allow duplicates)
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
})) //prevent parameter pollution



// creating our own middleware functions
// **wen we use morgan, its similar to using the middleware below
// app.use((req, res, next)  => {
//     console.log('hello from the middleware')
//     // we need to call the next function to move on and b able to send back request to the server
//     next();
// })



// how to serve static files(this is used for non API formats)
app.use(express.static(`${__dirname}/public`))

// middleware to manipulate the requests
app.use((req, res, next)  => {
    // adding current time to the request and onverting it to string
    req.requestTime = new Date().toISOString(); 
    // console.log(req.headers) // --logging the headers   
    next();
})

/////////////ROUTES//////
// using middleware to connect our routes
// (mounting a new router on a route)
// (mounting a new router on a route)
app.get('/', (req, res) => {
    res.status(200).render('base', {
        // -pass data into template
    tour: "the forest hiker",
    user:"jonas"
    })
    
}) // base pug route
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);//mounting reviews to new path


// --router wch is implemented only if other routes have not bn implemented
// --NB: this middleware router shd be at the bottom of the other routers
app.all('*', (req, res, next) => {
    //--METHOD 1
    // // send back response in json format
    // res.status(404).json({
    //     status: 'fail',
    //     message:  `can't find ${req.originalUrl} on the server`
    // })
    // METHOD 2
    // --create an error
    // const err = new Error(`can't find ${req.originalUrl} on the server`)
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err)

    // --moving middleware to next step
    next(new AppError(`can't find ${req.originalUrl} on the server!`, 404))
})

// --building middleware func to solve operational errors
// --error handling so 1st arg is err
app.use(globalErrorHandler)

// exporting our app to be used by server
module.exports = app;

