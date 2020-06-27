const express = require('express');
const router = express.Router({ mergeParams: true });
const courseCltr = require('../controller/courseCLTR');
const advancedResults = require('../middleware/advancedResults');
const Course = require('../model/course');
const { protect, authorize } = require('../middleware/auth');
//get all courses
router.get('/', advancedResults(Course, { path: 'bootcamp reviews', select: "name decription title text" }), courseCltr.getCourses);

//get single course
router.get('/:courseID', courseCltr.getCourse);

//post a single course
router.post('/', protect, authorize('publisher', 'admin'), courseCltr.postCourse);

//update course
router.put('/:courseID', protect, authorize('publisher', 'admin'), courseCltr.updateCourse);

//delete course
router.delete('/:courseID', protect, authorize('publisher', 'admin'), courseCltr.deleteCourse);

router.post('/:courseID/enroll', protect, authorize('user', 'admin'), courseCltr.enRoll);
module.exports = router;