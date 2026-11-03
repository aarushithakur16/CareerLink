// Database connection setup using Mongoose
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Could not connect to MongoDB. Check MONGO_URI in backend/.env and your Atlas Network Access IP list');
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;

