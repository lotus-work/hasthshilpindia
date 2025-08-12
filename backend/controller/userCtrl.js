const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const {validateMongoDbId} = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const { addEmailJob } = require('../utils/emailQueue'); 
const { createPasswordResetToken } = require("../models/userModel");
const otpStore = new Map();
const twilio = require('twilio');
const axios = require("axios");
const qs = require("qs");



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = twilio(accountSid, authToken);


// Create a User ----------------------------------------------

const createUser = asyncHandler(async (req, res) => {
  const { email, mobile, authProvider } = req.body;

  if (authProvider === 'form' && !mobile) {
    res.status(400);
    throw new Error("Mobile number is required for form signup");
  }

  if (authProvider === 'form' && !req.body.password) {
    res.status(400);
    throw new Error("Password is required for form signup");
  }

  const findUser = await User.findOne({ email });
if (findUser) {
  return res.status(409).json({
    status: "fail",
    message: "User already exists"
  });
}

  const newUser = await User.create(req.body);
  res.json(newUser);
});


// Login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
  const { identifier, password, authProvider } = req.body;

  if (authProvider === 'form') {
    if (!password) throw new Error("Password required for form login");
    if (/^[0-9]{10,}$/.test(identifier)) {
      var findUser = await User.findOne({ mobile: identifier, authProvider: 'form' });
    } else {
      var findUser = await User.findOne({ email: identifier, authProvider: 'form' });
    }
    if (!findUser || !(await findUser.isPasswordMatched(password))) {
      throw new Error("Invalid Credentials");
    }
  } else if (authProvider === 'google') {
    var findUser = await User.findOne({ email: identifier, authProvider: 'google' });
    if (!findUser) {
      // Create account without mobile/password if new Google signup
      findUser = await User.create({
        email: identifier,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        authProvider: 'google'
      });
    }
  }

  const refreshToken = await generateRefreshToken(findUser._id);
  await User.findByIdAndUpdate(findUser._id, { refreshToken }, { new: true });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 27 * 24 * 60 * 60 * 1000
  });

  res.json({
    _id: findUser._id,
    firstname: findUser.firstname,
    lastname: findUser.lastname,
    email: findUser.email,
    mobile: findUser.mobile,
    token: generateToken(findUser._id),
  });
});


const checkUserExistsCtrl = asyncHandler(async (req, res) => {
  const { email, mobile } = req.body;

  if (!email || !mobile) {
    res.status(400);
    throw new Error("Email and mobile number are required");
  }

  const userExists = await User.findOne({
    $or: [{ email }, { mobile }]
  });

  if (userExists) {
    res.status(200).json({
      exists: true,
      message: "User already exists with given email or mobile number",
    });
  } else {
    res.status(200).json({
      exists: false,
      message: "No user exists with given email or mobile number",
    });
  }
});


// admin login

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
       maxAge: 27 * 24 * 60 * 60 * 1000
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a user by admin

const updatedUserByAdmin = asyncHandler(async (req, res) => {
  const { _id, firstname, lastname, email, mobile } = req.body;

  if (!_id) {
    return res.status(400).json({ status: 'fail', message: 'User _id is required' });
  }

  validateMongoDbId(_id);

  try {
    // Check if the new email is already in use by another user
    if (email) {
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser._id.toString() !== _id) {
        return res.status(400).json({ status: 'fail', message: 'Email already in use by another user' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { firstname, lastname, email, mobile },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.json({
      status: 'success',
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
      stack: error.stack,
    });
  }
});

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    // Only include fields that are not undefined or null
    const addressData = {};
    if (req.body.city) addressData.city = req.body.city;
    if (req.body.state) addressData.state = req.body.state;
    if (req.body.zipcode) addressData.zipcode = req.body.zipcode;
    if (req.body.street) addressData.street = req.body.street;
    if (req.body.apartment) addressData.apartment = req.body.apartment;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { address: addressData },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users

const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().populate("wishlist");
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const getaUser = await User.findById(id);
    res.json({
      getaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const deleteaUser = await User.findByIdAndDelete(id);
    res.json({
      deleteaUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();

    await user.save();
    console.log(token);
    const resetURL = `
  <div style="font-family: Arial, sans-serif; color: #000000; padding: 20px;">
    <h2>Reset Your Password</h2>
    <p>
      Hi,<br/><br/>
      Please follow the link below to reset your password. This link is valid for the next 10 minutes.
    </p>
    <p>
      <a href="https://hasthshilp.com/reset-password/${token}" style="color: #000000; text-decoration: underline;">
        Click here to reset your password
      </a>
    </p>
    <p>
      If you did not request this change, please ignore this email.
    </p>
    <p>
      Regards,<br/>
      Team Hasthshilp
    </p>
  </div>
`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetURL,
    };
    sendEmail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only the specific fields
    const response = {
      _id: findUser._id,
      email: findUser.email,
      refreshToken: findUser.refreshToken,
      wishlist: findUser.wishlist
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const userCart = asyncHandler(async (req, res) => {
  const { productId, color, quantity, price } = req.body;

  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let newCart = await new Cart({
      userId: _id,
      productId,
      color,
      price,
      quantity,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId: _id })
      .populate("productId")
      .populate("color");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const removeProductFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId } = req.params;
  validateMongoDbId(_id);
  try {
    const deleteProductFromcart = await Cart.deleteOne({
      userId: _id,
      _id: cartItemId,
    });

    res.json(deleteProductFromcart);
  } catch (error) {
    throw new Error(error);
  }
});

const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const deleteCart = await Cart.deleteMany({
      userId: _id,
    });

    res.json(deleteCart);
  } catch (error) {
    throw new Error(error);
  }
});

const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { cartItemId, newQuantity } = req.params;
  validateMongoDbId(_id);
  try {
    const cartItem = await Cart.findOne({
      userId: _id,
      _id: cartItemId,
    });
    cartItem.quantity = newQuantity;
    cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
});

const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
    paymentInfo,
  } = req.body;

  const { _id } = req.user;

  const normalizedTotalPrice = totalPrice / 100;
  const normalizedTotalPriceAfterDiscount = totalPriceAfterDiscount / 100;

  // Step 1: Get user details from DB
  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Step 2: Create the order
  let order;
  try {
    order = await Order.create({
      shippingInfo,
      orderItems,
      totalPrice: normalizedTotalPrice,
      totalPriceAfterDiscount: normalizedTotalPriceAfterDiscount,
      paymentInfo,
      user: _id,
      orderStatus: 'Ordered', // Default status
    });

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Not enough stock for product ${product.name}`);
      }

      product.quantity -= item.quantity;
      await product.save();
    }

    // Step 4: Add email job to queue
    addEmailJob({
      email: user.email,
      name: `${user.firstname} ${user.lastname}`,
      orderId: order._id,
      status: order.orderStatus,
    });

    // Step 5: Return success response
    res.json({
      order,
      success: true,
    });
  } catch (error) {
    // Step 6: Update order status if error occurs
    if (order && order._id) {
      order.orderStatus = 'Failed';
      await order.save();
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Order creation failed',
    });
  }
});



const getMyOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find({ user: _id })
      .populate("user")
      .populate("orderItems.product")
      .populate("orderItems.color")
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order

    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const orders = await Order.find().populate("user").sort({ createdAt: -1 });
    // .populate("orderItems.product")
    // .populate("orderItems.color");
    res.json({
      orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getRecentOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .sort({ createdAt: -1 }) // Newest first
      .limit(10); // Limit to top 10

    res.json({ orders });
  } catch (error) {
    throw new Error(error);
  }
});


const getsingleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.findOne({ _id: id })
      .populate("user")
      .populate("orderItems.product")
      .populate("orderItems.color");
    res.json({
      orders,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('user');
  
    if (!order) throw new Error("Order not found");
  
    order.orderStatus = req.body.status;
    await order.save();
  
  // Push email to queue
  addEmailJob({
    email: order.user.email,
    name: `${order.user.firstname} ${order.user.lastname}`,
    orderId: order._id,
    status: order.orderStatus,
  });
    res.json({
      order,
    });

   
  } catch (error) {
    throw new Error(error);
  }
});



const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
        },
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
});

const getYearlyTotalOrder = asyncHandler(async (req, res) => {
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
    endDate = monthNames[d.getMonth()] + " " + d.getFullYear();
  }
  const data = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $lte: new Date(),
          $gte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        amount: { $sum: 1 },
        amount: { $sum: "$totalPriceAfterDiscount" },
        count: { $sum: 1 },
      },
    },
  ]);
  res.json(data);
});

const getOrderAnalytics = asyncHandler(async (req, res) => {
  const { year } = req.query;

  try {
    const selectedYear = parseInt(year) || new Date().getFullYear();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11

    // Aggregate orders grouped by month
    const orders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${selectedYear}-01-01`),
            $lte: new Date(`${selectedYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          amount: { $sum: "$totalPriceAfterDiscount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
    ]);

    // Map for easier lookup
    const orderMap = {};
    orders.forEach((order) => {
      orderMap[order._id.month] = {
        amount: order.amount,
        count: order.count,
      };
    });

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    // Build response only till current month (if year == current year)
    const fullYearData = [];
    const monthsToShow = selectedYear === currentYear ? currentMonth : 12;

    for (let i = 1; i <= monthsToShow; i++) {
      fullYearData.push({
        _id: {
          month: monthNames[i - 1],
          year: selectedYear,
        },
        amount: orderMap[i]?.amount || 0,
        count: orderMap[i]?.count || 0,
      });
    }

    res.json(fullYearData);
  } catch (error) {
    throw new Error(error);
  }
});

// Send OTP
const sendOtp = asyncHandler(async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) {
    res.status(400);
    throw new Error("Mobile number is required");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
const message = `Your OTP from Hasthshilp is ${otp}. This code is valid for 5 minutes. Do not share it with anyone.`;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  try {
    await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      qs.stringify({
        To: `+91${mobile}`,
        From: from,
        Body: message,
      }),
      {
        auth: {
          username: accountSid,
          password: authToken,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    otpStore.set(mobile, {
      otp,
      expiry: Date.now() + 5 * 60 * 1000,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify OTP
const verifyOtp = asyncHandler(async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    res.status(400);
    throw new Error("Mobile and OTP are required");
  }

  const storedOtp = otpStore.get(mobile);

  if (!storedOtp) {
    return res.status(400).json({ success: false, message: "OTP not found or expired" });
  }

  if (Date.now() > storedOtp.expiry) {
    otpStore.delete(mobile);
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  otpStore.delete(mobile); // Clean up on success
  res.status(200).json({ success: true, message: "OTP verified successfully" });
});



module.exports = {
  sendOtp,
  verifyOtp,
  createUser,
  loginUserCtrl,
  checkUserExistsCtrl,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  updatedUserByAdmin,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  createOrder,
  getMyOrders,
  emptyCart,
  getMonthWiseOrderIncome,
  getAllOrders,
  getRecentOrders,
  getsingleOrder,
  updateOrder,
  getYearlyTotalOrder,
  getOrderAnalytics,
  removeProductFromCart,
  updateProductQuantityFromCart,
};
