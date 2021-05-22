const db = require('../../../../models');
var dateFormat = require('dateformat');
const sequelize = require('sequelize');
var jwt = require('jsonwebtoken');
const Op = sequelize.Op;
var moment = require('moment');
var crypto = require('crypto');
const fun = require('../../../../function/api_fun.js');
const fs = require('fs');
const FileType = require('file-type');
const current_time = Math.floor(Date.now() / 1000);
const readXlsxFile = require('read-excel-file/node');
var SqlString = require('sqlstring');

/******** MODELS ***********/
const SupportTickets = db.supportTickets;
const SupportTicketsChat = db.supportTicketsChat;
const Users = db.users;
const ArticlePriceRequests = db.articlePriceRequests;
const WebsiteContent = db.websiteContent;

/** Belongs **/

SupportTickets.belongsTo(Users, {
  foreignKey: 'user_id'
});

module.exports = {
  
  // Add
  addTicket: async function (req, res) {
    try {
      req.check('userId').notEmpty().withMessage('userId cannot be empty');
      req.check('subject').notEmpty().withMessage('subject cannot be empty');
      req.check('message').notEmpty().withMessage('message cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      referenceId = "ref_"+ await fun.randomString(16);

      insertData = await SupportTickets.create({
                      userId: requestData.userId,
                      referenceId: referenceId,
                      subject:  requestData.subject,
                      message:  requestData.message
                    });

      var userData = await Users.findOne({
        where:{
          id:requestData.userId,
        },
        raw: true
      });

      var websiteC ={};
      websiteC = await WebsiteContent.findOne({
        where:{
          id : 1
        },
        raw: true
      });

      // sending email
      var data = {};
      data.subject = requestData.subject;
      data.message = requestData.message;
      data.referenceId = requestData.referenceId;
      data.userData = userData;
      data.to = websiteC.contactEmail;
      data.subject = "New Ticket Request";

      await fun.sendEmail(req, res, data, 'newTicket.html');

      if(insertData){
        return fun.returnResponse(res,true,200,"Ticket Created Successfully",1);
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong",0);
      }
    } catch (error) {
      throw error;
    }
  },

  // get
  getTickets: async function (req, res) {
    try {

      var userType = 'Customer';

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

      // for user
      if(req.query.userId){
        whereCond.userId = req.query.userId;

        var userData = await Users.findOne({
          where:{
            id:req.query.userId,
          },
          raw: true
        });

        userType = userData.userType;
      }

      // Admin
      if(req.query.isSupplier){
        if(req.query.isSupplier == 1){
          userType = 'Supplier';
        }
      }

      const offset = (page-1) * Number(limit);

      // total records

      allData = await SupportTickets.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await SupportTickets.findAll({
          limit,offset,
          where: whereCond,
          raw:true,
          nest:true,
          order: [
            ['id', 'DESC']
          ],
          include: [{
            model: Users,
            attributes: ['id','userType'],
            where: {
              userType: userType
            },
            required:true
          }]


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

  // get Ticket

  getTicket: async function (req, res) {
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

      // referenceId
      if(req.query.referenceId){
        whereCond = {
                      referenceId: req.query.referenceId
                    }
      }

      const offset = (page-1) * Number(limit);

      // total records
      allData = await SupportTicketsChat.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);

      var allDataP = {};
      allDataP = await SupportTicketsChat.findAll({
          attributes:[`id`, `referenceId`, `senderId`, `recieverId`, `message`, `createdAt`, `updatedAt`,[sequelize.literal('(select first_name from users where id = senderId)'),'senderFirstName'],[sequelize.literal('(select last_name from users where id = senderId)'),'senderLastName'],[sequelize.literal('(select first_name from users where id = recieverId)'),'recieverFirstName'],[sequelize.literal('(select last_name from users where id = recieverId)'),'recieverLastName'],[sequelize.literal('(select profile_picture from users where id = senderId)'),'senderPic'],[sequelize.literal('(select profile_picture from users where id = recieverId)'),'recieverPic']],
          limit,offset,
          where: whereCond,
          raw:true,
          nest:true,
          order: [
            ['id', 'DESC']
          ]
      });

      if(allData){

        if(req.query.adminId){
          await SupportTicketsChat.update(
              {
                isRead: 1
              },
              {
                where:{
                  referenceId: req.query.referenceId,
                }
              }
          );
        }

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

  // getTicketDetail
  getTicketDetail: async function (req, res) {
    try {

      rowDetail = await SupportTickets.findOne({
                        where:{
                          referenceId: req.query.referenceId,
                        }
                      });

      if(rowDetail){
        return fun.returnResponse(res,true,200,"Success",rowDetail);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // closeTicket
  closeTicket: async function (req, res) {
    try {

      var status = 1;
      if(req.body.status === '0'){
        status = req.body.status;
      }

      update = await SupportTickets.update(
                          {
                            status: status
                          },
                          {
                            where:{
                              referenceId: req.body.referenceId,
                            }
                          }
                      );

      if(update){
        return fun.returnResponse(res,true,200,"Success");
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // Send Message
  sendMessage: async function (req, res) {
    try {
      req.check('referenceId').notEmpty().withMessage('referenceId cannot be empty');
      req.check('senderId').notEmpty().withMessage('senderId cannot be empty');
      req.check('recieverId').notEmpty().withMessage('recieverId cannot be empty');
      req.check('message').notEmpty().withMessage('message cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      if(requestData.recieverId === 'ADMIN'){

        var adminData = await Users.findOne({
                                      where:{
                                        userType: 'Admin',
                                      },
                                      raw: true
                                    });
        requestData.recieverId = adminData.id;
      }

      var chatInfo = {
                        senderId: req.id,
                        recieverId: requestData.recieverId,
                        referenceId:  requestData.referenceId,
                        message:  requestData.message
                      }

      insertData = await SupportTicketsChat.create(chatInfo);

      if(insertData){

          if(requestData.recieverId === 1){

            var websiteC ={};
            websiteC = await WebsiteContent.findOne({
              where:{
                id : 1
              },
              raw: true
            });

            console.log(websiteC);

            var recEmail = websiteC.contactEmail;

            
          }else{

            // reciever Info
            var recInfo = await Users.findOne({
                            where:{
                              id: requestData.recieverId,
                            },
                            raw: true
                          });

            var recEmail = recInfo.email;            
          }

          var senderInfo = await Users.findOne({
                            where:{
                              id: req.id,
                            },
                            raw: true
                          });

          // sending email
          var data = {};
          data.message = requestData.message;
          data.referenceId = requestData.referenceId;
          data.userData = senderInfo;
          data.to = recEmail;
          data.subject = "Ticket Reply ( " + requestData.referenceId + " )";

          await fun.sendEmail(req, res, data, 'ticketReply.html');

        return fun.returnResponse(res,true,200,"Sent Successfully.",1);
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong",0);
      }
    } catch (error) {
      throw error;
    }
  },
  
  // contactUs
  contactUs: async function (req, res) {
    try {
      req.check('name').notEmpty().withMessage('name cannot be empty');
      req.check('email').notEmpty().withMessage('email cannot be empty');
      req.check('phone').notEmpty().withMessage('phone cannot be empty');
      req.check('subject').notEmpty().withMessage('subject cannot be empty');
      req.check('message').notEmpty().withMessage('message cannot be empty');
      req.check('emailTo').notEmpty().withMessage('emailTo cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // sending email

      var data = {};
      data.name = requestData.name;
      data.email = requestData.email;
      data.phone = requestData.phone;
      data.subject2 = requestData.subject;
      data.message = requestData.message;
      data.to = requestData.emailTo;
      data.subject = "Contact Us Request";

      await fun.sendEmail(req, res, data, 'contactUs.html');

      return fun.returnResponse(res,true,200,"Request Submitted Successfully ! Your will be contacted shortly",1);
    } catch (error) {
      throw error;
    }
  },
  
  // notifyAvailability
  notifyAvailability: async function (req, res) {
    try {
      req.check('name').notEmpty().withMessage('name cannot be empty');
      req.check('email').notEmpty().withMessage('email cannot be empty');
      req.check('articleNumber').notEmpty().withMessage('articleNumber cannot be empty');
      req.check('emailTo').notEmpty().withMessage('emailTo cannot be empty');
      req.check('message').notEmpty().withMessage('message cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      await ArticlePriceRequests.create({
                      name: requestData.name,
                      email: requestData.email,
                      articleNumber:  requestData.articleNumber,
                      message:  requestData.message
                    });

      // sending email

      var data = {};
      data.name = requestData.name;
      data.email = requestData.email;
      data.articleNumber = requestData.articleNumber;
      data.message = requestData.message;
      data.to = requestData.emailTo;
      data.subject = "Article Availability Request";

      await fun.sendEmail(req, res, data, 'notifyAvailability.html');

      return fun.returnResponse(res,true,200,"Request Submitted Successfully ! Your will be contacted shortly",1);
    } catch (error) {
      throw error;
    }
  },

  // getArticlePriceRequests

  getArticlePriceRequests: async function (req, res) {
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

      // search
      var search = "";
      if(req.query.search){
        whereCond.articleNumber = { [Op.like] : '' + req.query.search + '%' }
      }

      const offset = (page-1) * Number(limit);

      // total records
      allData = await ArticlePriceRequests.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);

      var allDataP = {};
      allDataP = await ArticlePriceRequests.findAll({
          limit,offset,
          where: whereCond,
          raw:true,
          nest:true,
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
}