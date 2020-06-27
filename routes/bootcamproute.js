const express = require('express');
const router = express.Router();
const bootCampCltr = require('../controller/bootcampCLTR');
const courseRouter = require('./courseroute');
const reviewRouter = require('./reviewroute');

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../model/Bootcamp');
const { protect, authorize } = require('../middleware/auth');

//get
//router.get('/', bootCampCltr.getBootCamp);
router.route('/').get(advancedResults(Bootcamp, 'courses'), bootCampCltr.getBootCamp);
router.get('/:id', bootCampCltr.getBootCampById);


//post
router.post('/', protect, authorize('publisher', 'admin'), bootCampCltr.postBootCamp);



//put

router.put('/:id', protect, authorize('publisher', 'admin'), bootCampCltr.putBootCamp);


router.put('/:id/photo', protect, authorize('publisher', 'admin'), bootCampCltr.bootcampPhotoUpload);
//delete

router.delete('/:id', protect, authorize('publisher', 'admin'), bootCampCltr.deleteBootCamp);





//get bootcamp within a redius

router.get('/radius/:zipcode/:distance', bootCampCltr.getBootcampsInRadius);

//get course with in bootcamps

router.use('/:bootcampID/courses', courseRouter);

router.use('/:bootcampID/reviews', reviewRouter);


module.exports = router;