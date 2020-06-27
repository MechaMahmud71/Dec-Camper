const mongoose = require('mongoose');

const slugify = require('slugify');

const geocoder = require('../utils/geocoder');

const BootcampSchma = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name"],
    unique: true,
    trim: true,
    maxLength: [50, "Name can not be more than 50 words"]
  },
  slug: String,
  description: {
    type: String,
    required: [true, "please add a name"],

    maxLength: [500, "Description can not be more than 500 words"]
  },
  website: {
    type: String,
    match: [/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/]
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "please add a valid email"]
  },
  address: { type: String, required: [true, "Plase add an address"] },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      //required: false
    },
    coordinates: {
      type: [Number],
      // required: false,
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      'Web Development', 'Mobile Development', 'UI/UX', 'Data Science', 'Business', 'Other'
    ]
  },
  averagerating: {
    type: Number,
    min: [1, "rating must be at least 1"],
    max: [10, "rating must be at max 10"]
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg'
  },
  housing: {
    type: Boolean,
    default: false
  },
  jobAssistance: {
    type: Boolean,
    default: false
  },
  jobGuarantee: {
    type: Boolean,
    default: false
  },
  acceptGi: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }


}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

BootcampSchma.pre('save', function (next) {
  //console.log("slugify ran", this.name);
  this.slug = slugify(this.name, { lower: true });

  next();
});

BootcampSchma.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);

  //console.log(loc);
  this.location = {
    type: "Point",
    coordinates: [loc[0].latitude, loc[0].longitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  }

  this.address = undefined;
  next();
})


BootcampSchma.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
})
BootcampSchma.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
})


BootcampSchma.pre('remove', async function (next) {
  //console.log(`${this._id} is removed`);
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
})



module.exports = mongoose.model("Bootcamp", BootcampSchma);