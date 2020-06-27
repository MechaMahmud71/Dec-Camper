const express = require("express");

const router = express.Router();
const User = require('../model/User');

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require("../middleware/advancedResults");
const { getUsers, getSingleUser, updateUser, createUser, deleteUser } = require('../controller/adminCLTR');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', advancedResults(User), getUsers);
router.get('/user/:id', getSingleUser);
router.post('/user', createUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;