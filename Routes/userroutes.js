const express = require('express')
const router = express.Router()
const userController = require('../Controller/userController')
const middleware = require('../Middleware/middleware')

// const app = express()

router.use('/readuser',middleware)

// router.use('/updateusername',middleware)
// router.use('/updateemail',middleware)

router.get('/home',userController.home)
router.post('/signup',userController.signup)
router.post('/signin',userController.signin)
router.get('/readuser',userController.readUser)
router.put('/updateusername',userController.updateUsername)
router.put('/updateemail',userController.updateEmail)
router.put('/updatepass',userController.updatePassword)
router.delete('/deleteuser',userController.deleteUser)


module.exports = router

