const db = require("../../../models");
var dateFormat = require("dateformat");
const sequelize = require("sequelize");
var jwt = require("jsonwebtoken");
const Op = sequelize.Op;
var moment = require("moment");
var crypto = require("crypto");
const fun = require("../../../function/api_fun.js");
const fs = require("fs");
const FileType = require("file-type");
const current_time = Math.floor(Date.now() / 1000);
const readXlsxFile = require("read-excel-file/node");
var nodemailer = require("nodemailer");

var constants = require("../../../constants");

/******** MODELS ***********/

const User = db.users;

module.exports = {
  signUp: async function (req, res) {
    try {
      req.check("firstName").notEmpty().withMessage("Please enter first name");
      req.check("lastName").notEmpty().withMessage("Please enter last name");
      req.check("email").isEmail().withMessage("Please enter valid email");
      req
        .check("password")
        .notEmpty()
        .withMessage("Please enter your password");
      req
        .check("userType")
        .notEmpty()
        .withMessage("Please enter your userType");
      var error = req.validationErrors();
      if (error) {
        return fun.returnResponse(
          res,
          false,
          400,
          fun.checkRequired(error).message
        );
        return false;
      }

      var requestData = req.body;
      const password = crypto
        .createHash("sha1")
        .update(requestData.password)
        .digest("hex");

      var user_data = {};
      user_data = await User.findOne({
        where: {
          email: requestData.email,
        },
      });

      if (user_data) {
        return fun.returnResponse(
          res,
          false,
          409,
          "Email is already registered with another account"
        );
        return false;
      }

      var code = fun.getOtp();

      if (requestData.userType === "Customer") {
        var status = "Active";
      } else {
        var status = "Inactive";
      }

      insertData = await User.create({
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        email: requestData.email,
        password: password,
        userType: requestData.userType,
        businessName: requestData.businessName,
        verificationCode: code,
        accountStatus: status,
      });

      if (insertData) {
        // get user data
        var returnData = await User.findOne({
          where: {
            email: requestData.email,
          },
        });

        if (requestData.userType === "Customer") {
          // sending email verification code
          var data = {
            firstName: requestData.firstName,
            lastName: requestData.lastName,
            email: requestData.email,
            to: requestData.email,
            subject: "Email Verification",
            verificationCode: code,
          };

          fun.sendEmail(req, res, data, "emailVerification.html");

          // update user token

          var token = jwt.sign({ id: returnData.id }, constants.API_SECRET, {
            expiresIn: 86400, // expires in 24 hours
          });

          await User.update(
            { token: token },
            {
              where: {
                id: returnData.id,
              },
            }
          );
        }

        // get user data

        var returnData = await User.findOne({
          where: {
            id: returnData.id,
          },
        });

        return fun.returnResponse(
          res,
          true,
          200,
          "Account Created Successfully",
          returnData
        );
      } else {
        return fun.returnResponse(
          res,
          false,
          500,
          "Something went wrong ! Please try again later."
        );
      }
    } catch (error) {
      throw error;
    }
  },

  // Forgot Password

  forgotPassword: async function (req, res) {
    try {
      req.check("email").isEmail().withMessage("Please enter valid email");
      var error = req.validationErrors();
      if (error) {
        return fun.returnResponse(
          res,
          false,
          400,
          fun.checkRequired(error).message
        );
        return false;
      }

      var requestData = req.body;

      var user_data = {};
      user_data = await User.findOne({
        where: {
          email: requestData.email,
        },
      });

      if (user_data) {
        user_data = user_data.toJSON();

        // update user token
        var token = jwt.sign({ id: user_data.id }, constants.API_SECRET, {
          expiresIn: 86400, // expires in 24 hours
        });

        await User.update(
          { token: token },
          {
            where: {
              id: user_data.id,
            },
          }
        );

        // sending email verification code

        var data = {
          firstName: user_data.firstName,
          lastName: user_data.lastName,
          to: user_data.email,
          subject: "Reset Password",
          resetLink: (await fun.appBaseUrl()) + "/reset-password/" + token,
        };

        fun.sendEmail(req, res, data, "resetPassword.html");

        return fun.returnResponse(
          res,
          true,
          200,
          "Password reset link has been sent to your email."
        );
      } else {
        return fun.returnResponse(
          res,
          false,
          401,
          "Email is not registered with us."
        );
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  resendCode: async function (req, res) {
    try {
      var returnData = await User.findOne({
        where: {
          id: req.id,
        },
      });

      var code = fun.getOtp();

      updateData = await User.update(
        { verificationCode: code },
        {
          where: {
            id: req.id,
          },
        }
      );

      if (updateData) {
        // sending email verification code

        var data = {
          firstName: returnData.firstName,
          lastName: returnData.lastName,
          email: returnData.email,
          to: returnData.email,
          subject: "Email Verification",
          verificationCode: code,
        };

        fun.sendEmail(req, res, data, "emailVerification.html");

        return fun.returnResponse(res, true, 200, "Code Sent Successfully");
      } else {
        return fun.returnResponse(
          res,
          false,
          500,
          "Something went wrong ! Please try again later."
        );
      }
    } catch (error) {
      throw error;
    }
  },

  verifyCode: async function (req, res) {
    try {
      req
        .check("code")
        .notEmpty()
        .withMessage("Please enter verification code");
      var error = req.validationErrors();
      if (error) {
        return fun.returnResponse(
          res,
          false,
          400,
          fun.checkRequired(error).message
        );
        return false;
      }

      var requestData = req.body;

      var user_data = {};
      user_data = await User.findOne({
        where: {
          id: req.id,
          verificationCode: requestData.code,
        },
      });

      if (user_data) {
        // update user

        await User.update(
          { isEmailVerified: "Yes", emailVerifiedAt: await fun.getDate() },
          {
            where: {
              id: req.id,
            },
          }
        );

        return fun.returnResponse(
          res,
          true,
          200,
          "Email Verified Successfully"
        );
        return false;
      } else {
        return fun.returnResponse(
          res,
          false,
          400,
          "Incorrect Verification Code"
        );
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
};
