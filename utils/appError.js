class AppError extends Error {
    // NB: we will use AppError to create all the errors in our app
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // -checking if status code is 400 or 500 using startswith
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';//will be fail if 400
        this.isOperational = true;
        // --stack trace---this shows us where the error occured
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError

