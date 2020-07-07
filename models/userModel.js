const mongoose = require('mongoose')
// validator
const validator = require('validator')

// create a schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide us your email'],
        // --to make email unique(bse its an id for users)
        unique: true,
        // --making the email letters lower case
        lowercase: true,
        // --validate email address to the format(we use validator package)
        validate:[validator.isEmail, 'Please provide a valid email']

    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8 //for 8 characters --the most effective passwords r the long ones
    },
    passwordConfrim: {
        type: String,
        required: [true, 'Please confrim your password']
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User;