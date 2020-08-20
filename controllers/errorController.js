// --importing appError
const AppError = require('./../utils/appError')

const handleCastErrorDB = err => {
    // --error object has the path and value
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400) //400--bad request
} 

const handleDuplicateFieldsDB = err => {    
    // --using req exp to get name
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    console.log(value)
    const message = `Duplicate field value: ${value}. Please use another value`
    return new AppError(message, 400)
}

// --handling validation error
const handleValidationErrorDB = err => {
    // --to loop over the error objs, map is for looping(objs: name, difficulty)
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid Input data. ${errors.join('. ')}`;
    return new AppError(message, 400)
}

// creating error for handleJWTError
const handleJWTError = ()=> new AppError('Invalid token!. Please log in again', 401)

const handleJwTExpiredError = ()=> new AppError('Your token has expired! please login again.', 401)
// ---const for dev
const sendErrorDev = (err, req, res) => {
    // --error on clientSide
    //A) --API--
        if(req.originalUrl.startsWith('/api')) {
            // --if dev, send one type of error
            return res.status(err.statusCode).json({
                status: err.status,
                // --print the entire error
                error: err,
                name:err.name,
                message: err.message, //passed on from const err above 
                // --printing the response 
                stack: err.stack
            })
        }
        //Rendered website
            // render error
            console.error('Error', err)
            return res.status(err.statusCode).render('error', {
              title: 'Something went wrong',
              msg: err.message
            })
      
}



const sendErrorProd = (err, req, res) => {
    // a) API
    if(req.originalUrl.startsWith('/api')) {
            // --checking if error isOperational type
        if(err.isOperational) {
            // --if dev, send one type of error
            return res.status(err.statusCode).json({
        status: err.status,
        message: err.message //passed on from const err above 
    })
    }
   // Programming or other unknown error
   // --else send generic message to client
   
       // 1) log error
    console.error('Error', err)
       
       // 2) send generic message
    return res.status(500).json({
        status: 'error',
        message: 'Something went wrong'
    })
    } 
    //b) rendered website  
            // --checking if error isOperational type
    if(err.isOperational) {
        // --if dev, send one type of error
        console.log(err)
        return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message //passed on from const err above 
    });
   }
   //B) Programming or other unknown error
   // --else send generic message to client
   
       // 1) log error
    console.error('Error', err)
       
       // 2) send generic message
    return res.status(err.statusCode).render('error', {
        title: 'something went wrong',
        msg: 'Please try again later' //passed on from const err above 
    })

   
}


module.exports = (err, req, res, next) => {
    // console.log(err.stack)
    // --reading status code from error for custom code
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error' // if error is defined

    // --distinguishing btn prod and dev environment
    if(process.env.NODE_ENV === 'development'){
      sendErrorDev(err,req,  res);
    }
    else if (process.env.NODE_ENV === 'production') {
        // --not good to declare  hard copy of var like err
        let error = { ...err };
        error.message = err.message;
        // --checking if the error is a wrong id field
        ///  ER.NAME =='NOT RECOMMENDED BCOZ AM CALLING THE ORIGNAL COPY OF ERR,--THE ERROR.NAME FAILED TO WORK BCOZ ERR PRINT DOESNT PRINT NAME
        // SO I HAD TO GET THE ACTUAL ERR OBJECT FOR NAME'
        if (err.name === 'CastError') {error = handleCastErrorDB(error)}
        // --error for placing duplicate name or any other value
        if (error.code === 11000) error = handleDuplicateFieldsDB(error)
        // --handling validation error
        if(err.name === 'ValidationError') error = handleValidationErrorDB(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError()
        if (error.name === 'TokenExpiredError') error = handleJwTExpiredError()
        sendErrorProd(error, req, res)
    }
    
}

// --error comes from not having the object NAME

