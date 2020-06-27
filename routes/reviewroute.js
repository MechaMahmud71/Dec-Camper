const express = require("express");

const router = express.Router({ mergeParams: true });

const Review = require('../model/Review');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const { getReviews, getReview, addBootcampReview, addCourseReview, updateReview, deleteReview } = require('../controller/reviewCLTR');

router.get('/', advancedResults(Review), getReviews);
router.get('/:reviewID', getReview);
router.post('/', protect, authorize('user', 'admin'), addBootcampReview);
//router.post('/course/:courseID', protect, authorize('user', 'admin'), addCourseReview)
router.put('/:reviewID', protect, authorize('user', 'admin'), updateReview);
router.delete('/:reviewID', protect, authorize('user', 'admin'), deleteReview);
module.exports = router;