const Bootcamp = require('../model/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
//const advancedResults=require('../middleware/advancedResults');

//GET
exports.getBootCamp = async (req, res, next) => {

  try {
    res.json(res.advancedResults);
  } catch (error) {
    // res.json({ success: false, msg: "error" });
    next(error);
  }


}

//Get single bootcamp

exports.getBootCampById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const bootcamp = await Bootcamp.findById(id).populate({
      path: "courses reviews", select: "name description title text rating user"
    });
    if (!bootcamp) {
      // return res.json({ success: false, msg: "error" });
      next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.json({ success: true, data: bootcamp })
  } catch (error) {
    //res.json({ success: false, msg: "error" });
    //next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    next(error);
  }
}




//POST
exports.postBootCamp = async (req, res, next) => {

  try {
    // add user to body which will be added to the bootcamp model
    // here the req.user.id is coming from {publish} middleware which is checking the user is authorized by jwt or not 


    req.body.user = req.user.id;

    //check if the publisher already added a bootcamp or not in other words a boot publisher bootcamp exists or not

    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    //if the user is not admin he can not add more than one bootcamp

    if (publishedBootcamp && req.user.role !== "admin") {
      return next(new ErrorResponse(`The user with ${req.user.role} has already published a bootcamp`, 400));
    }




    const bootcamp = await Bootcamp.create(req.body);

    // console.log(req.body.user);

    res.json({ success: true, data: bootcamp });
  } catch (error) {
    // res.json(
    //   { success: false }
    // )
    next(error);
  }

}

//UPDATE
exports.putBootCamp = async (req, res, next) => {

  try {

    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      next(new ErrorResponse(`No boot camp found`), 401);
    }

    if (req.user.id !== bootcamp.user.toString()) {
      next(new ErrorResponse(`Now authorized to edit the boot camp`, 401));
    }


    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true

    })
    res.json({ success: true, data: bootcamp });
  } catch (error) {
    // return res.json({ success: false, msg: "error" });
    next(error);
  }

}
//DElETE
exports.deleteBootCamp = async (req, res, next) => {
  //const id = req.params.id;
  try {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      next(new ErrorResponse(`No bootcamp found`), 401);
    }

    if (req.user.id !== bootcamp.user.toString()) {
      next(new ErrorResponse(`Now authorized to edit the boot camp`, 401));
    }
    bootcamp.remove();
    res.json({ success: true, data: {} })
  } catch (error) {
    // res.json({ success: false, msg: "error" });
    next(error);
  }
}
//GET 
//get bootcamps within radius
exports.getBootcampsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;

  try {
    const loc = await geocoder.geocode(zipcode);

    console.log(loc);

    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lat, lng], radius]
        }
      }
    });

    res.json(
      { success: true, count: bootcamps.length, data: bootcamps }
    );
  } catch (error) {
    next(error);
  }

}
//photo upload
// put req
// api/v1/bootcamp/:id/photo

exports.bootcampPhotoUpload = async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  //res.json({ data: bootcamp });
  if (!bootcamp) {
    //console.log(error);
    next(new ErrorResponse(`No Bootcamp found with id of ${bootcamp._id}`, 400));
  }


  if (req.user.id !== bootcamp.user.toString()) {
    next(new ErrorResponse(`Now authorized to edit the boot camp`, 401));
  }

  if (!req.files) {
    // res.json(
    //   { success: false, data: {}, message: "no file has been uploaded" }
    // )
    next(new ErrorResponse(`Please upload file`, 401));
  }
  //console.log(req.files.file);

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    next(new ErrorResponse(`Please upload image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
  }
  const splitArr = file.name.split('.');

  //console.log(splitArr);

  file.name = `photo_${bootcamp._id}.${splitArr[1]}`;

  //console.log(file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    // if (err) {
    //   console.log(err);
    // }
    // res.json(
    //   { success: true, data: file.name }
    // )



  })


}