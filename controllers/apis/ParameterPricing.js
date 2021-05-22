const db = require('../../models');
var dateFormat = require('dateformat');
const sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
const Op = sequelize.Op;
var moment = require('moment');
var crypto = require('crypto');
const fun = require('../../function/api_fun.js');
const fs = require('fs');
const FileType = require('file-type');
//const base_url = "http://localhost:4000";
const current_time = Math.floor(Date.now() / 1000);
const readXlsxFile = require('read-excel-file/node');
var SqlString = require('sqlstring');

/******** MODELS ***********/

const PaymentMethods = db.paymentMethods;
const Discounts = db.discounts;
const CustomDuties = db.customDuties;
const Campaigns = db.ppCampaigns;
const CampaignRecipients = db.ppCampaignRecipients;
const TaxManagement = db.ppTaxManagement;
const FreightPricing = db.ppFreightPricing;
 
/** Belongs **/

/*model_name.belongsTo(another_model, {
  foreignKey: 'id'
});*/

module.exports = {


/*
|--------------------------------------------------------------------------
|             P A Y M E N T  M E T H O D S
|------------------------------------------------------------------------ */

  // update stripe

  updateStripe: async function (req, res) {
    try {

      req.check('stripeActiveMode').notEmpty().withMessage('Please select active mode.');
      req.check('stripeDefaultCurrency').notEmpty().withMessage('Please select default currency.');
      req.check('stripeKeySandbox').notEmpty().withMessage('Please enter stripe sandbox key.');
      req.check('stripeSecretSandbox').notEmpty().withMessage('Please enter stripe sandbox secret.');
      req.check('stripeKeyLive').notEmpty().withMessage('Please enter stripe live key.');
      req.check('stripeSecretLive').notEmpty().withMessage('Please enter stripe live secret.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      updateData =  await PaymentMethods.update({ 
                                    stripeKeySandbox: requestData.stripeKeySandbox,
                                    stripeSecretSandbox:requestData.stripeSecretSandbox,
                                    stripeKeyLive: requestData.stripeKeyLive,
                                    stripeSecretLive:requestData.stripeSecretLive,
                                    isStripeEnabled:requestData.isStripeEnabled,
                                    stripeActiveMode:requestData.stripeActiveMode,
                                    stripeTaxAmount:requestData.stripeTaxAmount,
                                    stripeDefaultCurrency:requestData.stripeDefaultCurrency,
                                  },{
                                  where:{
                                    type : 'STRIPE'
                                  }
                              });
      if(updateData){
        return fun.returnResponse(res,true,200,"Payment Method Updated Successfully");
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
      }
    } catch (error) {
      throw error;
    }
  },

  // update paypal

  updatePaypal: async function (req, res) {
    try {

      req.check('paypalActiveMode').notEmpty().withMessage('Please select active mode.');
      req.check('paypalDefaultCurrency').notEmpty().withMessage('Please select default currency.');
      req.check('paypalUsername').notEmpty().withMessage('Please enter paypal username.');
      req.check('paypalPassword').notEmpty().withMessage('Please enter paypal password.');
      req.check('paypalSecret').notEmpty().withMessage('Please enter paypal secret.');
      req.check('paypalAppId').notEmpty().withMessage('Please enter paypal app id.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      updateData =  await PaymentMethods.update({ 
                                    paypalUsername: requestData.paypalUsername,
                                    paypalPassword:requestData.paypalPassword,
                                    paypalSecret: requestData.paypalSecret,
                                    paypalAppId:requestData.paypalAppId,
                                    isPaypalEnabled:requestData.isPaypalEnabled,
                                    paypalActiveMode:requestData.paypalActiveMode,
                                    paypalTaxAmount:requestData.paypalTaxAmount,
                                    paypalDefaultCurrency:requestData.paypalDefaultCurrency,
                                  },{
                                  where:{
                                    type : 'PAYPAL'
                                  }
                              });
      if(updateData){
        return fun.returnResponse(res,true,200,"Payment Method Updated Successfully");
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
      }
    } catch (error) {
      throw error;
    }
  },

  // get all payment methods

  allPaymentMethods: async function (req, res) {
    try {

      let whereCond = {};


      var allResult = {};
      allResult = await PaymentMethods.findAll();

      if(allResult){

        const _metadata = {}

        return fun.returnResponse(res,true,200,"All Payment Methods",allResult,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Payment Methods.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  /*
|--------------------------------------------------------------------------
|               D I S C O U N T S
|------------------------------------------------------------------------ */

  
  // add discount

  addDiscount: async function (req, res) {
    try {
      req.check('code').notEmpty().withMessage('Please enter code.');
      req.check('type').notEmpty().withMessage('Please enter short description.');
      req.check('discount').notEmpty().withMessage('Please enter the discount.');
      req.check('expiryDateTime').notEmpty().withMessage('Please select date and time.');
      req.check('maximumRedemptions').notEmpty().withMessage('Please enter maximum number of redemptions.');
      req.check('text').notEmpty().withMessage('Please enter text for this discount.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var fileData = req.files;

      if(!fileData){
        return  fun.returnResponse(res,false,400,"Image is required.");
        return false;
      }

      var file = req.files.image;

      let image = await fun.uploadFile(file, 'discount_images');

      // check already added
      var checkAlr ={};
      checkAlr = await Discounts.findOne({
        where:{
          text:requestData.text,
          code:requestData.code,
          carType:requestData.carType,
        }
      });

      if(!checkAlr){

        insertData = await Discounts.create({
                        carType: requestData.carType,
                        forBrands: requestData.forBrands,
                        forPartCategory: requestData.forPartCategory,
                        code: requestData.code,
                        type:requestData.type,
                        discount: requestData.discount,
                        expiryDateTime:requestData.expiryDateTime,
                        image:image,
                        maxRedemptions:requestData.maximumRedemptions,
                        text: requestData.text
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Discount Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Discount already added with same text and code.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update discount

  updateDiscount: async function (req, res) {
    try {
      req.check('code').notEmpty().withMessage('Please enter code.');
      req.check('type').notEmpty().withMessage('Please select discount type.');
      req.check('discount').notEmpty().withMessage('Please enter the discount.');
      req.check('expiryDateTime').notEmpty().withMessage('Please select date and time.');
      req.check('maximumRedemptions').notEmpty().withMessage('Please enter maximum number of redemptions.');
      req.check('text').notEmpty().withMessage('Please enter text for this discount.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var fileData = req.files;

      if(!fileData){
        return  fun.returnResponse(res,false,400,"Image is required.");
        return false;
      }

      var file = req.files.image;

      let image = await fun.uploadFile(file, 'discount_images');

      // blog id valid
      var IsValid = {};
      IsValid = await Discounts.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Discount id with "+ req.params.id +" not found.");

      var checkRow ={};
      checkRow = await Discounts.findOne({
        where:{
          code:requestData.code,
          text:requestData.text,
          carType:requestData.carType,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!checkRow){

        updateData =  await Discounts.update({ 
                                      carType: requestData.carType,
                                      forBrands: requestData.forBrands,
                                      forPartCategory: requestData.forPartCategory,
                                      code: requestData.code,
                                      type:requestData.type,
                                      discount: requestData.discount,
                                      image: image,
                                      expiryDateTime:requestData.expiryDateTime,
                                      maxRedemptions:requestData.maximumRedemptions,
                                      text: requestData.text
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,"Discount Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Discount already added with same text and code.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // featureDiscount

  featureDiscount: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await Discounts.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Discount id with "+ req.params.id +" not found.");

      await Discounts.update({ 
        isFeature: 0
      },{
        where:{
          status : 'Active'
        }
      });

      updateData =  await Discounts.update({ 
                                    isFeature: 1,
                                  },{
                                  where:{
                                    id : req.params.id
                                  }
                              });
      if(updateData){
        return fun.returnResponse(res,true,200,"Discount Featured Successfully");
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
      }
    } catch (error) {
      throw error;
    }
  },

  // get discount

  getDiscount: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await Discounts.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Discount id with "+ req.params.id +" not found.");

      var checkRow ={};
      checkRow = await Discounts.findOne({
        where:{
          id : req.params.id
        }
      });

      if(checkRow){
          return fun.returnResponse(res,true,200,"Discounts",checkRow);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get discount feature

  getFeatureDiscount: async function (req, res) {
    try {

      var checkRow ={};
      checkRow = await Discounts.findOne({
        where:{
          is_feature:1,
          carType:req.query.carType,
        }
      });

      if(checkRow){

        var expiryDate = new Date(checkRow.expiryDateTime).getTime();
        var now = Date.now();

        if(expiryDate > now){
          return fun.returnResponse(res,true,200,"Success",checkRow);
        }else{
          return fun.returnResponse(res,true,200,"Success",{});
        }
      } else {
        return fun.returnResponse(res,true,200,"Success",{});
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all discounts

  allDiscounts: async function (req, res) {
    try {

      let whereCond = {};

      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 2;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      if(req.query.carType){
        whereCond.carType = req.query.carType;
      }

      if(req.query.brand){
        whereCond.forBrands = [req.query.brand];
      }

      if(req.query.category){
        whereCond.forPartCategory = [req.query.category];
      }

      const offset = (page-1) * Number(limit);

      // search
      var search = "";
      if(req.query.search){
        whereCond.assemblyGroupName = { [Op.like] : '' + req.query.search + '%' }
        search = " and (  code LIKE '" + req.query.search + "%' OR text LIKE '" + req.query.search + "%') ";
      }

      // carType
      var carType = "";
      if(req.query.carType){
        carType = "and carType = '" + req.query.carType + "'";
      }

       // brand
      var brand = "";
      if(req.query.brand){
        if(req.query.brand === '0' || req.query.brand === 0){
          brand = "and for_brands = ''";
        }else{
          brand = "and FIND_IN_SET('" + req.query.brand + "', for_brands)";
        }
      }

      // category
      var category = "";
      if(req.query.category){
        if(req.query.brand === '0' || req.query.brand === 0){
          category = "and for_part_category = ''";
        }else{
          category = "and FIND_IN_SET('" + req.query.category + "', for_part_category)";
        }
      }

      // total records

      allData = await Discounts.sequelize.query(`SELECT * from discounts where id != 0 `+ category +` ` + brand + ` ` + carType + ` `+ search +``, {
        type: sequelize.QueryTypes.SELECT
      });
      const totalPages = Math.ceil(allData.length/limit);


      var allDataP = [];
      allDataP = await Discounts.sequelize.query(`SELECT * from discounts where id != 0 `+ category +` ` + brand + ` ` + carType + ` `+ search +` LIMIT  `+ offset +` , `+ limit +` `, {
        type: sequelize.QueryTypes.SELECT
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Discounts",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Discounts.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  /*
|--------------------------------------------------------------------------
|               Custom Duties
|------------------------------------------------------------------------ */

  
  // add

  addCustomDuties: async function (req, res) {
    try {
      req.check('originCountry').notEmpty().withMessage('Please select originCountry.');
      req.check('categoryId').notEmpty().withMessage('Please select categoryId.');
      req.check('fees').notEmpty().withMessage('Please select fees');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check already added
      var checkAlr ={};
      checkAlr = await CustomDuties.findOne({
        where:{
          originCountry:requestData.originCountry,
          categoryId:requestData.categoryId,
          fees:requestData.fees
        }
      });

      if(!checkAlr){

        insertData = await CustomDuties.create({
                        originCountry:requestData.originCountry,
                        categoryId:requestData.categoryId,
                        fees:requestData.fees
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        }
      } else {
        return fun.returnResponse(res,false,409,"Already added with same country and category.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update

  updateCustomDuties: async function (req, res) {
    try {
      req.check('originCountry').notEmpty().withMessage('Please select originCountry.');
      req.check('categoryId').notEmpty().withMessage('Please select categoryId.');
      req.check('fees').notEmpty().withMessage('Please select fees');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // blog id valid
      var IsValid = {};
      IsValid = await CustomDuties.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Discount id with "+ req.params.id +" not found.");

      var checkRow ={};
      checkRow = await CustomDuties.findOne({
        where:{
          originCountry:requestData.originCountry,
          categoryId:requestData.categoryId,
          fees:requestData.fees,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!checkRow){

        updateData =  await CustomDuties.update({ 
                                      originCountry:requestData.originCountry,
                                      categoryId:requestData.categoryId,
                                      fees:requestData.fees
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,"Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Already added with same category and origin country.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get

  getCustomDuties: async function (req, res) {
    try {

      IsValid = await CustomDuties.sequelize.query(`SELECT *,(select name from countries where id = a.origin_country) as countryName,(select shortCutName from ta_parts_category where shortCutId = a.category_id) as categoryName from custom_duties as a where id = `+req.params.id+``, {
        type: sequelize.QueryTypes.SELECT
      });

      if(IsValid.length){
          return fun.returnResponse(res,true,200,"Discounts",IsValid[0]);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allCustomDuties: async function (req, res) {
    try {

      let whereCond = {};

      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 2;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      const offset = (page-1) * Number(limit);

      // search
      var search = "";
      if(req.query.search){
        search = " and (  originCountry LIKE '" + req.query.search + "%' OR categoryId LIKE '" + req.query.search + "%') ";
      }

      // total records

      allData = await CustomDuties.sequelize.query(`SELECT *,(select name from countries where id = a.origin_country) as countryName,(select shortCutName from ta_parts_category where shortCutId = a.category_id) as categoryName from custom_duties as a where id != 0  `+ search +``, {
        type: sequelize.QueryTypes.SELECT
      });
      const totalPages = Math.ceil(allData.length/limit);


      var allDataP = [];
      allDataP = await CustomDuties.sequelize.query(`SELECT *,(select name from countries where id = a.origin_country) as countryName,(select shortCutName from ta_parts_category where shortCutId = a.category_id) as categoryName from custom_duties as a where id != 0 `+ search +` LIMIT  `+ offset +` , `+ limit +` `, {
        type: sequelize.QueryTypes.SELECT
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Discounts",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Discounts.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  /*
|--------------------------------------------------------------------------
|               C A M P A I G N S
|------------------------------------------------------------------------ */

  
  // add campaign

  addCampaign: async function (req, res) {
    try {
      req.check('title').notEmpty().withMessage('Please enter campaign title.');
      req.check('intervalBetweenMails').notEmpty().withMessage('Please enter interval b/w mails.');
      req.check('timezone').notEmpty().withMessage('Please select timezone.');
      req.check('startDateTime').notEmpty().withMessage('Please select start date and time.');
      req.check('endDateTime').notEmpty().withMessage('Please select end date and time.');
      req.check('mailsPerDay').notEmpty().withMessage('Please enter maximum number of mails to be sent per day.');
      req.check('blockOutDays').notEmpty().withMessage('Please select blockout days.');
      req.check('subject').notEmpty().withMessage('Please enter subject.');
      req.check('message').notEmpty().withMessage('Please enter message.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check already added
      var checkAlr ={};
      checkAlr = await Campaigns.findOne({
        where:{
          title:requestData.title
        }
      });

      if(!checkAlr){

        insertData = await Campaigns.create({
                        title: requestData.title,
                        intervalBetweenMails:requestData.intervalBetweenMails,
                        timezone: requestData.timezone,
                        startDateTime:requestData.startDateTime,
                        endDateTime:requestData.endDateTime,
                        mailsPerDay:requestData.mailsPerDay,
                        blockOutDays:requestData.blockOutDays,
                        subject:requestData.subject,
                        message: requestData.message
                      });

        if(insertData){

          var file = req.files.recipientFile;

          let oldpath = await fun.uploadFile(file, 'pp_campaign_recp_file');

          readXlsxFile(fs.createReadStream(process.cwd()+'/public/'+oldpath)).then(async (rows) => {

            rows.shift();

            if(rows.length){

              for(var i=0; i < rows.length;i++){

                var checkEmail ={};
                checkEmail = await CampaignRecipients.findOne({
                  where:{
                    email:rows[i][2],
                  }
                });

                if(!checkEmail){
                  await CampaignRecipients.create({
                    campaignId : insertData.id,
                    firstName : rows[i][0],
                    lastName : rows[i][1],
                    email : rows[i][2]
                  });
                }
              }

            }
          });

          return fun.returnResponse(res,true,200,"Campaign Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Campaign already added with same title.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update campaign

  updateCampaign: async function (req, res) {
    try {
      req.check('title').notEmpty().withMessage('Please enter campaign title.');
      req.check('intervalBetweenMails').notEmpty().withMessage('Please enter interval b/w mails.');
      req.check('timezone').notEmpty().withMessage('Please select timezone.');
      req.check('startDateTime').notEmpty().withMessage('Please select start date and time.');
      req.check('endDateTime').notEmpty().withMessage('Please select end date and time.');
      req.check('mailsPerDay').notEmpty().withMessage('Please enter maximum number of mails to be sent per day.');
      req.check('blockOutDays').notEmpty().withMessage('Please select blockout days.');
      req.check('subject').notEmpty().withMessage('Please enter subject.');
      req.check('message').notEmpty().withMessage('Please enter message.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // id valid
      var IsValid = {};
      IsValid = await Campaigns.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Campaign id with "+ req.params.id +" not found.");

      var checkRow ={};
      checkRow = await Campaigns.findOne({
        where:{
          title:requestData.title,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!checkRow){

        updateData =  await Campaigns.update({
                                      title: requestData.title,
                                      intervalBetweenMails:requestData.intervalBetweenMails,
                                      timezone: requestData.timezone,
                                      startDateTime:requestData.startDateTime,
                                      endDateTime:requestData.endDateTime,
                                      mailsPerDay:requestData.mailsPerDay,
                                      blockOutDays:requestData.blockOutDays,
                                      subject:requestData.subject,
                                      message: requestData.message
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){

          deleteRow =   await CampaignRecipients.destroy({
                        where:{
                          campaignId : req.params.id
                        }
                      });

          var file = req.files.recipientFile;

          let oldpath = await fun.uploadFile(file, 'pp_campaign_recp_file');

          readXlsxFile(fs.createReadStream(process.cwd()+'/public/'+oldpath)).then(async (rows) => {

            rows.shift();

            if(rows.length){

              for(var i=0; i < rows.length;i++){

                var checkEmail ={};
                checkEmail = await CampaignRecipients.findOne({
                  where:{
                    email:rows[i][2],
                    campaignId : req.params.id
                  }
                });

                if(!checkEmail){
                  await CampaignRecipients.create({
                    campaignId : req.params.id,
                    firstName : rows[i][0],
                    lastName : rows[i][1],
                    email : rows[i][2]
                  });
                }
              }

            }
          });

          return fun.returnResponse(res,true,200,"Campaign Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Campaign already added with same title.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get campaign

  getCampaign: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await Campaigns.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Campaign id with "+ req.params.id +" not found.");

      var checkRow ={};
      checkRow = await Campaigns.findOne({
        where:{
          id : req.params.id
        }
      });

      if(checkRow){
          return fun.returnResponse(res,true,200,"Campaigns",checkRow);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all campaigns

  allCampaigns: async function (req, res) {
    try {

      let whereCond = {};

      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 2;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      const offset = (page-1) * Number(limit);

      // search
      var search = "";
      if(req.query.search){
        whereCond = { 
                      [Op.or]: [ 
                       { 
                         title: {
                          [Op.like]: '' + req.query.search + '%'
                          },
                        },
                       { 
                         startDateTime: {
                          [Op.like]: '' + req.query.search + '%'
                          }
                       },
                       {
                          endDateTime:{
                            [Op.like]: '' + req.query.search + '%'
                          }
                        }
                     ]
                  }
      }

      // total records
      allRecords = await Campaigns.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allRecords.count/limit);


      var allRecordsP = {};
      allRecordsP = await Campaigns.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allRecords){

        const _metadata = { 'totalRecords' : allRecords.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Campaigns",allRecordsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Campaigns.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

    /*
|--------------------------------------------------------------------------
|               T A X  -  M G T
|------------------------------------------------------------------------ */

  // get tax content

  getTaxContent: async function (req, res) {
    try {
      var websiteC ={};
      websiteC = await TaxManagement.findOne({
        where:{
          id : 1
        }
      });

      if(websiteC){
          return fun.returnResponse(res,true,200,"Tax Content",websiteC);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update tax content

  updateTaxContent: async function (req, res) {
    try {

      var requestData = req.body;

      var objc = {};
      if(requestData.vat && requestData.baseInsurance){
        objc = { vat:requestData.vat, baseInsurance : requestData.baseInsurance, customDutiesPrice : requestData.customDutiesPrice, customDutiesWeight : requestData.customDutiesWeight };
      }else{
        return fun.returnResponse(res,false,400,"Vat & baseInsurance is missing.");
      }

      updateData =  await TaxManagement.update(objc,{
                              where:{
                                id : 1
                              }
                            });
      if(updateData){
        return fun.returnResponse(res,true,200,"Updated Successfully");
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong.");
      }
    } catch (error) {
      throw error;
    }
  },

  /*
|--------------------------------------------------------------------------
| F R E I G H T - P R I C I N G
|------------------------------------------------------------------------ */
  
  // add freight pricing

  addFreightPricing: async function (req, res) {
    try {
      req.check('title').notEmpty().withMessage('Please enter title.');
      req.check('shippingPrice').notEmpty().withMessage('Please enter short description.');
      req.check('orderPrice').notEmpty().withMessage('Please enter the order price.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var fileData = req.files;

      if(!fileData){
        return  fun.returnResponse(res,false,400,"Icon is missing.");
        return false;
      }

      var file = req.files.icon;

      let icon = await fun.uploadFile(file, 'pp_freight_shipping_icons');

      // check already added
      var checkAlr ={};
      checkAlr = await FreightPricing.findOne({
        where:{
          title:requestData.title,
        }
      });

      if(!checkAlr){

        insertData = await FreightPricing.create({
                        title: requestData.title,
                        orderPrice:requestData.orderPrice,
                        shippingPrice: requestData.shippingPrice,
                        icon:icon
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Pricing Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Pricing already added with same title.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update

  updateFreightPricing: async function (req, res) {
    try {
      req.check('title').notEmpty().withMessage('Please enter title.');
      req.check('shippingPrice').notEmpty().withMessage('Please enter short description.');
      req.check('orderPrice').notEmpty().withMessage('Please enter the order price.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // id valid
      var IsValid = {};
      IsValid = await FreightPricing.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Pricing id with "+ req.params.id +" not found.");

      var fileData = req.files;
      var icon = IsValid.icon;
      if(fileData){
        var file = req.files.icon;
        icon = await fun.uploadFile(file, 'pp_freight_shipping_icons');
      }

      var check ={};
      check = await FreightPricing.findOne({
        where:{
          title:requestData.title,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!check){

        updateData =  await FreightPricing.update({ 
                                      title: requestData.title,
                                      orderPrice:requestData.orderPrice,
                                      shippingPrice: requestData.shippingPrice,
                                      icon:icon
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,"Pricing Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Pricing cannot be updated.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Pricing already added with same title.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get freight - pricing

  getFreightPricing: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await FreightPricing.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Pricing id with "+ req.params.id +" not found.");

      var pricing ={};
      pricing = await FreightPricing.findOne({
        where:{
          id : req.params.id
        }
      });

      if(pricing){
          return fun.returnResponse(res,true,200,"Freight Pricing",pricing);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all freight pricing

  allFreightPricings: async function (req, res) {
    try {

      let whereCond = {};

      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 2;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      const offset = (page-1) * Number(limit);

      // search
      var search = "";
      if(req.query.search){
        whereCond.title = { [Op.like] : '' + req.query.search + '%' }
      }

      // total records

      allOptions = await FreightPricing.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await FreightPricing.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Pricing",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Pricings.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
}