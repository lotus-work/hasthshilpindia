const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require('dotenv');

const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

dotenv.config();
console.log('MONGODB_URL:', process.env.MONGODB_URL); 
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 5000;

dbConnect(); // 🔹 This now also drops the bad index automatically

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// API routes
app.use("/api/user", require("./routes/authRoute"));
app.use("/api/product", require("./routes/productRoute"));
app.use("/api/blog", require("./routes/blogRoute"));
app.use("/api/category", require("./routes/prodcategoryRoute"));
app.use("/api/blogcategory", require("./routes/blogCatRoute"));
app.use("/api/brand", require("./routes/brandRoute"));
app.use("/api/coupon", require("./routes/couponRoute"));
app.use("/api/color", require("./routes/colorRoute"));
app.use("/api/enquiry", require("./routes/enqRoute"));
app.use("/api/upload", require("./routes/uploadRoute"));
app.use("/api/page", require("./routes/pageSettings"));

// Serve frontend
const frontendPath = path.join(__dirname, '../frontend/dist/app-name/browser');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at PORT ${PORT}`);
});
