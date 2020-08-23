const express = require('express')

// importing user controllers
const userController = require('./../controllers/userController')
const authController = require('../controllers/authController')

// user router
const router = express.Router()

// --we need to do auth wch makes user abit different
router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

// routes for fogetten password and reset password
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

// router middleware to be used
// !important
//////(to protect all routes tht come after this middleware)///////
router.use(authController.protect)

// change password
router.patch('/updateMyPassword', 
             authController.updatePassword)


// route for getMe
router.get('/me', 
        userController.getMe, 
        userController.getUser)

// change user data
router.patch('/updateMe',userController.uploadUserPhoto, userController.updateMe)
// delete user
router.delete('/deleteMe',
            userController.deleteMe)

// route for users
// --these actions shd be used by admin only
router.use(authController.restrictTo('admin'))
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
