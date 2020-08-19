const mongoose = require('mongoose')
const Tour = require('./tourModel ')

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required:[true, 'Review can not be empty']
    },
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // tour parent referencing
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true,'Review must belong to a tour']
    },
    // user parent referencing
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
},
// --object for options
// incase we have a field thtis not stored in the db bt calculated using some other value, we want it to show up when there is an outpu
{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
    // --we can now see the duration in weeks
}
)

// removing duplicate reviews
reviewSchema.index({ tour: 1, user: 1},{
    unique: true // both the user and tour have to be unique
})

//populate schema
reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path: 'tour', //ref to a model called tour
    //     select:'name'
    // })
    // // to populate with user
    // .populate({
    //     path: 'user',
    //     select: 'name photo' // display user name and photo only
    // })

    // to populate with user only without tour

    this.populate({
        path: 'user',
        select: 'name photo' // display user name and photo only
    })
    next();
})

//////////////////////////////////////////////////////////////
////////Calculating Average Ratings on Tour/////////
// --we will write a static method on our schema, we were using instance method earlier on wch we can call on documents
reviewSchema.statics.calcAverageRatings = async function(tourId) {
    // --we use agg pipeline to perform calculation
    const stats =  await this.aggregate([
        // stages we need in agg
        {
            $match: {tour: tourId}
        },
        {
            $group: {
                _id: '$tour',
                nRating: {$sum: 1}, //one will get added to each of the tour docs
                avgRating: {$avg: '$rating'}
            }
        }
    ])
    // console.log(stats)
    // --persiting calculated statistics in the tour doc
    // --this code needs to be executed incase we have some info in our stats array
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    }
    else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
    

}

// --call the stat method
reviewSchema.post('save', function(){
    // this points to current review
    // --this pts to the model
    this.constructor.calcAverageRatings(this.tour)
});

// NB: pre middleware uses next whilw post doesnot

// --calculating review stat when a review is updated or deleted
reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne()
    // console.log(this.r)
    next()
})
// --we then use post
reviewSchema.post(/^findOneAnd/, async function() {
    // when review is updated
    await this.r.constructor.calcAverageRatings(this.r.tour)// passing data from pre to post middleware
})

const Review = mongoose.model('Review', reviewSchema)


module.exports = Review

//review needs tobelongto a tour and also has an author,
// --parent referencing here bse both tour and user are the parents of the data set
// --the reviews section will have multiple reviews and bse we dont knw how long our arrays
// willgrow, its best we use parent referencing


