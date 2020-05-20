// importing dotenv file
const dotenv = require('dotenv')

// importing app.js
const app = require('./app');

// uing the dotenv variable
dotenv.config({path: './config.env'})

// to check the environment we are currently in
// console.log(app.get('env'))


// node working environment variable
console.log(process.env)

// start up a server
const port = 8080
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})