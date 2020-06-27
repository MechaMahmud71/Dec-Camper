const User = require('../model/User');
const asyncHandeler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");


//get
//api/v1/admin/users
exports.getUsers = async (req, res, next) => {

  try {
    res.json(res.advancedResults);
  } catch (error) {
    // res.json({ success: false, msg: "error" });
    next(error);
  }


}

//get
//api/v1/admin/user/:id
exports.getSingleUser = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(new ErrorResponse(`No User found`, 401));

  }

  res.json({
    success: true,
    data: user
  })
})

//post
//api/v1/user
exports.createUser = asyncHandeler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.json({
    success: true,
    data: user
  })
})


//put
//api/v1/admin/user/:id

exports.updateUser = asyncHandeler(async (req, res, next) => {
  let user = await User.findById(req.params.id);
  if (!user) {
    next(new ErrorResponse(`No User found`, 401));
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  await user.save();

  res.json({ success: true, data: user })


})

exports.deleteUser = asyncHandeler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)



  res.json({ success: true, data: {} })
})