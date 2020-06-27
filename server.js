const express = require('express');
const fileupload = require('express-fileupload');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');
const cookieParser = require('cookie-parser')

const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');


connectDB();


dotenv.config({ path: "./config/config.env" });

const bootcampRoute = require('./routes/bootcamproute');
const courseRoute = require('./routes/courseroute');
const userRoute = require('./routes/userroute');
const adminRoute = require('./routes/adminroute');
const reviewsRoute = require('./routes/reviewroute');

const seedall = require('./seeder');

const app = express();

app.use(express.json());
app.use(fileupload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1/bootcamp', bootcampRoute);
app.use('/api/v1/courses', courseRoute);
app.use('/api/v1/reviews', reviewsRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/seedall', seedall);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server has started on ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold));

process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR:${err.message}`.red);
  server.close(() => process.exit(1));
})