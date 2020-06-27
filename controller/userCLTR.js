
const User = require("../model/User");
const asyncHandeler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const Bootcamp = require("../model/Bootcamp");


exports.addUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    sendTokenResponse(user, 200, res);
    // console.log(req.body, user);
  } catch (error) {
    console.log(error);
  }
}
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({ msg: 'invalid login' });
    }
    // console.log(typeof (password));

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new ErrorResponse(`No user found`, 404));
    }
    const isMatch = await user.matchPassword(password);
    // console.log(isMatch);
    if (!isMatch) {
      next(new ErrorResponse(`invalid password`, 400));
    }
    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.log(error);
  }
}
// geting profie
exports.getMe = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res
    .status(200)
    .json(
      { success: true, data: user }
    )
})

//reset pass
//HOW it works-
/*
1. when one clicks the lonk forget password he is refferd to an link
2. In that he has to put his email to get the link to set his password
*/

exports.forgetPassword = asyncHandeler(async (req, res, next) => {

  //finding the user who entered email to set password
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse(`No user found`, 400));
  }

  //if user is found then a token is generated and it is used to get the resetToken to set the passowrd in resseting phase 

  //getResetpasswordToken is written in UserSchema 
  const resetToken = user.getResetPasswordToken();
  //console.log(resetToken);
  // saves without validaing
  await user.save({ validateBeforeSave: false })

  //the url where to go and put his password to set new password
  const resetUrl = `${req.protocol}://${req.get('host')}//api/v1/user/resetpassword/${resetToken}`;

  const message = `You are receving a massage to reset your password. please make a PUT req tp :\n\n ${resetUrl}`;

  //node mail to send mail to the user
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message: message
    })
    res.json(
      { success: true, data: "Email sent" }
    )
  } catch (error) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpaire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email couldnot be sent", 500));

  }
})


const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: user
    })

}

//resetting password 
/*
user-
1. after going to the link one has to input his password(new password somtimes consfirm password files is also used)

admin-
1.collects the reset token from the url (actulally generated in the getResetPasswordToken method) and stores it in a vairable called resetPassword to validate

2.admin validates the user by checking if the user has the-

  1.resetPasswordToken
  2.resetPasswordExpirefield
  if he has those
  3.updates the user password taken form the input like (user.pass=req.body.pass)
  4.sets the to undefined sothat it cant be saved
    1.resetPasswordToken=undefined
    2.resetPasswordExpirefield=undiefined
  5.saves the user to database
  6.send token response in cookie
*/


//PUT
//api/v1/user/resetpassword/:resetToken

exports.resetPassword = asyncHandeler(async (req, res, next) => {

  //collecting the token from url
  const resetToken = req.params.resetToken;

  //inputing the token by hashing it in to resetPasswordToken variable
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  //finding then user in the data base
  const user = await User.findOne({
    resetPasswordExpire: { $gt: Date.now() },
    resetPasswordToken: resetPasswordToken
  });

  // returning "No user found with a bad req" if the user is not found
  if (!user) {
    return next(new ErrorResponse(`No user found`, 401));

  }

  //update the user password

  user.password = req.body.password;
  //console.log(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  //saving the user

  await user.save();

  //sending token response  
  sendTokenResponse(user, 200, res);

})

//update user details
//PUT
//api/v1/user/updatedetails

exports.updateDetails = asyncHandeler(async (req, res, next) => {

  const { email, name } = req.body;

  const fieldsToUpdate = {
    email, name
  }
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  res.json(
    { success: true, data: user }
  )

});


exports.updatePassword = asyncHandeler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse(`Password is incorrect`, 401));

  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
})

//get method to find boot camp and course associated with this user
exports.findCourse = asyncHandeler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findOne({ user: req.user.id }).populate({
    path: 'courses', select: 'name description'
  });
  res.json(
    { success: true, data: bootcamp }
  )
})

