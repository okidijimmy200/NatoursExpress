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
app.use((req, res, next)  => {
    console.log('hello from the middleware')
    // we need to call the next function to move on and b able to send back request to the server
    next();
})

// middleware to manipulate the requests
app.use((req, res, next)  => {
    // adding current time to the request and onverting it to string
    req.requestTime = new Date().toISOString();    
    next();
})


// using middleware to connect our routes
// (mounting a new router on a route)
app.use('/api/v1/users', userRouter );
// (mounting a new router on a route)
app.use('/api/v1/tours',tourRouter );

// exporting our app to be used by server
module.exports = app;

