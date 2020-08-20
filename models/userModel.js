// --import crypto
const crypto = require('crypto')
const mongoose = require('mongoose')
// validator
const validator = require('validator')
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcryptjs')


// create a schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
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
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8, //for 8 characters --the most effective passwords r the long ones
        select: false // to make the password not to be returned
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confrim your password'],
         // --writing custom validators for our password
         validate: {
             validator: function(el) {
                 return el === this.password 
                //  -this validationonly works on create ,save, so update a user, we use save
             },
             message: 'Passwords are not the same!'
         }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false // to hide it from output

    }

});


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
    this.passwordConfirm = undefined
    next();
});


// function wch runs right before the docu is saved
userSchema.pre('save', function(next){
    // --this shd be done when we modify password prop
    if(!this.isModified('password') || this.isNew ) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});


// --to avoid active/inactive from appearing in the getAllUsers 
userSchema.pre(/^find/, function(next) {
    // this points to the current query
    // --here we want to only find documents tht have the active property set to true
    this.find({ active: {$ne: false } })
    next();
});


userSchema.plugin(uniqueValidator)
////////////////////////////////////////////////////////////
/////////PASSWORD VALIDATION///////////////////////////////
// --we use a func to encrypt the jst entered password to compare with the original password in the userModel
// --creating an instance method(this is a method available on all documents of a certain collection)
userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword
    ){
    return await bcrypt.compare(candidatePassword, userPassword); // return 2 passwords if they are the same else return false
}

////////////change password/////////////////////
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    // if password changed, do the comparison
    if(this.passwordChangedAt) {
        // --convert passwordChangedAt to  timestamp, 10--base 10 number
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(changedTimeStamp, JWTTimestamp)
        return JWTTimestamp < changedTimeStamp; //not changed means the day and time token issued is less thn changed timestamp
    }
    // --false means not changed
    return false;
};

// --user schema for forgotten password
userSchema.methods.createPasswordResetToken = function() {
    // --reset the password token to send to user
    const resetToken = crypto.randomBytes(32).toString('hex')
    //  ecnrypt the token
    this.passwordResetToken =  crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    console.log({resetToken}, this.passwordResetToken)
    // password reset expires in 10 mins
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    // return plain text token
    return resetToken;


}


const User = mongoose.model('User', userSchema)

module.exports = User;
