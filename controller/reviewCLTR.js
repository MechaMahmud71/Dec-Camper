
const Review = require("../model/Review");
const ErrorResponse = require('../utils/errorResponse');
const asyncHandeler = require("../middleware/async");
const Bootcamp = require('../model/Bootcamp');
// const User = require('../model/User');
// const Course = require('../model/course');


//GET
//api/v1/reviews
//api/v1/bootcamp/:bootcampID/reviews
exports.getReviews = asyncHandeler(async (req, res, next) => {

  if (req.params.bootcampID) {

    const reviews = await Review.find({ bootcamp: req.params.bootcampID });

    res.json({
      success: true, data: reviews, count: reviews.length
    });
  } else {
    res.json(res.advancedResults);
  }
})

//get 
//get single review
//api/v1/bootcamp/:bootcampID/reviews/:reviewID

exports.getReview = asyncHandeler(async (req, res, next) => {
  const { bootcampID, reviewID } = req.params;
  const bootcamp = await Bootcamp.findById(bootcampID);
  if (!bootcamp) {
    next(new ErrorResponse(`NO Bootcamp found`, 404));
  }
  const review = await Review.findById(reviewID).populate(
    { path: 'bootcamp user ', select: 'name description' }
    //{ path: 'user', select: 'name' }
  );
  res.json({
    success: true,
    data: review
  })
})


//post
//protected
//authorized
//api/v1/bootcamp/:bootcampID/review

exports.addBootcampReview = asyncHandeler(async (req, res, next) => {

  //let { bootcamp, user } = req.body;

  req.body.bootcamp = req.params.bootcampID;
  req.body.user = req.user.id;
  //console.log(req.params.bootcampID, req.user.id);
  const bootcamp = await Bootcamp.findById(req.params.bootcampID);

  if (!bootcamp) {
    next(new ErrorResponse(`NO Bootcamp found`, 404));
  }



  const review = await Review.create(req.body);

  res.json({
    succes: true,
    data: review
  })

})

//adding review to the course with enroll system 
//api/v1/bootcamp/:bootcampID/reviews/course/:courseID
// exports.addCourseReview = asyncHandeler(async (req, res, next) => {
//   const user = await User.findById(req.user.id);
//   const courseId = req.params.courseID;
//   const course = await Course.findById(courseId);
//   // console.log('this is courese id ' + typeof (req.user.id));
//   const isFoundEnroll = user.enrolls.find(el => el === courseId);
//   if (!isFoundEnroll) {
//     return next(new ErrorResponse(`You can't Add review`, 401));
//   }


//   const isFoundUser = course.reviews.find(el => JSON.stringify(el.user) === JSON.stringify(req.user.id));


//   if (isFoundUser) {
//     return next(new ErrorResponse(`You already have a review `, 401));
//   }
//   req.body.bootcamp = req.params.bootcampID;
//   req.body.user = req.user.id;
//   const review = await Review.create(req.body);

//   await review.save();


//   course.reviews.push(review);

//   await course.save();

//   res.json({
//     succes: true,
//     data: review
//   })

// })

//put
//api/v1/bootcamp/:bootcampID/review/:reviewID

exports.updateReview = asyncHandeler(async (req, res, next) => {
  const { bootcampID, reviewID } = req.params;


  const bootcamp = await Bootcamp.findById(bootcampID);
  if (!bootcamp) {
    next(new ErrorResponse(`NO Bootcamp found`, 404));
  }

  let query;
  query = await Review.findById(reviewID);

  if (JSON.stringify(req.user.id) !== JSON.stringify(query.user)) {
    next(new ErrorResponse(`You cant edit this review`, 401));
  }

  query = await Review.findByIdAndUpdate(reviewID, req.body, {
    new: true,
    runValidators: true
  });

  await query.save();

  res.json(
    { succes: true, data: query }
  )



})

//delete
////api/v1/bootcamp/:bootcampID/review/:reviewID
exports.deleteReview = asyncHandeler(async (req, res, next) => {
  const { bootcampID, reviewID } = req.params;


  const bootcamp = await Bootcamp.findById(bootcampID);
  if (!bootcamp) {
    next(new ErrorResponse(`NO Bootcamp found`, 404));
  }

  let query;
  query = await Review.findById(reviewID);

  if (JSON.stringify(req.user.id) !== JSON.stringify(query.user)) {
    next(new ErrorResponse(`You cant edit this review`, 401));
  }

  query = await Review.findByIdAndDelete(reviewID)



  res.json(
    { succes: true, data: {} }
  )



})