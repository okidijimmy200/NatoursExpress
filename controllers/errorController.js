// ---const for dev
const sendErrorDev = (err, res) => {
      // --if dev, send one type of error
      res.status(err.statusCode).json({
        status: err.status,
        // --print the entire error
        error: err,
        message: err.message, //passed on from const err above 
        // --printing the response 
        stack: err.stack
    })
}

const sendErrorProd = (err, req, res, next) => {
    // --checking if error isOperational type
    if(err.isOperational) {
         // --if dev, send one type of error
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message //passed on from const err above 
    })
    }
    // Programming or other unknown error
    // --else send generic message to client
    else{
        // 1) log error
        console.log('Error ', err)
        
        // 2) send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })
    }
   
}


module.exports = (err, req, res, next) => {
    // console.log(err.stack)
    // --reading status code from error for custom code
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error' // if error is defined

    // --distinguishing btn prod and dev environment
    if(process.env.NODE_ENV == 'development'){
      sendErrorDev(err, res)
    }
    else if (process.env.NODE_ENV == 'production') {
        sendErrorProd(err, res)
    }
    
}