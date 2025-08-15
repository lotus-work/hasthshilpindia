const dotenv = require('dotenv');
dotenv.config();  // Ensure env vars are loaded first

const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database Connected Successfully");

    // 🔹 Step 2: Drop legacy mobile_1 unique index if it exists
    const coll = mongoose.connection.collection("users"); // collection name in lowercase & plural
    const indexes = await coll.indexes();

    const mobileIndex = indexes.find(i => i.name === "mobile_1");
    if (mobileIndex) {
      console.log("⚠ Found legacy index mobile_1, dropping...");
      await coll.dropIndex("mobile_1");
      console.log("✅ Dropped legacy index mobile_1");
    } else {
      console.log("ℹ No legacy mobile_1 index found, all good.");
    }

  } catch (error) {
    console.error("❌ Database error:", error);
  }
};

module.exports = dbConnect;
