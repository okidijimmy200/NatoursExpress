const fs = require('fs')
const express = require('express')

const app = express();

// using middleware
app.use(express.json())

// creating our own middleware functions
app.use((req, res, next)  => {
    console.log('hello from the middleware')
    // we need to call the next function to move on and b able to send back request to the server
    next();
})

// middleware to manipulate the requests
app.use((req, res, next)  => {
    // adding current time to the request and onverting it to string
    req.requestTime = new Date().toISOString();    
    next();
})

// reading data from tours
// we use JSON.parse to pass an array of JS objects
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'UTF-8')
);


// creating a new function for tours
const getAllTours =  (req, res) => {
    // checking out request tours middleware
    console.log(req.requestTime)
    
    // send back all the tours
    res.status(200).json({
        status: 'success',
        // sending requestTime to tour
        requestedAt: req.requestTime,
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

// specifying the route we want
app.route('/app/v1/tours').get(getAllTours).post(createTour)

// other routes
app.route('/app/v1/tours').get(getTour).patch(updateTour).delete(deleteTour)

// start up a server
const port = 8080
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})

