const express = require('express')


// importing user controllers
const userController = require('./../controllers/userController')
const authController = require('../controllers/authController')
// user router
const router = express.Router()

// --we need to do auth wch makes user abit different
router.post('/signup', authController.signup)

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
