const express = require('express')


// importing user controllers
const userController = require('./../controllers/userController')

// user router
const router = express.Router()

// route for users
router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
// to get one user
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
