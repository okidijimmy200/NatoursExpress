const mongoose = require('mongoose')

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

const Review = mongoose.model('Review', reviewSchema)


module.exports = Review

//review needs tobelongto a tour and also has an author,
// --parent referencing here bse both tour and user are the parents of the data set
// --the reviews section will have multiple reviews and bse we dont knw how long our arrays
// willgrow, its best we use parent referencing