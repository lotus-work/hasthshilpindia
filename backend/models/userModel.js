const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname:  { type: String},
    email:     { type: String, required: true, unique: true },

    // ⬇️ no unique index here; allow undefined (not null) when absent
    mobile: { type: String, trim: true, default: undefined },

    password: { type: String }, // only for form signup
    authProvider: {
      type: String,
      enum: ["form", "google"],
      default: "form",
    },
    role: { type: String, default: "user" },
    isBlocked: { type: Boolean, default: false },
    cart: { type: Array, default: [] },
    address: {
      city: String, state: String, zipcode: String, street: String, apartment: String,
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: String,
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// ⛔️ REMOVE this if you still have it:
// userSchema.index({ mobile: 1 }, { unique: true, partialFilterExpression: { authProvider: "form" } });

// Hash password only for form signup
userSchema.pre("save", async function (next) {
  if (this.authProvider !== "form") return next();
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.isPasswordMatched = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
