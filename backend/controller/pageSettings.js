const { PageSettings } = require('../models/pageSetting');
const asyncHandler = require("express-async-handler");

const updatePage = asyncHandler(async (req, res) => {
  const { aboutUs, termsOfService, privacyPolicy, updatedBy, shippingPolicy, returnAndRefundPolicy } = req.body;

  try {
    let pageSettings = await PageSettings.findOne();

    if (pageSettings) {
      pageSettings.aboutUs = aboutUs;
      pageSettings.termsOfService = termsOfService;
      pageSettings.privacyPolicy = privacyPolicy;
      pageSettings.shippingPolicy = shippingPolicy;
      pageSettings.returnAndRefundPolicy = returnAndRefundPolicy;
      pageSettings.updatedBy = updatedBy;
    } else {
      pageSettings = new PageSettings({
        aboutUs,
        termsOfUse,
        privacyPolicy,
        updatedBy,
      });
    }

    const savedSettings = await pageSettings.save();

    res.status(200).json({
      success: true,
      data: savedSettings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating or adding page settings: " + err.message,
    });
  }
});


const getPage = asyncHandler(async (req, res) => {
  const { page } = req.query;
  console.log(typeof PageSettings.findOne);
  try {
    let projection = null;

    switch (page) {
      case "aboutUs":
        projection = { aboutUs: 1 };
        break;
      case "privacyPolicy":
        projection = { privacyPolicy: 1 };
        break;
      case "termsOfService":
        projection = { termsOfService: 1 };
        break;
      case "shippingPolicy":
        projection = { shippingPolicy: 1 };
        break;
      case "returnAndRefundPolicy":
        projection = { returnAndRefundPolicy: 1 };
        break;
      case "all":
        projection = {
          aboutUs: 1,
          termsOfService: 1,
          privacyPolicy: 1,
          updatedBy: 1,
          shippingPolicy: 1,
          returnAndRefundPolicy:1
        };
        break;
      default:
        return res.status(400).json({
          status: 400,
          isSuccessful: false,
          result: {
            message:
              'Invalid page parameter. Valid values are "aboutUs", "privacyPolicy", "termsOfUse", or "all".',
          },
        });
    }

    const pageSettings = await PageSettings.findOne({}, projection).populate(
      "updatedBy",
      "username emailAddress"
    );

    if (!pageSettings) {
      return res.status(404).json({
        status: 404,
        isSuccessful: false,
        result: { message: "Page settings not found." },
      });
    }

    res.status(200).json({
      status: 200,
      isSuccessful: true,
      result: pageSettings,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      isSuccessful: false,
      result: { message: "Error fetching page settings: " + err.message },
    });
  }
});
module.exports = {
  updatePage,
  getPage,
};
