const mongoose = require('mongoose');

const connectDB = async () => {
  const connection = await mongoose.connect('mongodb+srv://mahmud:mahmud@cluster0-jvn0s.gcp.mongodb.net/Devcampers?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  console.log(`Mongodb is connected`.yellow.bold);
}

module.exports = connectDB