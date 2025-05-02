const mongoose = require('mongoose');
const { Schema } = mongoose;

const pageSettingsSchema = new Schema({
    aboutUs: { type: String },
    termsOfService: { type: String },
    privacyPolicy: { type: String },
    shippingPolicy: { type: String },
    returnAndRefundPolicy: { type: String },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { 
    versionKey: false,
    timestamps: true // Enable timestamps here
});

const PageSettings = mongoose.model('PageSettings', pageSettingsSchema);

module.exports = {
    PageSettings
};