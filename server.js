// importing app.js
const app = require('./app');

// start up a server
const port = 8080
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})