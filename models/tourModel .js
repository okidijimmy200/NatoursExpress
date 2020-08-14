// importing the mongoose
const mongoose = require('mongoose')

// --import slugify
const slugify = require('slugify')
// --import validator
const validator = require('validator')
// --import user
// const User = require('./userModel') ---for embedding we import user


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
        set: val => Math.round(val * 10) / 10 // setter func for rouding off
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
    },
    // --geospatial data info(location)
    startLocation: {
        // --we use geejson to specify geodata
      type:{
          type: String,
          default: 'Point', // we cld specify poligons, geometry etc
          enum: ['Point'] //all possible options the field can take
      },
      coordinates: [Number], //expect array of longitude and latitude
      address:String,
      description: String
    },
    // --getting an array for locations
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum:['Point']
            },
            coordinates:[Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // guides: Array  ----embedding documents
    // --referencing docs
    guides: [
        {type: mongoose.Schema.ObjectId,
        ref: 'User'
        }
    ]

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
    return this.duration / 7
})

// performing index on price
// single field index
// tourSchema.index({price: 1}) // 1 ascending order, -1 descending order
// compund field index
tourSchema.index({price: 1, ratingsAverage: -1})

// --index to start Location
tourSchema.index({startLocation: '2dsphere'}) // for geospatial, its a 2D spherical index
// index for slug
tourSchema.index({slug: 1})
// --virtual populate
tourSchema.virtual('review', { //review--name of fieild
    ref: 'Review', //name of model to reference
    // specify the name of the fields to connect to the dataset
    foreignField: 'tour', //tour field from the review field model
    localField: '_id' //where id is stored
})

///////Mongoose document middleware
// --this runs before the save() and create() commands not insertMany()
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, { lower: true })
    next();
})


////pre save middleware for tour and user id
// --embedding new docs 
// tourSchema.pre('save', async function(next) {
//    const guidesPromises =  this.guides.map(async id => await User.findById(id))
//    this.guides = await Promise.all(guidesPromises) // to change the guidePromise above to simply guides
//    next();
// })
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


///populate middleware, this is  gd way of populating all docs
tourSchema.pre(/^find/, function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
    })
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