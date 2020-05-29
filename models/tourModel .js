// importing the mongoose
const mongoose = require('mongoose')
// creating a schema for our tour
const tourSchema = new mongoose.Schema({
    name: {
        // schema type options for some strings
        type:String,
        required:[true, 'A tour must have a name'],
        unique: true
    },    
    rating:{
        type: Number,
        default: 4.5
    },
    price: {
        type: Number,
        required: [true, 'tour must have a price']
    } 

})

// creating a model for tour
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour