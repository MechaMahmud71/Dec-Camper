const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Plase add a couse title"]
  },
  text: {
    type: String,
    maxlength: 2000,
    required: [true, "Plase add a couse description"]
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Plase add reviews"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }


});



module.exports = mongoose.model("Review", reviewSchema);