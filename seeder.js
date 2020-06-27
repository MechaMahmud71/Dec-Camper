const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const Bootcamp = require('./model/Bootcamp');

const express = require('express');
const Course = require('./model/course');
const User = require('./model/User');
const Review = require('./model/Review');
const router = express.Router();


dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/data/bootcamps.json`));
//console.log(bootcamps.length);
const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`));
router.post('/', async (req, res, next) => {
  // for (let i = 0; i < bootcamps.length; i++) {
  //   await Bootcamp.create(bootcamps[i]);

  // }
  // for (let i = 0; i < courses.length; i++) {
  //   await Course.create(courses[i]);

  // }
  // for (let i = 0; i < users.length; i++) {
  //   await User.create(users[i]);

  // }
  for (let i = 0; i < reviews.length; i++) {
    await Review.create(reviews[i]);

  }

  //res.json({ bootcamps: bootcamps, courses, users })
  //res.json({ data: courses });
  //res.json({ data: users });
  res.json({ data: reviews });

})

module.exports = router;



// const importData = async () => {
//   try {
//     await Bootcamp.create(bootcamps);
//     console.log('Data Imported....'.green.inverse);
//     process.exit();
//   } catch (error) {
//     console.error(error);
//   }
// }
// importData();

// const bootcampsLength = bootcamps.length;
// bootcamps.forEach((bootcamp, index) => {
//   // importData(bootcamp);
//   Bootcamp.create(bootcamp);
//   console.log(bootcamp)
//   console.log(`Bootcamp${index + 1} is added`);
//   if (index === bootcampsLength - 1) {
//     process.exit();
//   }

// })
// const importData = async () => {
//   try {
//     await Bootcamp.create(bootcamp);
//     console.log('Data Imported....'.green.inverse);
//     //process.exit();
//   } catch (error) {
//     console.error(error);
//   }
// }
// const deleteData = async () => {
//   try {
//     await Bootcamp.deleteMany();
//     console.log('Data destryed....'.red.inverse);
//     process.exit();
//   } catch (error) {
//     console.error(error);
//   }
// }

// if (process.argv[2] === '-i') {
//   importData();
// }
// else if (process.argv[2] === "-d") {
//   deleteData();
// }




