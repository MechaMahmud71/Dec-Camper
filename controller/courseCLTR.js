const Course = require('../model/course');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../model/Bootcamp');
const asyncHandeler = require("../middleware/async");
const User = require('../model/User');
//api/v1/courses
//api/v1/bootcamp/:bootcampID/courses
//get all courses
exports.getCourses = async (req, res, next) => {



  try {
    res.json(res.advancedResults);

  } catch (error) {
    next(error);
  }
}


//get single course
//api/v1/courses/:id

exports.getCourse = async (req, res, next) => {
  const id = req.params.courseID;
  let query;
  try {
    query = Course.findById(id).populate(
      { path: 'bootcamp reviews', select: 'name description title' }
    )
    const course = await query;

    res.json(
      { success: true, data: course }
    )

  }
  catch (error) {
    next(error)
  }
}


//post course
//before posting course we need to see if the boot camp exists or no
//api/v1/bootcamp/:bootcampId/courses

exports.postCourse = async (req, res, next) => {
  try {

    req.body.bootcamp = req.params.bootcamp;

    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampID);
    //console.log(bootcamp);
    if (!bootcamp) {
      // res.json({ success: false, data: {} })
      return next(new ErrorResponse(`Bootcamp is not found`, 400));
    }

    if (req.body.user !== bootcamp.user.toString()) {
      return next(new ErrorResponse(`You are not authorized`, 400));
    }
    const course = await Course.create(req.body);

    res.json(
      { success: true, data: course }
    )

  } catch (error) {
    console.log(error);
  }
}

//update course
//api/v1/bootcamp/:bootcampID/courses/:courseID

exports.updateCourse = async (req, res, next) => {
  try {



    let bootcamp = await Bootcamp.findById(req.params.bootcampID);



    const { edit } = req.query;


    // const { bootcampID, courseID } = req.params;

    // console.log(bootcampID, courseID, edit);

    console.log(req.user.id, bootcamp.user);

    if (!bootcamp && !edit) {
      res.json({ success: false, data: {} })
    }

    if (req.user.id !== bootcamp.user.toString()) {
      return next(new ErrorResponse(`Now authorized to edit the boot camp`, 401));
    }

    const course = await Course.findByIdAndUpdate(req.params.courseID, req.body, {
      new: true,
      runValidators: true
    })
    res.json(
      { success: true, data: course }
    )

  } catch (error) {
    console.log(error);
  }
}

//delete course
//api/v1/bootcamp/:bootcampID/courses/:courseID
exports.deleteCourse = async (req, res, next) => {

  try {
    const { courseID, bootcampID } = req.params;
    const bootcamp = await Bootcamp.findById(bootcampID);

    //console.log(bootcamp);
    if (!bootcamp) {
      res.json({ success: false, data: {} })
    }

    if (req.body.user !== bootcamp.user.toString()) {
      return next(new ErrorResponse(`You are not authorized`, 400));
    }

    const course = await Course.findByIdAndDelete(courseID);


    res.json({ success: true, data: {} })
  } catch (error) {
    // res.json({ success: false, msg: "error" });
    next(error);
  }
}

//enroll
//post
//api/v1/:bootcampID/courses/:courseID/enroll

exports.enRoll = asyncHandeler(async (req, res, next) => {
  //console.log(req.user.id);

  const user = await User.findById(req.user.id);



  user.enrolls.push(req.params.courseID);

  await user.save();
  console.log(user);
})



