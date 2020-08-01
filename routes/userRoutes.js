const express = require('express')


// importing user controllers
const userController = require('./../controllers/userController')
const authController = require('../controllers/authController')
// user router
const router = express.Router()

// --we need to do auth wch makes user abit different
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// routes for fogetten password and reset password
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

// change password
router.patch('/updateMyPassword', authController.protect, authController.updatePassword)

// change user data
router.patch('/updateMe', authController.protect, userController.updateMe)
// delete user
router.delete('/deleteMe', authController.protect, userController.deleteMe)

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
