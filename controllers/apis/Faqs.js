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

const Faqs = db.faqs;
const FaqsCategories = db.faqsCategories;
 
/** Belongs **/

/*model_name.belongsTo(another_model, {
  foreignKey: 'id'
});*/

module.exports = {

/*
|--------------------------------------------------------------------------
| RF CATEGORIES
|------------------------------------------------------------------------ */

  
  // add category

  addFaqCategory: async function (req, res) {
    try {
      req.check('title').notEmpty().withMessage('Please enter title.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var checkMembershipOption ={};
      checkMembershipOption = await FaqsCategories.findOne({
        where:{
          title:requestData.title,
        }
      });

      if(!checkMembershipOption){

        insertData = await FaqsCategories.create({
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

  updateFaqCategory: async function (req, res) {
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
      optionIsValid = await FaqsCategories.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Category id with "+ req.params.id +" not found.");

      var checkMembershipOption ={};
      checkMembershipOption = await FaqsCategories.findOne({
        where:{
          title:requestData.title,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!checkMembershipOption){

        updateData =  await FaqsCategories.update({ title:requestData.title },{
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

  deleteFaqCategory: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await FaqsCategories.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Category id with "+ req.params.id +" not found.");

      var deleteMembershipOption ={};
      deleteMembershipOption = await FaqsCategories.destroy({
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

  getFaqCategory: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await FaqsCategories.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Membership id with "+ req.params.id +" not found.");

      var membershipOption ={};
      membershipOption = await FaqsCategories.findOne({
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

  allFaqCategories: async function (req, res) {
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
        whereCond.title = { [Op.like] : '%' + req.query.search + '%' }
      }

      // total records
      allOptions = await FaqsCategories.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);

      var allOptionsP = {};
      allOptionsP = await FaqsCategories.findAll({
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


/*
|--------------------------------------------------------------------------
| F A Q S
|------------------------------------------------------------------------ */

  
  // add faq

  addFaq: async function (req, res) {
    try {
      req.check('faqCategoryId').notEmpty().withMessage('Please enter faqCategoryId.');
      req.check('faqCategoryName').notEmpty().withMessage('Please enter faqCategoryName.');
      req.check('question').notEmpty().withMessage('Please enter question.');
      req.check('answer').notEmpty().withMessage('Please enter answer.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check already added
      var checkAlr ={};
      checkAlr = await Faqs.findOne({
        where:{
          question:requestData.question,
        }
      });

      if(!checkAlr){

        insertData = await Faqs.create({
                        faqCategoryId: requestData.faqCategoryId,
                        faqCategoryName: requestData.faqCategoryName,
                        question: requestData.question,
                        answer:requestData.answer
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Faq Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Faq already added with same question.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update faq

  updateFaq: async function (req, res) {
    try {
      req.check('faqCategoryId').notEmpty().withMessage('Please enter faqCategoryId.');
      req.check('faqCategoryName').notEmpty().withMessage('Please enter faqCategoryName.');
      req.check('question').notEmpty().withMessage('Please enter question.');
      req.check('answer').notEmpty().withMessage('Please enter answer.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // id valid
      var IsValid = {};
      IsValid = await Faqs.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Faq id with "+ req.params.id +" not found.");

      var check ={};
      check = await Faqs.findOne({
        where:{
          question:requestData.question,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!check){

        updateData =  await Faqs.update({ 
                                      faqCategoryId: requestData.faqCategoryId,
                                      faqCategoryName: requestData.faqCategoryName,
                                      question: requestData.question,
                                      answer:requestData.answer
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,"Faq Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Faq cannot be updated.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Faq already added with same question.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get Faq

  getFaq: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await Faqs.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Faq id with "+ req.params.id +" not found.");

      var blog ={};
      blog = await Faqs.findOne({
        where:{
          id : req.params.id
        }
      });

      if(blog){
          return fun.returnResponse(res,true,200,"Faq",blog);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all faqs

  allFaqs: async function (req, res) {
    try {

      let whereCond = {};

      console.log(req.query);

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
        whereCond.question = { [Op.like] : '%' + req.query.search + '%' }
      }

      // faqCategoryId
      if(req.query.faqCategoryId){
        whereCond.faqCategoryId = req.query.faqCategoryId;
      }

      console.log(whereCond);

      // total records

      allOptions = await Faqs.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await Faqs.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Faqs",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Faqs.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
}