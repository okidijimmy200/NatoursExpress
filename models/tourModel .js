// importing the mongoose
const mongoose = require('mongoose')

// --import slugify
const slugify = require('slugify')
// --import validator
const validator = require('validator')


// creating a schema for our tour
const tourSchema = new mongoose.Schema({
    name: {
        // schema type options for some strings
        type:String,
        required:[true, 'A tour must have a name'],
        unique: true,
        trim: true,
        // --we have validators ie required, trim
        // --other validators
        maxlength:[40, 'A tour name must have less or equal to 40 characters'],
        minlength:[10, 'A tour name must have more or equal to 10 characters'],
        // --implementing the custom validator
        // validate: [validator.isAlpha, 'Tour name must only contain characters']
    }, 
    slug: String,
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
        required: [true, 'A tour must have a difficulty'],
        // --validators for difficulty
        enum: {
            values:['easy','medium', 'difficult'],
            message: 'difficulty is either easy, medum or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        // --placing validators on rating
        min: [1, 'Rating must be above 1,0'],
        max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'tour must have a price']
    } ,

    // --creating our custom validators
    priceDiscount:{
        type:Number,
        // val--price tht the user input
        validate:{
            validator:function(val){
                return val < this.price;  // check if price is less thn discount ie 100 < 200, true 250< 200 false
                
            },
            // -setting custom message, value is passed in dynamically with mongoose
            message:'Discount price ({VALUE})should be below regular price'
            // this function doesnot work on an update
        }
    } ,
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
        default:Date.now(),
        // to hide the createdAt
        select: false
    },
    startDates: [Date],
    // --creatig secet tour
    secretTour: {
        type: Boolean,
        default: false
    }

},
// --object for options
   {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
        // --we can now see the duration in weeks
    }
)

// --we define virtual properties o schema
tourSchema.virtual('durationWeeks').get(function() {
    // --calculating duration in weeks
    // --we use function() bse arrow function doesnot get a this keyword
    // --we will use regular functions in mongoose
    return this.duration/7
})

///////Mongoose document middleware
// --this runs before the save() and create() commands not insertMany()
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, { lower: true })
    next();
})
// // --we can have multiple pre or post middleware for hooks
// tourSchema.pre('save', function(next){
//     console.log('Will save document')
//     next()
// })

// // --post middleware
// tourSchema.post('save', function(doc, next) {
//     console.log(doc);
//     next()

// })

////QUERY MIDDLEWARE
// --find makes this a query middleware
// tourSchema.pre('find', function(next) 
// --to sort out the findOne issue
tourSchema.pre(/^find/, function(next)
{
    // --lets checkout a section for secret tours to make it not appear in the al results
    // --this is how we filter out our secret tours
    this.find({ secretTour: {$ne: true}})
     // --clock to determine how long it takes to execute
     this.start = Date.now()
    next();
})

// --for find
tourSchema.post(/^find/, function(docs, next){
    console.log(`Query took ${Date.now() - this.start} milliseconds`)
    // console.log(docs)
   
    next()
})

//  AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
    //  we add a match at the beginning of the pipeline array
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}})
    console.log(this.pipeline())
    next()
})

// creating a model for tour
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour