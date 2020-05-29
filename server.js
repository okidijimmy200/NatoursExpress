// importing the mongoose
const mongoose = require('mongoose')
// importing dotenv file
const dotenv = require('dotenv')

// importing app.js
const app = require('./app');

// uing the dotenv variable
dotenv.config({path: './config.env'})

// getting our database password
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
//////////connecting to local database/////////////////////
mongoose.connect(process.env.DATABASE_LOCAL,{
    // objects to deal with warnings
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(() => console.log('DB connection successful'));

// mongoose remote
mongoose.connect(DB, {
    // objects to deal with warnings
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(() => console.log('DB connection successful'));



// to check the environment we are currently in
// console.log(app.get('env'))


// node working environment variable
console.log(process.env)

// start up a server
const port = 8080
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})