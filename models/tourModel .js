// importing the mongoose
const mongoose = require('mongoose')
// creating a schema for our tour
const tourSchema = new mongoose.Schema({
    name: {
        // schema type options for some strings
        type:String,
        required:[true, 'A tour must have a name'],
        unique: true,
        trim: true
    }, 
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']

    },  
    maxGroupSize: {
        type: Number,
        required: [true, 'A tourmust have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'tour must have a price']
    } ,
    priceDiscount: Number,
    summary: {
        type: String,
        // --trim helps us cut the unnecessary white space we have
        trim: true,
        required: [true, 'a tour must have a summary'] 
    },
    description: {
        type: String,
        trim: true

    },
    imageCover: {
        type: String,
        required: [true, 'a tour must have a cover image']
    },
    // --an array containin a number of strings
    images: [String],
    // --timestamp wch shd be made automatically,
    createdAt: {
        type: Date,
        default:Date.now()
    },
    startDates: [Date]

})

// creating a model for tour
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour