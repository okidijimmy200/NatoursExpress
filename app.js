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


// creating a new function for tours
const getAllTours =  (req, res) => {
    // send back all the tours
    res.status(200).json({
        status: 'success',
        // to have results of array(this shows us the number of items available)
        results: tours.length,
        data:{
            // this contains the response tht we want to send
            tours
        }
    })
    
}
// creating function for getTour
const getTour =  (req, res) => {
    // request params is where all the variables of the parameter are stored
    console.log(req.params);
    // converting string of id into numbers(pure JS)
    const id = req.params.id * 1;
    
    // getting the tours with the id
    const tour = tours.find(el => el.id === id)

// incase one sends for id of 2 items yet specified one, we use id.length
    // if (id > tours.length) ---one way of checking tours
    if (!tour) {
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }

    // send back all the tours
    res.status(200).json({
        status: 'success',
        data:{
            // this contains the response tht we want to send
            tour
        }
    })
    
}
// function for creating a request
const createTour =  (req, res) => {
    
    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    // push tours into tours section array
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
    
}
// update tour function
const updateTour = (req, res) => {
    // incase the id is valid
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            // we will send an updated string for tour
            tour: '<Updated Tour...>'
        }
    })
}
// delete tour function
const deleteTour = (req, res) => {
    // incase the id is valid
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }
    // 204--means no content so we sent data as null
    res.status(204).json({
        status: 'success',
        data: null
    })
}
// building out Tours API
// v1--API version wch helps us to do changes to API by moving it to v2
// app.get('/app/v1/tours', getAllTours)

// defining a route tht accepts a variable
// app.get('/app/v1/tours/:id',getTour)

// // performing a post request
// app.post('/app/v1/tours', createTour)
// // performin patch operation
// // id of tours to be updated needs to be stated
// app.patch('/api/v1/tours/:id',updateTour )

// // to handle the delete request
// app.delete('/api/v1/tours/:id', deleteTour)

// specifying the route we want
app.route('/app/v1/tours').get(getAllTours).post(createTour)

// other routes
app.route('/app/v1/tours').get(getTour).patch(updateTour).delete(deleteTour)

// start up a server
const port = 8080
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

