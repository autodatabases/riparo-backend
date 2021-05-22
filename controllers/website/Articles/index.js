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

/******** MODELS ***********/

const SupplierArticles = db.supplierarticles;
const SupplierArticlesAttributes = db.supplierarticlesattributes;
const SupplierArticlesFiles = db.supplierarticlesfiles;
const Wishlist = db.wishlist;
const Rating = db.articlerating;
const ArticleQas = db.articleQas;
const TaArticleRecommends = db. taArticleRecommends;

SupplierArticles.hasMany(SupplierArticlesAttributes, {
   foreignKey: 'supplierArticlesid'
});

SupplierArticles.hasMany(SupplierArticlesFiles, {
   foreignKey: 'supplierArticlesid'
});

module.exports = {
  
  // Add
  wishlist: async function (req, res) {
    try {
      req.check('product').notEmpty().withMessage('product cannot be empty');
      req.check('userId').notEmpty().withMessage('userId cannot be empty');
      req.check('type').notEmpty().withMessage('type cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var product = JSON.parse(requestData.product);

      // check already added
      var checkAlr ={};
      checkAlr = await Wishlist.findOne({
        where:{
          productId:product.id,
          userId:  requestData.userId
        }
      });

      if(!checkAlr){

        insertData = await Wishlist.create({
                        userId: requestData.userId,
                        productId: product.id,
                        product: requestData.product,
                        type: requestData.type
                      });

        if(insertData){

          return fun.returnResponse(res,true,200,"Added to wishlist",1);
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong",0);
        }

      } else {

        removeData = await Wishlist.destroy({
                        where:{
                          userId: requestData.userId,
                          productId: product.id
                        }
                      });

        if(removeData){

          return fun.returnResponse(res,true,200,"Removed from wishlist",0);
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong",0);
        }
      }
    } catch (error) {
      throw error;
    }
  },

  // get all wishlist
  getWishlist: async function (req, res) {
    try {

      let whereCond = { userId:  req.query.userId };

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

      // total records

      allData = await Wishlist.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await Wishlist.findAll({
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

  // delete all wishlist
  deleteWishlist: async function (req, res) {
    try {

      deleteWishlist = await Wishlist.destroy({
                        where:{
                          userId: req.query.userId
                        }
                      });

      if(deleteWishlist){
        return fun.returnResponse(res,true,200,"Wishlist Deleted");
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // delete all wishlist
  deleteSingleWishlist: async function (req, res) {
    try {

      deleteWishlist = await Wishlist.destroy({
                        where:{
                          productId: req.query.id
                        }
                      });

      if(deleteWishlist){
        return fun.returnResponse(res,true,200,"Item Removed");
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // RATING ---------------------
  
  // Add
  rating: async function (req, res) {
    try {
      req.check('name').notEmpty().withMessage('name cannot be empty');
      req.check('email').notEmpty().withMessage('email cannot be empty');
      req.check('review').notEmpty().withMessage('review cannot be empty');
      req.check('rating').notEmpty().withMessage('rating cannot be empty');
      req.check('productId').notEmpty().withMessage('productId cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check already added
      var checkAlr ={};
      checkAlr = await Rating.findOne({
        where:{
          email:requestData.email,
          productId:  requestData.productId
        }
      });

      if(!checkAlr){

        insertData = await Rating.create({
                        name: requestData.name,
                        productId: requestData.productId,
                        email: requestData.email,
                        review: requestData.review,
                        rating: requestData.rating
                      });

        if(insertData){

          return fun.returnResponse(res,true,200,"Rated Successfully",1);
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong",0);
        }

      } else {
        return  fun.returnResponse(res,false,400,"Already Rated");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all rating
  getAllRating: async function (req, res) {
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

      var productId = '';
      if(req.query.productId){
        whereCond.productId = req.query.productId;
      }

      const offset = (page-1) * Number(limit);

      // total records

      allData = await Rating.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await Rating.findAll({
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

  // get product rating
  getProductRating: async function (req, res) {
    try {

      var whereCond = {};
      if(req.query.productId){
        whereCond.productId = req.query.productId;
      }else{
        return fun.returnResponse(res,false,204,"Product Id missing.");
        return false;
      }

      var allDataP = {};
      allDataP = await Rating.findOne({
        attributes:[[sequelize.literal('(select ifnull(round(avg(rating),1),0) from articlerating where productId = "'+ req.query.productId +'")'),'avg_rating'],[sequelize.literal('(select count(id) from articlerating where productId = "'+ req.query.productId +'")'),'total_rating']],
        where : whereCond
      });

      return fun.returnResponse(res,true,200,"Success",allDataP);
    } catch (error) {
      throw error;
    }
  },

  // get product recommend
  getProductRecommend: async function (req, res) {
    try {

      var whereCond = {};
      if(req.query.productId){

        var quuer = req.query.productId.split("_");

        whereCond.articleNumber = quuer[1];
      }else{
        return fun.returnResponse(res,false,204,"Product Id missing.");
        return false;
      }

      var allDataP = {};
      allDataP = await TaArticleRecommends.findOne({
        where : whereCond
      });

      return fun.returnResponse(res,true,200,"Success",allDataP);
    } catch (error) {
      throw error;
    }
  },

  // ARTICLE QUESTION & ANSWERS ---------------------
  
  // Add
  askQuestion: async function (req, res) {
    try {
      req.check('product').notEmpty().withMessage('product cannot be empty');
      req.check('userId').notEmpty().withMessage('userId cannot be empty');
      req.check('question').notEmpty().withMessage('question cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;


      insertData = await ArticleQas.create({
                      userId: req.id,
                      product: requestData.product,
                      question: requestData.question,
                      productId: requestData.productId
                    });

      if(insertData){

        return fun.returnResponse(res,true,200,"Successfully Submitted ! Will get back soon with your answer.",1);
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong",0);
      }
    } catch (error) {
      throw error;
    }
  },

  // get all qas
  getAllQas: async function (req, res) {
    try {

      let whereCond = { answer :{  [Op.ne] : null  } };

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

}