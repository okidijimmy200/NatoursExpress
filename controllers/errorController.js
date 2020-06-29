module.exports = (err, req, res, next) => {
    // console.log(err.stack)
    // --reading status code from error for custom code
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error' // if error is defined
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message //passed on from const err above 
    })
}