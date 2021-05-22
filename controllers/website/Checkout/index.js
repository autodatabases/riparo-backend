const db = require('../../../models');
var dateFormat = require('dateformat');
const sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
const Op = sequelize.Op;
var moment = require('moment');
var crypto = require('crypto');
const fun = require('../../../function/api_fun.js');
const fs = require('fs');
const FileType = require('file-type');
const current_time = Math.floor(Date.now() / 1000);
const readXlsxFile = require('read-excel-file/node');
var SqlString = require('sqlstring');
var moment = require('moment');
var mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: 'TEST-8367823257465789-041012-012a0e7a16e55bedfbbda803deb2a15a-739189994'
});

var epayco = require('epayco-sdk-node')({
    apiKey: 'b6497eb1f8afadd38f94db3af5daad27',
    privateKey: '6146d89baedc71d476f33545c029a77a',
    lang: 'EN',
    test: true
});

/******** MODELS ***********/
const User = db.users;
const Orders = db.orders;
const Discounts = db.discounts;

module.exports = {
  
  // Checkout
  checkout: async function (req, res) {
    try {
      req.check('number').notEmpty().withMessage('Card Number cannot be empty');
      req.check('exp_year').notEmpty().withMessage('exp_year cannot be empty');
      req.check('exp_month').notEmpty().withMessage('exp_month cannot be empty');
      req.check('cvc').notEmpty().withMessage('cvc cannot be empty');
      req.check('cartItems').notEmpty().withMessage('cartItems cannot be empty');
      req.check('itemCount').notEmpty().withMessage('itemCount cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // Crea un objeto de preferencia
      let preference = {
        items: [
          {
            title: 'Mi producto',
            unit_price: 100,
            quantity: 1,
          }
        ]
      };

      mercadopago.preferences.create(preference)
      .then(function(response){
      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
        console.log(response.body);
      }).catch(function(error){
        console.log(error);
      });

    return false;

      requestData.tagId = 'ODR' + await fun.randomString(8);

      // creating token
      var credit_info = {
          "card[number]": requestData.number,
          "card[exp_year]": requestData.exp_year,
          "card[exp_month]": requestData.exp_month,
          "card[cvc]": requestData.cvc
      }

      var tokenData = await epayco.token.create(credit_info)
                  .then(function(token) {
                      if(token.status){
                        //console.log('TOKEN' + token);
                        return token;
                      }else{
                        return  fun.returnResponse(res,false,400,"Epayco Error : " + token.data.description);
                      }
                  })
                  .catch(function(err) {
                      return  fun.returnResponse(res,false,400,"Epayco Error : " + err.message);
                  });

      // user epayco id

      var userData =  await User.findOne({
                            where:{
                              id : req.id,
                            }
                          });

      if(!userData.stripeCustomerId){
        var customer_info = {
            token_card: tokenData.id,
            name: userData.firstName,
            last_name: userData.lastName, 
            email: String(userData.email),
            default: true,
            //Optional parameters: These parameters are important when validating the credit card transaction
            city: String(userData.city),
            address: String(userData.address),
            phone: String(userData.phoneNumber),
            cell_phone: String(userData.phoneNumber)
        }

        var customerData = await epayco.customers.create(customer_info)
            .then(function(customer) {
                if(customer.status){
                  return customer;
                }else{
                  return  fun.returnResponse(res,false,400,"Epayco Error : " + customer.data.description);
                }
            })
            .catch(function(err) {
                return  fun.returnResponse(res,false,400,"Epayco Error : " + err.message);
            });

        // update user epayco id

        await User.update({ stripeCustomerId:customerData.data.customerId },{
          where:{
            id : userData.id
          }
        });
      }


      var userData =  await User.findOne({
                            where:{
                              id : req.id,
                            }
                          });

      //console.log((requestData.total*100));

      var payment_info = {
        token_card: tokenData.id,
        customer_id: userData.stripeCustomerId,
        doc_type: "CC",
        doc_number: "1035851980",
        name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        description: "EPAYCO Payment",
        value: "300",
        tax: "10",
        currency: "COP",
        dues: "12",
        tax_base: "10",
        method_confirmation: "GET",
        use_default_card_customer: true,
        cell_phone: "998234242"
    }

    console.log(payment_info);

    var transactionData = await epayco.charge.create(payment_info)
                          .then(function(txnRes) {
                              //console.log(txnRes.data.errors);
                              return txnRes;
                          })
                          .catch(function(err) {
                              console.log("err: " + err);
                          });

      console.log(transactionData);
    
      if(transactionData.success){

        requestData.cartItems = JSON.parse(requestData.cartItems);

        if(requestData.cartItems.length){

          for(var i=0; i<requestData.cartItems.length; i++){

            var itttm = requestData.cartItems[i];

            if(itttm.hasOwnProperty('supplierId')){
              var supplierId = requestData.cartItems[i].supplierId;
            }else{
              var supplierId = 0;
            }

            var orderNumber = await fun.getOtp();

            insert_data = await Orders.create({
                                      userId: req.id,
                                      tagId: requestData.tagId,
                                      orderNumber: orderNumber,
                                      supplierId: supplierId,
                                      amount: requestData.total,
                                      totalItems: requestData.itemCount,
                                      items: JSON.stringify(requestData.cartItems[i]),
                                      refPayco: transactionData.data.ref_payco,
                                      factura: transactionData.data.factura,
                                      description: transactionData.data.descripcion,
                                      currency: transactionData.data.moneda,
                                      coupon: requestData.coupon
                                    });

          }

          return fun.returnResponse(res,true,200,"Order Placed Successfully");

        }else{
          return fun.returnResponse(res,false,400,"No Items.");
        }
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong.");
      }


    } catch (error) {
      throw error;
    }
  },

  checkCoupon: async function (req, res) {
    try {
      req.check('code').notEmpty().withMessage('Please enter coupon code');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
      }

      var requestData = req.body;

      var checkD ={};
      checkD = await Discounts.findOne({
        where:{
          code: requestData.code
        },
        raw: true
      });

      if(checkD){

        // check expiry
        var expiryDate = moment.utc(checkD.expiryDateTime).format('Y-MM-DD hh:mm:ss');
        var dateNow = await fun.getDate();
        if(expiryDate < dateNow){
          return  fun.returnResponse(res,false,400,"Coupon code expired");
        }

        // check max redemptions

        var checkR ={};
        checkR = await Orders.count({
          where:{
            coupon: requestData.code
          },
          raw: true
        });

        if(checkR == checkD.maxRedemptions){
          return  fun.returnResponse(res,false,400,"Coupon code not available");
        }

        return  fun.returnResponse(res,true,200,"Coupon Applied Successfully", checkD);
      }else{
        return  fun.returnResponse(res,false,400,"Incorrect Coupon Code");
      }
    } catch (error) {
      throw error;
    }
  },
}