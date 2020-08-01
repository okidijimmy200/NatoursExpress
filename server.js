// importing the mongoose
const mongoose = require('mongoose')
// importing dotenv file
const dotenv = require('dotenv')

// importing app.js
const app = require('./app');


// --unhandled exceptions
process.on('uncaughtException', err => {
    // shutting down our app
   console.log('UNCAUGHT EXCEPTION! shutting down')
   // --wen we have uncaught exception, the node exception is in unclean state
   console.log(err.name, err.message)
   process.exit(1);
})

// uing the dotenv variable
dotenv.config({path: './config.env'})

// getting our database password
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
//////////connecting to local database/////////////////////
mongoose.connect(process.env.DATABASE_LOCAL,{
    // objects to deal with warnings
    useUnifiedTopology: true,
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    
}).then(() => console.log('DB connection successful'));

// mongoose remote
// mongoose.connect(DB, {
//     // objects to deal with warnings
//     useUnifiedTopology: true,
//     useNewUrlParser:true,
//     useCreateIndex:true,
//     useFindAndModify:false
// }).then(() => console.log('DB connection successful'));



// to check the environment we are currently in
// console.log(app.get('env'))


// node working environment variable
console.log(process.env)

// start up a server
const port = 8080
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

// --handling unhandled promise rejections globally
process.on('unhandledRejection', err => {
    console.log(err.name,err.message)
    // shutting down our app
    console.log('UNHANDLED REJECTION! shutting down')
    server.close(() => {
        process.exit(1);
    })
    
})


