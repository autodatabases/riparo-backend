const db = require("../../../models");
var dateFormat = require("dateformat");
const sequelize = require("sequelize");
var jwt = require("jsonwebtoken");
const Op = sequelize.Op;
var moment = require("moment");
var crypto = require("crypto");
const fun = require("../../../function/api_fun.js");
//const base_url = "http://localhost:4000";
const current_time = Math.floor(Date.now() / 1000);

var constants = require("../../../constants");

/******** MODELS ***********/

const User = db.users;
const MembershipOption = db.membershipOptions;

/** Belongs **/

/*model_name.belongsTo(another_model, {
  foreignKey: 'id'
});*/

module.exports = {
  logIn: async function (req, res) {
    try {
      req.check("email").isEmail().withMessage("Please enter valid email");
      req
        .check("password")
        .notEmpty()
        .withMessage("Please enter your password");
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
        user_data = user_data.toJSON();

        var passwordIsValid =
          crypto
            .createHash("sha1")
            .update(requestData.password)
            .digest("hex") == user_data.password
            ? 1
            : 0;
        if (!passwordIsValid)
          return fun.returnResponse(
            res,
            false,
            401,
            "Incorrect password entered."
          );

        var accountActive = user_data.accountStatus == "Active" ? 1 : 0;
        if (!accountActive)
          return fun.returnResponse(
            res,
            false,
            401,
            "Your account has been temporarily deactivated. Please contact support team"
          );

        delete user_data.password;

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

        // get user data

        var returnData = await User.findOne({
          where: {
            id: user_data.id,
          },
        });

        return fun.returnResponse(res, true, 200, "Login Success", returnData);
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

  logOut: async function (req, res) {
    try {
      await User.update(
        { token: null },
        {
          where: {
            id: req.id,
          },
        }
      );

      return fun.returnResponse(res, true, 200, "LogOut Success", []);
    } catch (error) {
      throw error;
    }
  },

  // get logged in user profile

  getProfile: async function (req, res) {
    try {
      var returnData = await User.findOne({
        where: {
          id: req.id,
        },
      });

      return fun.returnResponse(res, true, 200, "Login Success", returnData);
    } catch (error) {
      throw error;
    }
  },

  /*
|--------------------------------------------------------------------------
| MEMBERSHIP OPTIONS
|------------------------------------------------------------------------ */

  // add membership option

  addMembershipOption: async function (req, res) {
    try {
      req.check("title").notEmpty().withMessage("Please enter title.");
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

      var checkMembershipOption = {};
      checkMembershipOption = await MembershipOption.findOne({
        where: {
          title: requestData.title,
        },
      });

      if (!checkMembershipOption) {
        insert_data = await MembershipOption.create({
          title: requestData.title,
        });

        if (insert_data) {
          return fun.returnResponse(
            res,
            true,
            200,
            "Option Added Successfully"
          );
        } else {
          return fun.returnResponse(
            res,
            false,
            500,
            "Option cannot be inserted."
          );
        }
      } else {
        return fun.returnResponse(
          res,
          false,
          401,
          "Option already added with same title."
        );
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
};
