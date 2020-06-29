const fs = require('fs')
const express = require('express')
// importing morgan
const morgan = require('morgan')

// importing the tour router
const tourRouter = require('./routes/tourRoutes')
// importing userRouter
const userRouter = require('./routes/userRoutes')

const app = express();

// using the middleware
app.use(morgan('dev'));

// using middleware
app.use(express.json())


// creating our own middleware functions
// **wen we use morgan, its similar to using the middleware below
// app.use((req, res, next)  => {
//     console.log('hello from the middleware')
//     // we need to call the next function to move on and b able to send back request to the server
//     next();
// })

// middleware to manipulate the requests
app.use((req, res, next)  => {
    // adding current time to the request and onverting it to string
    req.requestTime = new Date().toISOString();    
    next();
})

// how to serve static files(this is used for non API formats)
app.use(express.static(`${__dirname}/public`))

// using middleware to connect our routes
// (mounting a new router on a route)
app.use('/api/v1/users', userRouter );
// (mounting a new router on a route)
app.use('/api/v1/tours',tourRouter );

// --router wch is implemented only if other routes have not bn implemented
// --NB: this middleware router shd be at the bottom of the other routers
app.all('*', (req, res, next) => {
    // // send back response in json format
    // res.status(404).json({
    //     status: 'fail',
    //     message:  `can't find ${req.originalUrl} on the server`
    // })

    // --create an error
    const err = new Error(`can't find ${req.originalUrl} on the server`)
    err.status = 'fail';
    err.statusCode = 404;

    // --moving middleware to next step
    next(err)
})

// --building middleware func to solve operational errors
// --error handling so 1st arg is err
app.use((err, req, res, next) => {
    // --reading status code from error for custom code
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error' // if error is defined
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message //passed on from const err above 
    })
})

// exporting our app to be used by server
module.exports = app;

