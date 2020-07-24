const mongoose = require('mongoose')
// validator
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')

const bcrypt = require('bcryptjs')

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
        minlength: 8, //for 8 characters --the most effective passwords r the long ones
        select: false // to make the password not to be returned
    },
    passwordConfrim: {
        type: String,
        required: [true, 'Please confrim your password'],
         // --writing custom validators for our password
         validate: {
             validator: function(el) {
                 return el === this.password 
                //  -this validationonly works on create ,save, so update a user, we use save
             },
             message: 'passwords are not the same'
         }
    }
})

////ENCRYPTING PASSWORD
// we will use the document pre save middleware
userSchema.pre('save', async function(next){
// here the middleware encryption is going to happen btn the time we receive the data and the
// time its stored in the database
// (encrypt password field only when password is updated)
if (!this.isModified('password')) return next()
// --we will use bcrypt to perform hashing
    this.password = await bcrypt.hash(this.password, 12) //12 --cost parameter

    // --hashing the password confrim(this deletes it after)
    this.passwordConfrim = undefined
    next()
}) 



userSchema.plugin(uniqueValidator)
////////////////////////////////////////////////////////////
/////////PASSWORD VALIDATION///////////////////////////////
// --we use a func to encrypt the jst entered password to compare with the original password in the userModel
// --creating an instance method(this is a method available on all documents of a certain collection)
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword) // return 2 passwords if they are the same else return false
}
const User = mongoose.model('User', userSchema)

module.exports = User;