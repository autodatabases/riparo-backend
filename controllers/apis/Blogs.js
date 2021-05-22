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

const Blog = db.blogNews;
 
/** Belongs **/

/*model_name.belongsTo(another_model, {
  foreignKey: 'id'
});*/

module.exports = {


/*
|--------------------------------------------------------------------------
| B L O G S
|------------------------------------------------------------------------ */

  
  // add blog

  addBlog: async function (req, res) {
    try {
      req.check('title').notEmpty().withMessage('Please enter title.');
      req.check('shortDescription').notEmpty().withMessage('Please enter short description.');
      req.check('date').notEmpty().withMessage('Please select the date.');
      req.check('description').notEmpty().withMessage('Please enter description.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var fileData = req.files;

      if(!fileData){
        return  fun.returnResponse(res,false,400,"Featured Image is required.");
        return false;
      }

      var file = req.files.featuredImage;

      let featuredImage = await fun.uploadFile(file, 'blog_featured_images');

      // check already added
      var checkAlr ={};
      checkAlr = await Blog.findOne({
        where:{
          title:requestData.title,
        }
      });

      if(!checkAlr){

        insertData = await Blog.create({
                        title: requestData.title,
                        shortDescription:requestData.shortDescription,
                        date: requestData.date,
                        featuredImage:featuredImage,
                        description:requestData.description,
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Blog Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong.");
        }

      } else {
        return fun.returnResponse(res,false,409,"Blog already added with same title.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // update blog

  updateBlog: async function (req, res) {
    try {

      req.check('title').notEmpty().withMessage('Please enter title.');
      req.check('shortDescription').notEmpty().withMessage('Please enter short description.');
      req.check('date').notEmpty().withMessage('Please select the date.');
      req.check('description').notEmpty().withMessage('Please enter description.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // blog id valid
      var blogIsValid = {};
      blogIsValid = await Blog.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!blogIsValid) return fun.returnResponse(res,false,401,"Blog id with "+ req.params.id +" not found.");

      var fileData = req.files;
      var featuredImage = blogIsValid.featuredImage;
      if(fileData){
        var file = req.files.featuredImage;
        featuredImage = await fun.uploadFile(file, 'blog_featured_images');
      }

      var checkBlog ={};
      checkBlog = await Blog.findOne({
        where:{
          title:requestData.title,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!checkBlog){

        updateData =  await Blog.update({ 
                                      title: requestData.title,
                                      shortDescription:requestData.short_description,
                                      date: requestData.date,
                                      featuredImage:featuredImage,
                                      description:requestData.description
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,"Blog Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Blog cannot be updated.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Blog already added with same title.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get blog

  getBlog: async function (req, res) {
    try {

      // blog id valid
      var blogIsValid = {};
      blogIsValid = await Blog.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!blogIsValid) return fun.returnResponse(res,false,401,"Blog id with "+ req.params.id +" not found.");

      var blog ={};
      blog = await Blog.findOne({
        where:{
          id : req.params.id
        }
      });

      if(blog){
          return fun.returnResponse(res,true,200,"Blog",blog);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all blogs

  allBlogs: async function (req, res) {
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

      // status
      var status = "";
      if(req.query.status){
        whereCond.status = req.query.status;
      }

      // total records

      allOptions = await Blog.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await Blog.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Blogs",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Blogs.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
}