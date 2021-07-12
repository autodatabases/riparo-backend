const db = require("../../../models");
const sequelize = require("sequelize");
const Op = sequelize.Op;
var moment = require("moment");
const fun = require("../../../function/api_fun.js");
var mercadopago = require("mercadopago");

// Constants
const constants = require("../../../constants");

// Set mercado pago credentias
mercadopago.configurations.setAccessToken(constants.MERCADO_PAGO_ACCESS_TOKEN);

/******** MODELS ***********/
const User = db.users;
const Orders = db.orders;
const OrderItems = db.orderItems;
const Discounts = db.discounts;

module.exports = {
  // Checkout
  checkout: async function (req, res) {
    try {
      // Validate params
      req
        .check("cartItems")
        .notEmpty()
        .withMessage("cartItems cannot be empty");
      req
        .check("itemCount")
        .notEmpty()
        .withMessage("itemCount cannot be empty");

      // Parse cart items
      const parsedItems = JSON.parse(req.body.cartItems);

      // Init preference items for mercado pago
      const preferenceItems = parsedItems.map((item) => {
        const mfrName = `${item.mfrName} - ` || "";
        const articleName =
          item.genericArticles && item.genericArticles[0]
            ? `${item.genericArticles[0].genericArticleDescription} - `
            : "";
        let title = `${mfrName}${articleName} (${item.articleNumber})`;

        return {
          title,
          unit_price: Number(item.salePrice),
          quantity: Number(item.quantity),
        };
      });

      // Init params for mercado pago
      let preference = {
        items: preferenceItems,
        back_urls: {
          success: `${constants.DOMAIN_URL}/orderCallback`,
          failure: `${constants.DOMAIN_URL}/orderCallback`,
          pending: `${constants.DOMAIN_URL}/orderCallback`,
        },
        auto_return: "approved",
      };

      // Mercado pago create preference
      const response = await mercadopago.preferences.create(preference);

      // Create a new order data
      const newOrderData = {
        orderNumber: fun.getOtp(),
        userId: req.id,
        total: req.body.total,
        totalItems: req.body.totalOrderItems,
        merchantOrder: response.body.id,
        currency: "COP",
        orderStatus: "pending",
      };
      const newOrder = await Orders.create(newOrderData);

      // Save a order items
      for (const orderItem of preferenceItems) {
        const newOrderItem = {
          orderId: newOrder.id,
          articleNumber: orderItem.title,
          quantity: orderItem.quantity,
          unit_price: orderItem.unit_price,
          total: orderItem.unit_price * orderItem.quantity,
        };

        await OrderItems.create(newOrderItem);
      }

      res.json(response.body);
    } catch (error) {
      throw error;
    }
  },
  orderCallback: async (req, res) => {
    res.json({
      Payment: req.query.payment_id,
      Status: req.query.status,
      MerchantOrder: req.query.merchant_order_id,
    });

    res.redirect(301, `${constants.DOMAIN_URL}/orders`);
  },
  checkCoupon: async function (req, res) {
    try {
      req.check("code").notEmpty().withMessage("Please enter coupon code");
      var error = req.validationErrors();
      if (error) {
        return fun.returnResponse(
          res,
          false,
          400,
          fun.checkRequired(error).message
        );
      }

      var requestData = req.body;

      var checkD = {};
      checkD = await Discounts.findOne({
        where: {
          code: requestData.code,
        },
        raw: true,
      });

      if (checkD) {
        // check expiry
        var expiryDate = moment
          .utc(checkD.expiryDateTime)
          .format("Y-MM-DD hh:mm:ss");
        var dateNow = await fun.getDate();
        if (expiryDate < dateNow) {
          return fun.returnResponse(res, false, 400, "Coupon code expired");
        }

        // check max redemptions

        var checkR = {};
        checkR = await Orders.count({
          where: {
            coupon: requestData.code,
          },
          raw: true,
        });

        if (checkR == checkD.maxRedemptions) {
          return fun.returnResponse(
            res,
            false,
            400,
            "Coupon code not available"
          );
        }

        return fun.returnResponse(
          res,
          true,
          200,
          "Coupon Applied Successfully",
          checkD
        );
      } else {
        return fun.returnResponse(res, false, 400, "Incorrect Coupon Code");
      }
    } catch (error) {
      throw error;
    }
  },
};
