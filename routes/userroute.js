const express = require("express");

const router = express.Router();

const userCltr = require('../controller/userCLTR');
const { protect, authorize } = require("../middleware/auth");


const { addUser, loginUser, getMe, forgetPassword, resetPassword, updateDetails, updatePassword, findCourse } = userCltr;

//router.post('/register', userCltr.addUser);
router.post('/register', addUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword)
router.post('/forgetpassword', forgetPassword);
router.put('/resetpassword/:resetToken', resetPassword);
router.get('/find', protect, findCourse);
module.exports = router;