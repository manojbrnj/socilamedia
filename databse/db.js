// Using Node.js `require()`
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const data = await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,

      useUnifiedTopology: true,
    });
    // console.log('connected');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
