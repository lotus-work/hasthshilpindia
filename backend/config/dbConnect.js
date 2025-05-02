const dotenv = require('dotenv');
dotenv.config();  // Ensure this is at the top of your main server file (e.g., index.js)

const mongoose = require('mongoose');

const dbConnect = () => {
  try {
    console.log(process.env.MONGODB_URL);
    const conn = mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log("Database error:", error);
  }
};

module.exports = dbConnect;
