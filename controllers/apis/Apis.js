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


/******** MODELS ***********/

const User = db.users;
const InsuranceTypes = db.insuranceTypes;
const CustomDuties = db.customDuties;
const Sliders = db.sliders;
const PricingByCatSub = db.pricingByCatSub;
const ShippingInsurancePrices = db.shippingInsurancePrices;
const SupplierTypes = db.supplierTypes;
const TaArticlePricing = db.taArticlePricing;
const TaArticleRecommends = db. taArticleRecommends;
const TaGetAmBrands =  db.taGetambrands;
const Currencies = db.currencies;
const ArticlePriceRequests = db.articlePriceRequests;
const Countries = db.countries;
const FreightZones = db.freightZones;
const FreightZoneCountries = db.freightZoneCountries;
const FreightPricingWeight = db.freightPricingWeight;
const MembershipOption = db.membershipOptions;
const WebsiteContent = db.websiteContent;
const suppliers =db.suppliers;
const RuntRegisteredVehicles =  db.runtregisteredvehicles;
const Blog =  db.blogNews;
const PaymentMethods =  db.paymentMethods;
const Discounts =  db.discounts;
const Campaigns = db.ppCampaigns;
const CampaignRecipients = db.ppCampaignRecipients;
const FreightPricing = db.ppFreightPricing;

const Rating = db.articlerating;

const TaGetManufacturers =  db.taGetmanufacturers;
const TaGetModelSeries =  db.taGetmodelseries;
const TaGetVehicleIdsByCriteria =  db.taGetvehicleidsbycriteria;
const TaGetArticles =  db.taGetArticles;
const TaPartsCategory =  db.taPartsCategory;
const TaPartsCategorySub =  db.taPartsCategorySub;

const SupplierArticles = db.supplierarticles;
const SupplierArticlesAttributes = db.supplierarticlesattributes;
const SupplierArticlesFiles = db.supplierarticlesfiles;

const Faqs = db.faqs;
const FaqsCategories = db.faqsCategories;
const RiparoFriendsCategories = db.riparoFriendsCategories;
const RiparoFriends = db.riparoFriends;
const ArticleQas = db.articleQas;

const SupportTickets = db.supportTickets;
const SupportTicketsChat = db.supportTicketsChat;
const TaxManagement = db.ppTaxManagement;
 
/** Belongs **/

/*model_name.belongsTo(another_model, {
  foreignKey: 'id'
});*/

module.exports = {

  // getAdminDashboard

  getAdminDashboard : async function (req, res) {
    try {

      var data = {};

      data.totalSuppliers =  await User.count({
                            where:{
                              userType: 'Supplier'
                            }
                          });

      data.totalCustomers =  await User.count({
                            where:{
                              userType: 'Customer'
                            }
                          });

      data.totalPartsCategories =  await TaPartsCategory.count();

      data.totalPartsSubCategories =  await TaPartsCategorySub.count();

      data.totalManufacturers =  await TaGetManufacturers.count();

      data.totalModelSeries =  await TaGetModelSeries.count();

      data.totalEngines =  await TaGetVehicleIdsByCriteria.count();

      data.totalRunt =  await RuntRegisteredVehicles.count();

      data.openSupportTickets =  await SupportTickets.count({
                                    where:{
                                      status: 0
                                    }
                                  });

      data.unreadSupportMessages =  await SupportTicketsChat.count({
                                    where:{
                                      isRead: 0
                                    }
                                  });

      return fun.returnResponse(res,true,200,"Success",data);

    }  catch (error) {
      throw error;
    }
  },

  logIn: async function (req, res) {
    try {

      req.check('email').isEmail().withMessage('Please enter valid email');
      req.check('password').notEmpty().withMessage('Please enter your password');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;
      const password = crypto.createHash('sha1').update(requestData.password).digest('hex');

      var user_data ={};
      user_data = await User.findOne({
        where:{
          email:requestData.email,
        }
      });

      if(user_data){
        user_data =user_data.toJSON();

        var passwordIsValid = (crypto.createHash('sha1').update(requestData.password).digest('hex')==user_data.password) ? 1 : 0;
        if (!passwordIsValid) return fun.returnResponse(res,false,401,"Incorrect password entered.");

        var accountActive = (user_data.accountStatus=='Active') ? 1 : 0;
        if (!accountActive) return fun.returnResponse(res,false,401,"Your account is temporarily inactive. Please contact support team");

        delete user_data.password;

        // update user token

        var token = jwt.sign({ id: user_data.id }, process.env.API_SECRET, {
          expiresIn: 8640000000000 // expires in 24 hours
        });

        await User.update({ token:token },{
          where:{
            id : user_data.id
          }
        });

        // get user data

        var returnData =  await User.findOne({
                            where:{
                              id : user_data.id,
                            }
                          });

        return fun.returnResponse(res,true,200,"Successfully Logged In",returnData);

      } else {
        return fun.returnResponse(res,false,401,"Email is not registered with us.");
          return false;
      }
    } catch (error) {
      throw error;
    }
  },

  socialLogIn: async function (req, res) {
    try {
      req.check('firstName').notEmpty().withMessage('Please enter first name');
      req.check('lastName').notEmpty().withMessage('Please enter last name');
      req.check('email').notEmpty().withMessage('Please enter email');
      req.check('socialId').notEmpty().withMessage('Please enter social id');
      req.check('profilePicture').notEmpty().withMessage('Please enter profile picture');
      req.check('mergeAccount').notEmpty().withMessage('Please enter merge account');
      req.check('accountType').notEmpty().withMessage('Please select account type');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check email
      var user_data ={};
      user_data = await User.findOne({
        where:{
          email:requestData.email,
        }
      });

      if(user_data){

        if(requestData.mergeAccount == 0 && !user_data.socialId){
          return  fun.returnResponse(res,false,409,"");
        }

      } else {

        // insert new user
        await User.create({
          firstName: requestData.firstName,
          lastName:requestData.lastName,
          email: requestData.email,
          profilePicture:requestData.profilePicture,
          socialId: requestData.socialId,
          isEmailVerified: 'Yes',
          emailVerifiedAt: await fun.getDate(),
          socialLoginType: requestData.accountType
        });

        var user_data ={};
        user_data = await User.findOne({
          where:{
            email:requestData.email,
          }
        });
      }


      // update user token
      var token = jwt.sign({ id: user_data.id }, process.env.API_SECRET, {
        expiresIn: 8640000000000 // expires in 24 hours
      });

      await User.update({ token:token,socialId: requestData.socialId,isEmailVerified:'Yes',emailVerifiedAt: await fun.getDate(),socialLoginType:requestData.accountType },{
        where:{
          id : user_data.id
        }
      });

      // get user data

      var returnData =  await User.findOne({
                          where:{
                            id : user_data.id,
                          }
                        });

      return fun.returnResponse(res,true,200,"Logged In Successfully",returnData);
        
    } catch (error) {
      throw error;
    }
  },

  logOut: async function (req, res) {
    try {

      await User.update({ token:null },{
        where:{
          id : req.id
        }
      });

      return fun.returnResponse(res,true,200,"LogOut Success",[]);

    } catch (error) {
      throw error;
    }
  },

  // get logged in user profile

  getProfile : async function (req, res) {
    try {

      if(req.query.userId){
        var userId = req.query.userId;
      }else{
        var userId = req.id
      }

      var returnData =  await User.findOne({
                            where:{
                              id : userId,
                            }
                          });

      return fun.returnResponse(res,true,200,"Success",returnData);

    }  catch (error) {
      throw error;
    }
  },

  // get profile by token

  getProfileByToken : async function (req, res) {
    try {

      var returnData =  await User.findOne({
                            where:{
                              token : req.query.authId,
                            }
                          });

      return fun.returnResponse(res,true,200,"Success",returnData);

    }  catch (error) {
      throw error;
    }
  },

  // update user content

  updateUserContent: async function (req, res) {
    try {

      var requestData = req.body.data;

      whereCond = { [requestData.type]:requestData.value };

      updateData =  await User.update(whereCond,{
                              where:{
                                id : req.id
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

  // update user content by id

  updateUserContentById: async function (req, res) {
    try {

      var requestData = req.body.data;

      updateData =  await User.update(requestData,{
                              where:{
                                id : requestData.userId
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

  // Change Password

  changePassword: async function (req, res) {
    try {

      req.check('currentPassword').notEmpty().withMessage('Please enter your current password');
      req.check('newPassword').notEmpty().withMessage('Please enter your new password');
      req.check('confirmPassword').notEmpty().withMessage('Please re-enter new password');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      if(requestData.newPassword != requestData.confirmPassword){
        return  fun.returnResponse(res,false,400,"New Password should match with confirm password");
        return false;
      }

      const password = crypto.createHash('sha1').update(requestData.currentPassword).digest('hex');

      var user_data ={};
      user_data = await User.findOne({
        where:{
          password:password,
          id: req.id
        }
      });

      if(user_data){

        const newPassword = crypto.createHash('sha1').update(requestData.newPassword).digest('hex');

        updateData =  await User.update({password: newPassword},{
                              where:{
                                id : req.id
                              }
                            });
        if(updateData){
          return fun.returnResponse(res,true,200,"Password Changed Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong.");
        }
      }else{
        return fun.returnResponse(res,false,400,"Incorrect Current Password.");
      }
    } catch (error) {
      throw error;
    }
  },

  // Change Password By Token

  changePasswordByToken: async function (req, res) {
    try {
      req.check('newPassword').notEmpty().withMessage('Please enter your new password');
      req.check('confirmPassword').notEmpty().withMessage('Please re-enter new password');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      if(requestData.newPassword != requestData.confirmPassword){
        return  fun.returnResponse(res,false,400,"New Password should match with confirm password");
        return false;
      }

      const password = crypto.createHash('sha1').update(requestData.newPassword).digest('hex');

      updateData =  await User.update({password: password},{
                            where:{
                              token: requestData.token
                            }
                          });
      if(updateData){
        return fun.returnResponse(res,true,200,"Password Changed Successfully");
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong.");
      }
    } catch (error) {
      throw error;
    }
  },


/*
|--------------------------------------------------------------------------
| RF CATEGORIES
|------------------------------------------------------------------------ */

  
  // add category

  addRfCategory: async function (req, res) {
    try {
      req.check('title').notEmpty().withMessage('Please enter title.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var checkMembershipOption ={};
      checkMembershipOption = await RiparoFriendsCategories.findOne({
        where:{
          title:requestData.title,
        }
      });

      if(!checkMembershipOption){

        insertData = await RiparoFriendsCategories.create({
                        title:requestData.title,
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Added Successfully");          
        }else{
          return fun.returnResponse(res,false,500,"cannot be inserted.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Already added with same title.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update

  updateRfCategory: async function (req, res) {
    try {

      req.check('title').notEmpty().withMessage('Please enter title.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // option id valid
      var optionIsValid = {};
      optionIsValid = await RiparoFriendsCategories.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Category id with "+ req.params.id +" not found.");

      var checkMembershipOption ={};
      checkMembershipOption = await RiparoFriendsCategories.findOne({
        where:{
          title:requestData.title,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!checkMembershipOption){

        updateData =  await RiparoFriendsCategories.update({ title:requestData.title },{
                              where:{
                                id : req.params.id
                              }
                            });
        if(updateData){
          return fun.returnResponse(res,true,200,"Category Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Category cannot be updated.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Category already added with same title.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // delete

  deleteRfCategory: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await RiparoFriendsCategories.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Category id with "+ req.params.id +" not found.");

      var deleteMembershipOption ={};
      deleteMembershipOption = await RiparoFriendsCategories.destroy({
        where:{
          id : req.params.id
        }
      });

      if(deleteMembershipOption){
          return fun.returnResponse(res,true,200,"Category Deleted Successfully");
      } else {
        return fun.returnResponse(res,false,500,"Option cannot be deleted.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get

  getRfCategory: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await RiparoFriendsCategories.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Membership id with "+ req.params.id +" not found.");

      var membershipOption ={};
      membershipOption = await RiparoFriendsCategories.findOne({
        where:{
          id : req.params.id
        }
      });

      if(membershipOption){
          return fun.returnResponse(res,true,200,"Category",membershipOption);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allRfCategories: async function (req, res) {
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

      allOptions = await RiparoFriendsCategories.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await RiparoFriendsCategories.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get website content

  getWebsiteContent: async function (req, res) {
    try {
      var websiteC ={};
      websiteC = await WebsiteContent.findOne({
        where:{
          id : 1
        }
      });

      if(websiteC){
          return fun.returnResponse(res,true,200,"Website Content",websiteC);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update website content

  updateWebsiteContent: async function (req, res) {
    try {

      var requestData = req.body;

      var whereCond = {};
      if(requestData.type == 'privacyPolicy'){
        whereCond = { privacyPolicy:requestData.value };
      }else if(requestData.type == 'termsConditions'){
        whereCond = { termsConditions:requestData.value };
      }else if(requestData.type == 'shippingTrack'){
        whereCond = { shippingTrack:requestData.value };
      }else if(requestData.type == 'payment'){
        whereCond = { payment:requestData.value };
      }else if(requestData.type == 'alliances'){
        whereCond = { alliances:requestData.value };
      }else if(requestData.type == 'payment'){
        whereCond = { payment:requestData.value };
      }else if(requestData.type == 'operationModel'){
        whereCond = { operationModel:requestData.value };
      }else if(requestData.type == 'returnRefund'){
        whereCond = { returnRefund:requestData.value };
      }else if(requestData.type == 'aboutUs'){
        whereCond = { aboutUs:requestData.value };
      }else if(requestData.type == 'contactEmail'){
        whereCond = { contactEmail:requestData.value };
      }else if(requestData.type == 'contactPhoneNumber'){
        whereCond = { contactPhoneNumber:requestData.value };
      }else if(requestData.type == 'address'){
        whereCond = { address:requestData.value };
      }else if(requestData.type == 'facebookLink'){
        whereCond = { facebookLink:requestData.value };
      }else if(requestData.type == 'instagramLink'){
        whereCond = { instagramLink:requestData.value };
      }else if(requestData.type == 'twitterLink'){
        whereCond = { twitterLink:requestData.value };
      }else{
        return fun.returnResponse(res,false,400,"Type is missing.");
      }

      updateData =  await WebsiteContent.update(whereCond,{
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

  /**********  COMMON APIS  ******************/

  // change row status

  changeRowStatus: async function (req, res) {
    try {
      req.check('table').notEmpty().withMessage('Please enter table name.');
      req.check('value').notEmpty().withMessage('Please enter value.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // option id valid

      const whereIdOption = { 
                            where:{
                              id:req.params.id
                            }
                          }

      var optionIsValid = {};

      if(requestData.table == 'membership_options'){
        idValid = await MembershipOption.findOne(whereIdOption);
      }else if(requestData.table == 'runtRegisteredVehicles'){
        idValid = await RuntRegisteredVehicles.findOne(whereIdOption);
      }else if(requestData.table == 'runtRegisteredVehicles'){
        idValid = await RuntRegisteredVehicles.findOne(whereIdOption);
      }else if(requestData.table == 'blog_news'){
        idValid = await Blog.findOne(whereIdOption);
      }else if(requestData.table == 'ta_article_recommends'){
        idValid = await TaArticleRecommends.findOne(whereIdOption);
      }else if(requestData.table == 'ta_article_recommendss'){
        idValid = await TaArticleRecommends.findOne(whereIdOption);
      }else if(requestData.table == 'faqs'){
        idValid = await Faqs.findOne(whereIdOption);
      }else if(requestData.table == 'paymentMethods_Stripe' || requestData.table == 'paymentMethods_Paypal'){
        idValid = await PaymentMethods.findOne(whereIdOption);
      }else if(requestData.table == 'campaigns'){
        idValid = await Campaigns.findOne(whereIdOption);
      }else if(requestData.table == 'pp_freight_pricing'){
        idValid = await FreightPricing.findOne(whereIdOption);
      }else if(requestData.table == 'ta_getmanufacturers'){
        idValid = await TaGetManufacturers.findOne(whereIdOption);
      }else if(requestData.table == 'ta_getambrands'){
        idValid = await TaGetAmBrands.findOne(whereIdOption);
      }else if(requestData.table == 'ta_getmodelseries'){
        idValid = await TaGetModelSeries.findOne(whereIdOption);
      }else if(requestData.table == 'ta_getvehicleidsbycriteria'){
        idValid = await TaGetVehicleIdsByCriteria.findOne(whereIdOption);
      }else if(requestData.table == 'ta_parts_category'){
        idValid = await TaPartsCategory.findOne(whereIdOption);
      }else if(requestData.table == 'ta_parts_category_sub'){
        idValid = await TaPartsCategorySub.findOne(whereIdOption);
      }else if(requestData.table == 'supplierarticles'){
        idValid = await SupplierArticles.findOne(whereIdOption);
      }else if(requestData.table == 'riparo_friends_categories'){
        idValid = await RiparoFriendsCategories.findOne(whereIdOption);
      }else if(requestData.table == 'faqs_categories'){
        idValid = await FaqsCategories.findOne(whereIdOption);
      }else if(requestData.table == 'riparo_friends'){
        idValid = await RiparoFriends.findOne(whereIdOption);
      }else if(requestData.table == 'users'){
        idValid = await User.findOne(whereIdOption);
      }else if(requestData.table == 'currencies'){
        idValid = await Currencies.findOne(whereIdOption);
      }else if(requestData.table === 'sliders'){
        idValid = await Sliders.findOne(whereIdOption);
      }else if(requestData.table == 'shipping_insurance_prices'){
        idValid = await ShippingInsurancePrices.findOne(whereIdOption);
      }else if(requestData.table == 'freight_zones'){
        idValid = await FreightZones.findOne(whereIdOption);
      }else{
        return fun.returnResponse(res,false,401,"Something went wrong ! Please try again later.");
      }

      if (!idValid) return fun.returnResponse(res,false,401,"Resource id "+ req.params.id +" not found.");

      if(requestData.table == 'membership_options'){
        updateData =  await MembershipOption.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'freight_zones'){
        updateData =  await FreightZones.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'ta_article_recommends'){
        updateData =  await TaArticleRecommends.update({ isFeatured:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'ta_article_recommendss'){
        updateData =  await TaArticleRecommends.update({ isRecommended:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'runtRegisteredVehicles'){
        updateData =  await RuntRegisteredVehicles.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'sliders'){
        updateData =  await Sliders.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'blog_news'){
        updateData =  await Blog.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'shipping_insurance_prices'){
        updateData =  await ShippingInsurancePrices.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'faqs'){
        updateData =  await Faqs.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'paymentMethods_Stripe'){
        updateData =  await PaymentMethods.update({ isStripeEnabled:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'paymentMethods_Paypal'){
        updateData =  await PaymentMethods.update({ isPaypalEnabled:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'discounts'){
        updateData =  await Discounts.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'campaigns'){
        updateData =  await Campaigns.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'pp_freight_pricing'){
        updateData =  await FreightPricing.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'ta_getmanufacturers'){
        updateData =  await TaGetManufacturers.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'ta_getambrands'){
        updateData =  await TaGetAmBrands.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'ta_getmodelseries'){
        updateData =  await TaGetModelSeries.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'ta_getvehicleidsbycriteria'){
        updateData =  await TaGetVehicleIdsByCriteria.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'ta_parts_category'){
        updateData =  await TaPartsCategory.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'ta_parts_category_sub'){
        updateData =  await TaPartsCategorySub.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'riparo_friends_categories'){
        updateData =  await RiparoFriendsCategories.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'faqs_categories'){
        updateData =  await FaqsCategories.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'riparo_friends'){
        updateData =  await RiparoFriends.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'supplierarticles'){
        updateData =  await SupplierArticles.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'currencies'){
        updateData =  await Currencies.update({ status:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else if(requestData.table == 'users'){

        if(idValid.userType === 'Supplier' && requestData.value === 'Active'){

            // sending email verification code
          //var data =  {
                        /*firstName: idValid.firstName,
                        lastName:idValid.lastName,
                        email: idValid.email,
                        to : idValid.email,
                        subject: "Account Activation",
                        accountLink: await fun.appBaseUrl() + '/external'
                      };*/

          //fun.sendEmail(req, res, data, 'accountActivationSupplier.html');

        }

        updateData =  await User.update({ accountStatus:requestData.value },{
                            where:{
                              id : req.params.id
                            }
                          });
      }else{
        return fun.returnResponse(res,false,401,"Something went wrong ! Please try again later.");
      }

      if(updateData){
        return fun.returnResponse(res,true,200,(requestData.value == 'Active') ? "Activated Successfully" : "Deactivated Successfully");
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong.");
      }
    } catch (error) {
      throw error;
    }
  },

  // row delete

  rowDelete: async function (req, res) {
    try {

      var requestData = req.query;

      // option id valid

      const whereIdOption = { 
                            where:{
                              id:req.params.id
                            }
                          }

      var optionIsValid = {};

      if(requestData.table === 'membership_options'){
        idValid = await MembershipOption.findOne(whereIdOption);
      }else if(requestData.table === 'blog_news'){
        idValid = await Blog.findOne(whereIdOption);
      }else if(requestData.table === 'pricing_by_cat_sub'){
        idValid = await PricingByCatSub.findOne(whereIdOption);
      }else if(requestData.table === 'custom_duties'){
        idValid = await CustomDuties.findOne(whereIdOption);
      }else if(requestData.table === 'article_price_requests'){
        idValid = await ArticlePriceRequests.findOne(whereIdOption);
      }else if(requestData.table === 'ta_article_recommends'){
        idValid = await TaArticleRecommends.findOne(whereIdOption);
      }else if(requestData.table === 'freight_zones'){
        idValid = await FreightZones.findOne(whereIdOption);
      }else if(requestData.table === 'sliders'){
        idValid = await Sliders.findOne(whereIdOption);
      }else if(requestData.table == 'faqs'){
        idValid = await Faqs.findOne(whereIdOption);
      }else if(requestData.table === 'discounts'){
        idValid = await Discounts.findOne(whereIdOption);
      }else if(requestData.table === 'articlerating'){
        idValid = await Rating.findOne(whereIdOption);
      }else if(requestData.table === 'campaigns'){
        idValid = await Campaigns.findOne(whereIdOption);
      }else if(requestData.table === 'pp_freight_pricing'){
        idValid = await FreightPricing.findOne(whereIdOption);
      }else if(requestData.table === 'insurance_types'){
        idValid = await InsuranceTypes.findOne(whereIdOption);
      }else if(requestData.table == 'ta_getmanufacturers'){
        idValid = await TaGetManufacturers.findOne(whereIdOption);
      }else if(requestData.table == 'ta_getmodelseries'){
        idValid = await TaGetModelSeries.findOne(whereIdOption);
      }else if(requestData.table == 'ta_getvehicleidsbycriteria'){
        idValid = await TaGetVehicleIdsByCriteria.findOne(whereIdOption);
      }else if(requestData.table == 'ta_parts_category'){
        idValid = await TaPartsCategory.findOne(whereIdOption);
      }else if(requestData.table == 'ta_parts_category_sub'){
        idValid = await TaPartsCategorySub.findOne(whereIdOption);
      }else if(requestData.table == 'supplierarticles'){
        idValid = await SupplierArticles.findOne(whereIdOption);
      }else if(requestData.table == 'faqs_categories'){
        idValid = await FaqsCategories.findOne(whereIdOption);
      }else if(requestData.table == 'riparo_friends_categories'){
        idValid = await RiparoFriendsCategories.findOne(whereIdOption);
      }else if(requestData.table == 'riparo_friends'){
        idValid = await RiparoFriends.findOne(whereIdOption);
      }else if(requestData.table == 'users'){
        idValid = await User.findOne(whereIdOption);
      }else if(requestData.table == 'freight_pricing_weight'){
        idValid = await FreightPricingWeight.findOne(whereIdOption);
      }else if(requestData.table == 'ta_getambrands'){
        idValid = await TaGetAmBrands.findOne(whereIdOption);
      }else if(requestData.table == 'ta_article_pricing'){
        idValid = await TaArticlePricing.findOne(whereIdOption);
      }else{
        return fun.returnResponse(res,false,401,"Something went wrong ! Please try again later.");
      }

      if (!idValid) return fun.returnResponse(res,false,401,"Resource id "+ req.params.id +" not found.");

      if(requestData.table == 'membership_options'){
        deleteRow =   await MembershipOption.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'blog_news'){
        deleteRow =   await Blog.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'pricing_by_cat_sub'){
        deleteRow =   await PricingByCatSub.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'articlerating'){
        deleteRow =   await Rating.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'article_price_requests'){
        deleteRow =   await ArticlePriceRequests.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'ta_article_recommends'){
        deleteRow =   await TaArticleRecommends.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'faqs'){
        deleteRow =   await Faqs.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'freight_zones'){
        deleteRow =   await FreightZones.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'discounts'){
        deleteRow =   await Discounts.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'custom_duties'){
        deleteRow =   await CustomDuties.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'sliders'){
        deleteRow =   await Sliders.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'campaigns'){
        deleteRow =   await Campaigns.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'pp_freight_pricing'){
        deleteRow =   await FreightPricing.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'ta_getmanufacturers'){
        deleteRow =   await TaGetManufacturers.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'ta_article_pricing'){
        deleteRow =   await TaArticlePricing.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'ta_getambrands'){
        deleteRow =   await TaGetAmBrands.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'ta_getmodelseries'){
        deleteRow =   await TaGetModelSeries.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table === 'insurance_types'){
        deleteRow =   await InsuranceTypes.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'ta_getvehicleidsbycriteria'){
        deleteRow =   await TaGetVehicleIdsByCriteria.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'ta_parts_category'){
        deleteRow =   await TaPartsCategory.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'ta_parts_category_sub'){
        deleteRow =   await TaPartsCategorySubs.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'supplierarticles'){
        deleteRow =   await SupplierArticles.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'riparo_friends_categories'){
        deleteRow =   await RiparoFriendsCategories.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'faqs_categories'){
        deleteRow =   await FaqsCategories.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'riparo_friends'){
        deleteRow =   await RiparoFriends.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'users'){
        deleteRow =   await User.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else if(requestData.table == 'freight_pricing_weight'){
        deleteRow =   await FreightPricingWeight.destroy({
                        where:{
                          id : req.params.id
                        }
                      });
      }else{
        return fun.returnResponse(res,false,401,"Something went wrong ! Please try again later.");
      }

      if(deleteRow){
        return fun.returnResponse(res,true,200,"Successfully Deleted.");
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong.");
      }
    } catch (error) {
      throw error;
    }
  },

  // GET Customers

  getAllCustomers: async function (req, res) {
    try {

      let whereCond = {};
      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 10;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      const offset = (page-1) * Number(limit);

      // search
      var search = "";
      if(req.query.search){
        whereCond.firstName = { [Op.like] : '' + req.query.search + '%' }
      }
      whereCond.userType='Customer';

      // total records

      allOptions = await User.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await User.findAll({
        attributes:['id','firstName','lastName','email','accountStatus','userType',[sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'createdAt']
      ],
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Customers",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Membership Options.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
  // Get Edit data
  editGetCustomer: async function (req, res) {
    try {

      // option id valid
    

      var optionIsValid = {};
      optionIsValid = await User.findOne({
        where:{
          id:req.query.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Customer id with "+ req.query.id +" not found.");

      var Customers ={};
      Customers = await User.findOne({
        where:{
          id : req.query.id
        },
        raw:true
      });

      if(Customers){
          return fun.returnResponse(res,true,200,"Customer Option",Customers);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
  // delete customer
  deleteCustomer:async function(req,res){
    var delete_customer  = await User.destroy({
      where:{
        id:req.query.id
      }
    });
      if(delete_customer){
        return fun.returnResponse(res,true,200,"Customer Deleted Successfully");
      } else {
        return fun.returnResponse(res,false,500,"Customer cannot be deleted.");
        return false;
      }

  },


  getAllProviders: async function (req, res) {
    try {

      let whereCond = {};
      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 10;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      const offset = (page-1) * Number(limit);

      // search
      var search = "";
      if(req.query.search){
        whereCond.name = { [Op.like] : '' + req.query.search + '%' }
      }
      whereCond.userType='Service Provider';

      // total records

      allOptions = await User.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await User.findAll({
        attributes:['id','firstName','lastName','email','accountStatus','userType',[sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'createdAt']
      ],
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allOptions){
        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }
        return fun.returnResponse(res,true,200,"All Provider",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Membership Options.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  addCustomer: async function (req, res) {
    try {
      var requestData = req.body;
      requestData.password = crypto.createHash('sha1').update(requestData.password).digest('hex');
     var check_email = await User.findOne({
       where:{
         email:requestData.email
       },
       raw:true
     });
     if(check_email !=null){
      return fun.returnResponse(res,false,409,"Email already added.");
      return false;
     }
     var create_data = await User.create(requestData);
        if(create_data){
          return fun.returnResponse(res,true,200,"Customer Added Successfully");          
        }else{
          return fun.returnResponse(res,false,500,"Customer cannot be inserted.");
        }

    
    } catch (error) {
      throw error;
    }
  },

  editCustomer: async function (req, res) {
    try {
     var requestData = req.body;

     var check_email = await User.findOne({
       where:{
         email:requestData.email,
         id:{
           [Op.ne]:requestData.id
         }
       },
       raw:true
     });
     if(check_email !=null){
      return fun.returnResponse(res,false,409,"Email already added.");
      return false;
     }
     var id =requestData.id;
     delete requestData.id
     var create_data = await User.update(requestData,{
       where:{
         id:id
       }
     });
        if(create_data){
          return fun.returnResponse(res,true,200,"Customer Edit Successfully");          
        }else{
          return fun.returnResponse(res,false,500,"Customer cannot be edit.");
        }

    
    } catch (error) {
      throw error;
    }
  },

  
  getAllSuppliers: async function (req, res) {
    try {

      let whereCond = {};
      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 10;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      const offset = (page-1) * Number(limit);

      // search
      var search = "";
      if(req.query.search){
        whereCond.agentName = { [Op.like] : '' + req.query.search + '%' }
      }
    //  whereCond.userType='Service Provider';

      // total records

      allOptions = await suppliers.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await suppliers.findAll({
        attributes:['id','companyName','agentName','email','accountStatus','mobileNumber',[sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'createdAt']
      ],
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allOptions){
        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }
        return fun.returnResponse(res,true,200,"All Suppliers",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Suppliers Options.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  addSupplier: async function (req, res) {
    try {
      var requestData = req.body;
      requestData.password = crypto.createHash('sha1').update(requestData.password).digest('hex');
     var check_email = await suppliers.findOne({
       where:{
         email:requestData.email
       },
       raw:true
     });
     if(check_email !=null){
      return fun.returnResponse(res,false,409,"Email already added.");
      return false;
     }
     var create_data = await suppliers.create(requestData);
        if(create_data){
          return fun.returnResponse(res,true,200,"Supplier Added Successfully");          
        }else{
          return fun.returnResponse(res,false,500,"Supplier cannot be inserted.");
        }

    
    } catch (error) {
      throw error;
    }
  },

  // supplier edit ----

  editGetSupplier: async function (req, res) {
    try {
      var optionIsValid = {};
      optionIsValid = await suppliers.findOne({
        where:{
          id:req.query.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Supplier id with "+ req.query.id +" not found.");

      var Customers ={};
      Customers = await suppliers.findOne({
        where:{
          id : req.query.id
        },
        raw:true
      });
     // console.log(Customers,"======================")
      if(Customers){
          return fun.returnResponse(res,true,200,"Suppliers Option",Customers);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
  //  edit suppliers save

  editSupplier: async function (req, res) {
    try {
     var requestData = req.body;
     var check_email = await suppliers.findOne({
       where:{
         email:requestData.email,
         id:{
           [Op.ne]:requestData.id
         }
       },
       raw:true
     });
     if(check_email !=null){
      return fun.returnResponse(res,false,409,"Email already added.");
      return false;
     }
     var id =requestData.id;
     delete requestData.id
     var create_data = await suppliers.update(requestData,{
       where:{
         id:id
       }
     });
        if(create_data){
          return fun.returnResponse(res,true,200,"Customer Edit Successfully");          
        }else{
          return fun.returnResponse(res,false,500,"Customer cannot be edit.");
        }

    
    } catch (error) {
      throw error;
    }
  },

  /**** ARTICLE FAQS ****/

  // get
  allArticleFaqs: async function (req, res) {
    try {

      let whereCond = { answer :null };

      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 2;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      var productId = '';
      if(req.query.productId){
        whereCond.productId = req.query.productId;
      }

      const offset = (page-1) * Number(limit);

      // total records

      allData = await ArticleQas.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await ArticleQas.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"Success",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get

  getArticleFaq: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await ArticleQas.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"ArticleQas id with "+ req.params.id +" not found.");

      var membershipOption ={};
      membershipOption = await ArticleQas.findOne({
        where:{
          id : req.params.id
        }
      });

      if(membershipOption){
          return fun.returnResponse(res,true,200,"ArticleQas",membershipOption);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update

  updateArticleFaq: async function (req, res) {
    try {
      req.check('answer').notEmpty().withMessage('Please enter answer.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // option id valid
      var optionIsValid = {};
      optionIsValid = await ArticleQas.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Question id with "+ req.params.id +" not found.");

      updateData =  await ArticleQas.update({ answer:requestData.answer },{
                            where:{
                              id : req.params.id
                            }
                          });
      if(updateData){
        return fun.returnResponse(res,true,200,"Answered Successfully");
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong.");
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allSupplierTypes: async function (req, res) {
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
        whereCond.name = { [Op.like] : '' + req.query.search + '%' }
      }

      // total records

      allOptions = await SupplierTypes.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await SupplierTypes.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allCurrencies: async function (req, res) {
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
        whereCond.currencyCode = { [Op.like] : '' + req.query.search + '%' }
      }

      // total records

      allOptions = await Currencies.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await Currencies.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['status', 'ASC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allCountries: async function (req, res) {
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
        whereCond.name = { [Op.like] : '' + req.query.search + '%' }
      }

      // total records

      allOptions = await Countries.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await Countries.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'ASC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allFreightZones: async function (req, res) {
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
        whereCond.name = { [Op.like] : '' + req.query.search + '%' }
      }

      // total records

      allOptions = await FreightZones.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await FreightZones.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'ASC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  
  // add zone

  addZone: async function (req, res) {
    try {

      req.check('name').notEmpty().withMessage('Please enter name.');
      req.check('code').notEmpty().withMessage('Please enter code.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var checkMembershipOption ={};
      checkMembershipOption = await FreightZones.findOne({
        where:{
          name:requestData.name,
          code:requestData.code
        }
      });

      if(!checkMembershipOption){

        insertData = await FreightZones.create({
                        name:requestData.name,
                        code:requestData.code
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Added Successfully");          
        }else{
          return fun.returnResponse(res,false,500,"cannot be inserted.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Already added with same name.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update

  updateZone: async function (req, res) {
    try {

      req.check('name').notEmpty().withMessage('Please enter name.');
      req.check('code').notEmpty().withMessage('Please enter code.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // option id valid
      var optionIsValid = {};
      optionIsValid = await FreightZones.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Zone id with "+ req.params.id +" not found.");

      var checkMembershipOption ={};
      checkMembershipOption = await FreightZones.findOne({
        where:{
          name:requestData.name,
          code:requestData.code,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!checkMembershipOption){

        updateData =  await FreightZones.update({ name:requestData.name,code:requestData.code },{
                              where:{
                                id : req.params.id
                              }
                            });
        if(updateData){
          return fun.returnResponse(res,true,200,"Zone Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Zone cannot be updated.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Zone already added with same name.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // delete

  deleteZone: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await FreightZones.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Category id with "+ req.params.id +" not found.");

      var deleteMembershipOption ={};
      deleteMembershipOption = await FreightZones.destroy({
        where:{
          id : req.params.id
        }
      });

      if(deleteMembershipOption){
          return fun.returnResponse(res,true,200,"Zone Deleted Successfully");
      } else {
        return fun.returnResponse(res,false,500,"Zone cannot be deleted.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get

  getZone: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await FreightZones.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Membership id with "+ req.params.id +" not found.");

      var membershipOption ={};
      membershipOption = await FreightZones.findOne({
        where:{
          id : req.params.id
        }
      });

      if(membershipOption){
          return fun.returnResponse(res,true,200,"Category",membershipOption);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allShippingInsurances: async function (req, res) {
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
        whereCond.name = { [Op.like] : '' + req.query.search + '%' }
      }

      // total records

      allOptions = await InsuranceTypes.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await InsuranceTypes.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'ASC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // import zone Pricing

  importZonePricing: async function (req, res) {
    try {

      var requestData = req.files;
      var file = req.files.file;
      let oldpath = await fun.uploadFile(file, 'uploads');

      readXlsxFile(fs.createReadStream(process.cwd()+'/server/public/'+oldpath)).then(async (rows) => {

        rows = rows.slice(1);

        if(rows.length){

          for(var i=0; i < rows.length;i++){

            var checkAl ={};
            checkAl = await FreightPricingWeight.findOne({
              where:{
                weight:rows[i][0],
                zoneNumberFrom:rows[i][1],
                zoneNumberTo:rows[i][2],
              }
            });

            if(!checkAl){
              await FreightPricingWeight.create({
                weight : rows[i][0],
                zoneNumberFrom : rows[i][1],
                zoneNumberTo: rows[i][2],
                price : rows[i][3],
                localTaxes : rows[i][4],
                expressDelivery : rows[i][5],
              });
            }
          }

          return fun.returnResponse(res,true,200,"Data Imported Successfully");

        }else{
          return fun.returnResponse(res,false,400,"There is no data to import.");
        }
      });
    } catch (error) {
      throw error;
    }
  },

  // get all

  allZonePricing: async function (req, res) {
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
                             weight:  req.query.search,
                            },
                            { 
                             zoneNumber:  req.query.search,
                            }
                          ]
                        }
      }

      // total records

      allData = await FreightPricingWeight.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await FreightPricingWeight.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Runt Db Rows",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // import zone Pricing

  importTecArticlePricing: async function (req, res) {
    try {

      var requestData = req.files;
      var file = req.files.file;
      let oldpath = await fun.uploadFile(file, 'uploads');

      readXlsxFile(fs.createReadStream(process.cwd()+'/server/public/'+oldpath)).then(async (rows) => {

        rows = rows.slice(1);

        if(rows.length){

          for(var i=0; i < rows.length;i++){

            var checkAl ={};
            checkAl = await TaArticlePricing.findOne({
              where:{
                articleNumber:rows[i][0]
              }
            });

            if(!checkAl){
              await TaArticlePricing.create({
                articleNumber : rows[i][0],
                supplierId : rows[i][1],
                supplierName: rows[i][2],
                price : rows[i][3],
                currency : rows[i][4],
                zoneNumber : rows[i][5],
                weight : rows[i][6],
                country : rows[i][7]
              });
            }else{
              await TaArticlePricing.update({
                articleNumber : rows[i][0],
                supplierId : rows[i][1],
                supplierName: rows[i][2],
                price : rows[i][3],
                currency : rows[i][4],
                zoneNumber : rows[i][5],
                weight : rows[i][6],
                country : rows[i][7]
              },{
                where:{
                  articleNumber : rows[i][0]
                }
              });
            }
          }

          return fun.returnResponse(res,true,200,"Data Imported Successfully");

        }else{
          return fun.returnResponse(res,false,400,"There is no data to import.");
        }
      });
    } catch (error) {
      throw error;
    }
  },

  // importTecArticleRecommend

  importTecArticleRecommend: async function (req, res) {
    try {

      var requestData = req.files;
      var file = req.files.file;
      let oldpath = await fun.uploadFile(file, 'uploads');

      readXlsxFile(fs.createReadStream(process.cwd()+'/server/public/'+oldpath)).then(async (rows) => {

        rows = rows.slice(1);

        if(rows.length){

          for(var i=0; i < rows.length;i++){

            var checkAl ={};
            checkAl = await TaArticleRecommends.findOne({
              where:{
                articleNumber:rows[i][0]
              }
            });

            if(!checkAl){
              await TaArticleRecommends.create({
                articleNumber : rows[i][0],
                isRecommended : rows[i][1],
                isFeatured: rows[i][2]
              });
            }else{
              await TaArticleRecommends.update({
                articleNumber : rows[i][0],
                isRecommended : rows[i][1],
                isFeatured: rows[i][2]
              },{
                where:{
                  articleNumber : rows[i][0]
                }
              });
            }
          }

          return fun.returnResponse(res,true,200,"Data Imported Successfully");

        }else{
          return fun.returnResponse(res,false,400,"There is no data to import.");
        }
      });
    } catch (error) {
      throw error;
    }
  },

  // get all

  allTecArticlePricing: async function (req, res) {
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
                             articleNumber:  req.query.search,
                            },
                            { 
                             supplierName:  req.query.search,
                            }
                          ]
                        }
      }

      // total records

      allData = await TaArticlePricing.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await TaArticlePricing.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Runt Db Rows",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allTecArticleRecommend: async function (req, res) {
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
                             articleNumber:  { [Op.like] : '' + req.query.search + '%' },
                            }
                          ]
                        }
      }

      var isFeatured = '';
      if(req.query.isFeatured){
        whereCond.isFeatured = req.query.isFeatured;
      }

      // total records

      allData = await TaArticleRecommends.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);

      var allDataP = {};
      allDataP = await TaArticleRecommends.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Rows",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get

  tecArticlePricingOne: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await TaArticlePricing.findOne({
        where:{
          articleNumber:req.query.articleNumber,
        },
        raw: true
      });

      if (!optionIsValid) return fun.returnResponse(res,false,404,"articleNumber with number "+ req.query.articleNumber +" not found.");

      var membershipOption ={};
      membershipOption = await TaArticlePricing.findOne({
        where:{
          articleNumber : req.query.articleNumber
        },
        raw : true
      });

      if(membershipOption){

        // convert price into local currency

        if(membershipOption.currency !== 'COP'){
          // get currency of article
          var checkCurrencyValue ={};
          checkCurrencyValue = await Currencies.findOne({
            where:{
              currencyId:membershipOption.currency
            },
            raw: true
          });


          membershipOption.price = Number(membershipOption.price) * Number(checkCurrencyValue.valueInCop);
        }

        // get vat
        var getVat ={};
        getVat = await TaxManagement.findOne({
          where:{
            id:1
          },
          raw: true
        });

        var vat = (membershipOption.price * (getVat.vat / 100)).toFixed(4);
        var insuranceVal = (membershipOption.price * (getVat.baseInsurance / 100)).toFixed(4);

        // get pricing by cat sub
        var pricingCatSub = {};
        pricingCatSub = await PricingByCatSub.findOne({
          where:{
            indirectExpense:req.query.dataSupplierId,
            categoryId:req.query.categoryId,
            subCategoryId:req.query.subCategoryId
          },
          raw: true
        });

        if(pricingCatSub){

          var indExp = (membershipOption.price * (pricingCatSub.indExp / 100)).toFixed(4);
          var dCost = (membershipOption.price * (pricingCatSub.directCost / 100)).toFixed(4);
          var tecPrcnt = (membershipOption.price * (pricingCatSub.tecPercent / 100)).toFixed(4);

          membershipOption.retailPrice = parseInt(Number(membershipOption.price) + Number(vat) + Number(insuranceVal) + Number(indExp) + Number(dCost) + Number(tecPrcnt)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

          membershipOption.salePrice = parseInt((Number(membershipOption.price) + Number(vat)) * (1 - (pricingCatSub.discount /100)) ).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        }else{
          membershipOption.salePrice = parseInt(   Number(membershipOption.price) + Number(vat)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        }

        membershipOption.vat = getVat.vat;

        return fun.returnResponse(res,true,200,"Success",membershipOption);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // import zone countries

  importZoneCountries: async function (req, res) {
    try {

      var requestData = req.files;
      var file = req.files.file;
      let oldpath = await fun.uploadFile(file, 'uploads');

      readXlsxFile(fs.createReadStream(process.cwd()+'/server/public/'+oldpath)).then(async (rows) => {

        rows = rows.slice(1);

        if(rows.length){

          for(var i=0; i < rows.length;i++){

            var checkAl ={};
            checkAl = await FreightZoneCountries.findOne({
              where:{
                zoneNumber:rows[i][0],
                englishName:rows[i][1],
                spanishName:rows[i][2]
              }
            });

            if(!checkAl){
              await FreightZoneCountries.create({
                zoneNumber:rows[i][0],
                englishName:rows[i][1],
                spanishName:rows[i][2]
              });
            }
          }

          return fun.returnResponse(res,true,200,"Data Imported Successfully");

        }else{
          return fun.returnResponse(res,false,400,"There is no data to import.");
        }
      });
    } catch (error) {
      throw error;
    }
  },

  // get all

  allZoneCountries: async function (req, res) {
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
        whereCond.englishName = { [Op.like] : '' + req.query.search + '%' }
      }

      // total records

      allData = await FreightZoneCountries.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await FreightZoneCountries.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"Data",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // add ZoneCountries

  addZoneCountries: async function (req, res) {
    try {
      req.check('zoneNumber').notEmpty().withMessage('Please enter zoneNumber.');
      req.check('englishName').notEmpty().withMessage('Please enter englishName.');
      req.check('spanishName').notEmpty().withMessage('Please enter spanishName.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check already added
      var checkAlr ={};
      checkAlr = await FreightZoneCountries.findOne({
        where:{
          zoneNumber:requestData.zoneNumber,
          englishName:requestData.englishName,
        }
      });

      if(!checkAlr){

        insertData = await FreightZoneCountries.create({
                        zoneNumber: requestData.zoneNumber,
                        englishName: requestData.englishName,
                        spanishName: requestData.spanishName
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Already added with same country and zone.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update ZoneCountries

  updateZoneCountries: async function (req, res) {
    try {
      req.check('zoneNumber').notEmpty().withMessage('Please enter zoneNumber.');
      req.check('englishName').notEmpty().withMessage('Please enter englishName.');
      req.check('spanishName').notEmpty().withMessage('Please enter spanishName.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // id valid
      var IsValid = {};
      IsValid = await FreightZoneCountries.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Country id with "+ req.params.id +" not found.");

      var check ={};
      check = await FreightZoneCountries.findOne({
        where:{
          zoneNumber:requestData.zoneNumber,
          englishName:requestData.englishName,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!check){

        updateData =  await FreightZoneCountries.update({ 
                                      zoneNumber: requestData.zoneNumber,
                                      englishName: requestData.englishName,
                                      spanishName: requestData.spanishName
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,"Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Country cannot be updated.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Already added with same country and zone.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get ZoneCountries

  getZoneCountries: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await FreightZoneCountries.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Country id with "+ req.params.id +" not found.");

      if(IsValid){
          return fun.returnResponse(res,true,200,"DATA",IsValid);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // getZoneByCountry

  getZoneByCountry: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await FreightZoneCountries.findOne({
        where:{
          englishName:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Country id with "+ req.params.id +" not found.");

      if(IsValid){
          return fun.returnResponse(res,true,200,"DATA",IsValid);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // getCatSubByName

  getCatSubByName: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await TaPartsCategorySub.findOne({
        where:{
          carType:req.query.vehicleType,
          assemblyGroupName:{ [Op.like] : '' + req.query.name + '%' }
        },
        raw: true
      });

      console.log(IsValid);

      return fun.returnResponse(res,true,200,"DATA",IsValid);
      
    } catch (error) {
      throw error;
    }
  },

  // add ZonePricing

  addZonePricing: async function (req, res) {
    try {
      req.check('zoneNumberFrom').notEmpty().withMessage('Please origin zoneNumber.');
      req.check('zoneNumberTo').notEmpty().withMessage('Please destination zoneNumber.');
      req.check('weight').notEmpty().withMessage('Please enter weight.');
      req.check('price').notEmpty().withMessage('Please enter price.');
      req.check('localTaxes').notEmpty().withMessage('Please enter localTaxes.');
      req.check('expressDelivery').notEmpty().withMessage('Please enter expressDelivery.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check already added
      var checkAlr ={};
      checkAlr = await FreightPricingWeight.findOne({
        where:{
          zoneNumberFrom:requestData.zoneNumberFrom,
          zoneNumberTo:requestData.zoneNumberTo,
          weight:requestData.weight,
        }
      });

      if(!checkAlr){

        insertData = await FreightPricingWeight.create({
                        zoneNumberFrom: requestData.zoneNumberFrom,
                        zoneNumberTo: requestData.zoneNumberTo,
                        weight: requestData.weight,
                        price: requestData.price,
                        localTaxes: requestData.localTaxes,
                        expressDelivery: requestData.expressDelivery
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Already added with same weight and zone.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update Zone Pricing

  updateZonePricing: async function (req, res) {
    try {
      req.check('zoneNumberFrom').notEmpty().withMessage('Please origin zoneNumber.');
      req.check('zoneNumberTo').notEmpty().withMessage('Please destination zoneNumber.');
      req.check('weight').notEmpty().withMessage('Please enter weight.');
      req.check('price').notEmpty().withMessage('Please enter price.');
      req.check('localTaxes').notEmpty().withMessage('Please enter localTaxes.');
      req.check('expressDelivery').notEmpty().withMessage('Please enter expressDelivery.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // id valid
      var IsValid = {};
      IsValid = await FreightPricingWeight.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Country id with "+ req.params.id +" not found.");

      var check ={};
      check = await FreightPricingWeight.findOne({
        where:{
          zoneNumberFrom:requestData.zoneNumberFrom,
          zoneNumberTo:requestData.zoneNumberTo,
          weight:requestData.weight,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!check){

        updateData =  await FreightPricingWeight.update({ 
                                      zoneNumberFrom: requestData.zoneNumberFrom,
                                      zoneNumberTo: requestData.zoneNumberTo,
                                      weight: requestData.weight,
                                      price: requestData.price,
                                      localTaxes: requestData.localTaxes,
                                      expressDelivery: requestData.expressDelivery
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,"Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Country cannot be updated.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Already added with same zone and weight.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get ZonePricing

  getZonePricing: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await FreightPricingWeight.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Pricing id with "+ req.params.id +" not found.");

      if(IsValid){
          return fun.returnResponse(res,true,200,"DATA",IsValid);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get ZonePricing by shipment

  getZonePricingByShipment: async function (req, res) {
    try {

      // calculate express delivery
      allData = await FreightPricingWeight.sequelize.query(`SELECT * FROM freight_pricing_weight where zone_number_from = `+ req.query.zone1 +` and zone_number_to = `+ req.query.zone2 +` order by abs(weight - 2.7) limit 1`, {
        type: sequelize.QueryTypes.SELECT,
        raw: true
      });

      // get vat
      var getVat ={};
      getVat = await TaxManagement.findOne({
        where:{
          id:1
        },
        raw: true
      });

      var data = {};

      if(allData.length){

        // get pricing by cat sub
        var pricingCatSub = {};
        pricingCatSub = await PricingByCatSub.findOne({
          where:{
            indirectExpense:req.query.dataSupplierId,
            categoryId:req.query.categoryId,
            subCategoryId:req.query.subCategoryId,
          },
          raw: true
        });

        var shipmentPrice = (Number(allData[0].price) + Number((allData[0].express_delivery/100)*allData[0].price) + (Number(1) + Number(pricingCatSub.expectedProfit/100)) + (Number(1) + Number(getVat.vat / 100)) );

        var expProfitt = parseInt(Number(shipmentPrice)*Number(pricingCatSub.expectedProfit/100));

        var expVatt = parseInt(Number(shipmentPrice)*Number(getVat.vat/100));

        data.finalShipmentPrice = parseInt(Number(shipmentPrice) + Number(expProfitt) + Number(expVatt)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }else{
        data.finalShipmentPrice = 0;
      }

      // calculate custom duties

      // formulae : (Order price without extras + Custom Duty value according table) * % VAT Tax
      data.customDuties = 0;
      if(req.query.localCountry && req.query.productCountry){

        if(req.query.localCountry !== req.query.productCountry){
            
          // get cuD
          var getCd ={};
          getCd = await CustomDuties.findOne({
            where:{
              originCountry: req.query.zone1,
              categoryId: req.query.categoryId
            },
            raw: true
          });

          if(getCd){

            var customD = ((Number(req.query.price) + Number(req.query.price)*Number(getCd.fees/100))* Number(getVat.vat/100)).toFixed(4);

            data.customDuties = customD;

          }
        }
      }

      // calculate insurance

      if(req.query.zone1 === req.query.zone2){
        var type = 'Local';
      }else{
        var type = 'International';
      }

      // get pricing by shipment type
      var getInsurancePricing = {};
      getInsurancePricing = await ShippingInsurancePrices.findAll({
        where:{
          shipmentType:type
        },
        raw: true
      });

      // get pricing by cat sub
      var pricingCatSub2 = {};
      pricingCatSub2 = await PricingByCatSub.findOne({
        where:{
          indirectExpense:req.query.dataSupplierId,
          categoryId:req.query.categoryId,
          subCategoryId:req.query.subCategoryId,
        },
        raw: true
      });

        // get vat
        var getVat2 ={};
        getVat2 = await TaxManagement.findOne({
          where:{
            id:1
          },
          raw: true
        });

      if(getInsurancePricing.length){
        for(var i=0;i < getInsurancePricing.length;i++){

          // insurance formulae

          // INSURANCE FORMULAE : (Additional Services Costs (Insurance, Premium Shipping, etc.) * (1 +% Expected Profitability)) + Local Taxes

          // local full risk

          var testValue = Number(req.query.price) + Number(req.query.price)*Number(getInsurancePricing[i].rate/100);

          if(getInsurancePricing[i].minimumValue > testValue){ // if minimum value is greater
            var newPrice = getInsurancePricing[i].minimumValue;
          }else{
            var newPrice = testValue;
          }

          if(pricingCatSub2){

            var expProfitt = parseInt(Number(newPrice)*Number(pricingCatSub2.expectedProfit/100));

            var expVatt = parseInt(Number(newPrice)*Number(getVat2.vat/100));

            getInsurancePricing[i].insuranceValue = Number(newPrice) +  + Number(expProfitt) + Number(expVatt);
          }

        }

        data.insurance = getInsurancePricing;
      }else{
        data.insurance = [];
      }

      console.log(data);

      if(allData){
          return fun.returnResponse(res,true,200,"DATA",data);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allInsurancePricing: async function (req, res) {
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
        whereCond.insuraneType = { [Op.like] : '' + req.query.search + '%' }
      }

      // total records

      allData = await ShippingInsurancePrices.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await ShippingInsurancePrices.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"Data",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // add Insurance Pricing

  addInsurancePricing: async function (req, res) {
    try {
      req.check('shipmentType').notEmpty().withMessage('Please select shipmentType.');
      req.check('insuranceType').notEmpty().withMessage('insuranceType.');
      req.check('rate').notEmpty().withMessage('Please enter rate.');
      req.check('minimumValue').notEmpty().withMessage('Please enter minimumValue.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check already added
      var checkAlr ={};
      checkAlr = await ShippingInsurancePrices.findOne({
        where:{
          insuranceType:requestData.insuranceType,
          shipmentType:requestData.shipmentType
        }
      });

      if(!checkAlr){

        insertData = await ShippingInsurancePrices.create({
                        insuranceType: requestData.insuranceType,
                        shipmentType: requestData.shipmentType,
                        rate: requestData.rate,
                        minimumValue: requestData.minimumValue
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Already added with same shipment type and insurance.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update Insurance Pricing

  updateInsurancePricing: async function (req, res) {
    try {
      req.check('shipmentType').notEmpty().withMessage('Please select shipmentType.');
      req.check('insuranceType').notEmpty().withMessage('insuranceType.');
      req.check('rate').notEmpty().withMessage('Please enter rate.');
      req.check('minimumValue').notEmpty().withMessage('Please enter minimumValue.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // id valid
      var IsValid = {};
      IsValid = await ShippingInsurancePrices.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Pricing id with "+ req.params.id +" not found.");

      var check ={};
      check = await ShippingInsurancePrices.findOne({
        where:{
          insuranceType:requestData.insuranceType,
          shipmentType:requestData.shipmentType,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!check){

        updateData =  await ShippingInsurancePrices.update({ 
                                      insuranceType: requestData.insuranceType,
                                      shipmentType: requestData.shipmentType,
                                      rate: requestData.rate,
                                      minimumValue: requestData.minimumValue
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,"Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Country cannot be updated.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Already added with same shipment type and insurance.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get InsurancePricing

  getInsurancePricing: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await ShippingInsurancePrices.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Pricing id with "+ req.params.id +" not found.");

      if(IsValid){
          return fun.returnResponse(res,true,200,"DATA",IsValid);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get apiGetArticlePriceByCatSub

  getArticlePriceByCatSub: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await PricingByCatSub.findOne({
        where:{
          indirectExpense:req.query.id3,
          categoryId:req.query.id,
          subCategoryId:req.query.id2,
        }
      });

      console.log(IsValid);

      return fun.returnResponse(res,true,200,"DATA",IsValid);
      
    } catch (error) {
      throw error;
    }
  },

  getArticlePriceByCatSubAll: async function (req, res) {
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
        search = " and (  b.shortCutName LIKE '" + req.query.search + "%' OR c.assemblyGroupName LIKE '" + req.query.search + "%' OR d.brandName LIKE '" + req.query.search + "%') ";
      }

      // total records

      allData = await PricingByCatSub.sequelize.query(`SELECT a.*,b.shortCutName,c.assemblyGroupName,d.brandName from pricing_by_cat_sub as a , ta_parts_category as b , ta_parts_category_sub as c , ta_getambrands as d where a.category_id = b.shortCutId and a.sub_category_id = c.assemblyGroupNodeId and a.indirect_expense = d.brandId `+ search +` order by a.id asc`, {
        type: sequelize.QueryTypes.SELECT
      });
      const totalPages = Math.ceil(allData.length/limit);

      var allDataP = [];
      allDataP = await PricingByCatSub.sequelize.query(`SELECT a.*,b.shortCutName,c.assemblyGroupName,d.brandName from pricing_by_cat_sub as a , ta_parts_category as b , ta_parts_category_sub as c , ta_getambrands as d where a.category_id = b.shortCutId and a.sub_category_id = c.assemblyGroupNodeId and a.indirect_expense = d.brandId `+ search +` order by a.id asc LIMIT  `+ offset +` , `+ limit +` `, {
        type: sequelize.QueryTypes.SELECT
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.length , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Data",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get

  getArticlePriceByCatSubOne: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await PricingByCatSub.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid){
        allDataP = {};
      }else{
        allDataP = await PricingByCatSub.sequelize.query(`SELECT a.*,b.shortCutName,c.assemblyGroupName,d.brandName from pricing_by_cat_sub as a , ta_parts_category as b , ta_parts_category_sub as c , ta_getambrands as d where a.category_id = b.shortCutId and a.sub_category_id = c.assemblyGroupNodeId and a.indirect_expense = d.brandId and a.id = '`+req.params.id+`' `, {
          type: sequelize.QueryTypes.SELECT
        });

        allDataP = allDataP[0]
      }

      return fun.returnResponse(res,true,200,"Category",allDataP);
      
    } catch (error) {
      throw error;
    }
  },

  // update discount

  updateArticlePriceByCatSub: async function (req, res) {
    try {
      req.check('directCost').notEmpty().withMessage('directCost');
      req.check('tecPercent').notEmpty().withMessage('tecPercent');
      req.check('expectedProfit').notEmpty().withMessage('expectedProfit');
      req.check('discount').notEmpty().withMessage('discount');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // blog id valid
      var IsValid = {};
      IsValid = await PricingByCatSub.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Resource id with "+ req.params.id +" not found.");

      updateData =  await PricingByCatSub.update({ 
                                    directCost:requestData.directCost,
                                    tecPercent:requestData.tecPercent,
                                    expectedProfit:requestData.expectedProfit,
                                    discount:requestData.discount,
                                    localTaxes:requestData.localTaxes,
                                    indExp:requestData.indExp
                                  },{
                                  where:{
                                    id : req.params.id
                                  }
                              });
      
        return fun.returnResponse(res,true,200,"Updated Successfully");
        
    } catch (error) {
      throw error;
    }
  },

  // articlePriceByCatSub
  articlePriceByCatSub: async function (req, res) {
    try {

      req.check('categoryId').notEmpty().withMessage('categoryId');
      req.check('subCategoryId').notEmpty().withMessage('subCategoryId');
      req.check('indirectExpense').notEmpty().withMessage('Supplier');
      req.check('directCost').notEmpty().withMessage('directCost');
      req.check('tecPercent').notEmpty().withMessage('tecPercent');
      req.check('expectedProfit').notEmpty().withMessage('expectedProfit');
      req.check('discount').notEmpty().withMessage('discount');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var subArr = requestData.subCategoryId.split(",");

      if(subArr.length){

        for(var i=0;i < subArr.length;i++){

          // is valid
          var IsValid = {};
          IsValid = await PricingByCatSub.findOne({
            where:{
              categoryId:requestData.categoryId,
              indirectExpense:requestData.indirectExpense,
              subCategoryId:subArr[i]
            },
            raw: true
          });

          var upp =   {
                        categoryId:requestData.categoryId,
                        indirectExpense:requestData.indirectExpense,
                        subCategoryId:subArr[i],
                        directCost:requestData.directCost,
                        tecPercent:requestData.tecPercent,
                        expectedProfit:requestData.expectedProfit,
                        discount:requestData.discount,
                        localTaxes:requestData.localTaxes,
                        indExp:requestData.indExp
                      }

          if(IsValid){

            updateData =  await PricingByCatSub.update(upp,{
                                      where:{
                                        categoryId:requestData.categoryId,
                                        indirectExpense:requestData.indirectExpense,
                                        subCategoryId:subArr[i]
                                      }
                                  });
          }else{
            updateData =  await PricingByCatSub.create(upp);
          }
        }
      }

      return fun.returnResponse(res,true,200,"Updated Successfully");
      
    } catch (error) {
      throw error;
    }
  },
  
  // Add
  addSlider: async function (req, res) {
    try {
      var fileData = req.files;

      if(!fileData){
        return  fun.returnResponse(res,false,400,"Please select atleast one slider image");
        return false;
      }

      // upload & save article media
      var mediaFiles = req.files.media;

      if(mediaFiles.constructor !== Array){
        var file = mediaFiles;
        let mediaFile = await fun.uploadFile(file, 'slider_files');
        await Sliders.create({
          file: mediaFile
        });
      }else{
        if(mediaFiles.length){
          for(var i=0; i < mediaFiles.length;i++){
            var file = mediaFiles[i];
            let mediaFile = await fun.uploadFile(file, 'slider_files');
            await Sliders.create({
              file: mediaFile
            });
          }
        }
      }

      return fun.returnResponse(res,true,200,"Added Successfully");
          
    } catch (error) {
      throw error;
    }
  },

  // get all

  allSliders: async function (req, res) {
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

      var active = '';
      if(req.query.active){
        whereCond.status = req.query.active;
      }

      const offset = (page-1) * Number(limit);

      // total records

      allData = await Sliders.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await Sliders.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"Data",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
}