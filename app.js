const fs = require('fs')
const express = require('express')

const app = express();

// using middleware
app.use(express.json())

 
// defining the routes
// what we want the user to do
// app.get('/', (req, res) => {
//     // sending back data
//     // sending json to client
//     // json automatically sets the content type to application.json
//     res.status(200).json({message: 'Hello from the other side', app: 'Natours'})

// })

// // performing a post request
// app.post('/', (req, res) => {
//     res.send('post to this endpoint')
// })

// reading data from tours
// we use JSON.parse to pass an array of JS objects
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'UTF-8')
);

// building out Tours API
// v1--API version wch helps us to do changes to API by moving it to v2
app.get('/app/v1/tours', (req, res) => {
    // send back all the tours
    res.status(200).json({
        status: 'success',
        // to have results of array
        results: tours.length,
        data:{
            // this contains the response tht we want to send
            tours
        }
    })
    
})

// performing a post request
app.post('/app/v1/tours', (req, res) => {
    // to have data available, we use middleware
    // body is data available on request
    // console.log(req.body)
    // figure out id of new object

    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    // push tours into tours array
    tours.push(newTour)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // when file is written, 201 stands for created
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    })
    
})
// start up a server

const port = 8080
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

