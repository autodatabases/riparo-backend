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
var SqlString = require("sqlstring");

/******** MODELS ***********/
const Orders = db.orders;
const User = db.users;

module.exports = {
  // GET ORDERS

  getAllOrders: async function (req, res) {
    try {
      let whereCond = {};
      // Pagination
      var page = 1;
      if (req.query.page) {
        page = req.query.page;
      }

      var limit = 10;
      if (req.query.limit) {
        limit = Number(req.query.limit);
      }

      const offset = (page - 1) * Number(limit);

      // search
      var search = "";
      if (req.query.search) {
        whereCond.orderNumber = { [Op.like]: "" + req.query.search + "%" };
      }

      // total records

      allOptions = await Orders.findAndCountAll({ where: whereCond });
      const totalPages = Math.ceil(allOptions.count / limit);

      var allOptionsP = {};
      allOptionsP = await Orders.findAll({
        attributes: [
          "id",
          "orderNumber",
          "total",
          "merchantOrder",
          "orderStatus",
          [
            sequelize.fn("date_format", sequelize.col("createdAt"), "%Y-%m-%d"),
            "createdAt",
          ],
        ],
        limit,
        offset,
        where: whereCond,
        // Add order conditions here....
        order: [["id", "DESC"]],
      });

      if (allOptions) {
        const _metadata = {
          totalRecords: allOptions.count,
          totalPages: totalPages,
        };

        return fun.returnResponse(
          res,
          true,
          200,
          "All Orders",
          allOptionsP,
          _metadata
        );
      } else {
        return fun.returnResponse(res, false, 204, "No orders Options.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get order

  getOrderDetail: async function (req, res) {
    try {
      // id valid
      var IsValid = {};
      IsValid = await Orders.findOne({
        where: {
          refPayco: req.query.id,
        },
      });

      if (!IsValid)
        return fun.returnResponse(
          res,
          false,
          202,
          "Order id with " + req.query.id + " not found."
        );

      var order = {};
      order = await Orders.findAll({
        where: {
          refPayco: req.query.id,
        },
        raw: true,
      });

      if (order) {
        for (var i = 0; i < order.length; i++) {
          order[i].userDetails = await User.findOne({
            where: {
              id: order[i].userId,
            },
            raw: true,
          });
        }

        return fun.returnResponse(res, true, 200, "Order", order);
      } else {
        return fun.returnResponse(res, false, 500, "Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
};
