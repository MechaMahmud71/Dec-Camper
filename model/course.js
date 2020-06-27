const mongoose = require('mongoose');

const CourseSchma = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Plase add a couse title"]
  },
  description: {
    type: String,

    required: [true, "Plase add a couse description"]
  },
  weeks: {
    type: String,

    required: [true, "Plase add a couse weeks"]
  },
  tuition: {
    type: Number,

    required: [true, "Plase add a couse tution"]
  },
  minimumSkill: {
    type: String,
    required: [true, "Plase add a minimum skill"],
    enum: ['beginner', 'intermediate', 'advanced']
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  // reviews: []


}
)

// }, {
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// CourseSchma.virtual('reviews', {
//   ref: 'Review',
//   localField: '_id',
//   foreignField: 'course',
//   justOne: false
// })

CourseSchma.statics.getAverageCost = async function (bootcampID) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampID }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ])

  // console.log(obj);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampID, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    })
  } catch (error) {
    console.log(error)
  }


}







CourseSchma.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
})

CourseSchma.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
})

module.exports = mongoose.model("Course", CourseSchma);