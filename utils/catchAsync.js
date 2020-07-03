 // --function for handling errors
module.exports = fn  => {
    // --return anonymous func
    return (req, res, next) => {
        // --this is where we get rid of catch blocl
        fn(req, res, next).catch(next);
      };
}