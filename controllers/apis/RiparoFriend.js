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

const RiparoFriends = db.riparoFriends;
 
/** Belongs **/

/*model_name.belongsTo(another_model, {
  foreignKey: 'id'
});*/

module.exports = {


/*
|--------------------------------------------------------------------------
| Riparo Friends
|------------------------------------------------------------------------ */

  
  // add

  addRf: async function (req, res) {
    try {
      req.check('rfCategory').notEmpty().withMessage('Please select category.');
      req.check('title').notEmpty().withMessage('Please enter title.');
      req.check('opening').notEmpty().withMessage('Please enter opening.');
      req.check('address').notEmpty().withMessage('Please enter address.');
      req.check('website').notEmpty().withMessage('Please enter website.');
      req.check('telephone').notEmpty().withMessage('Please enter telephone.');
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

      let featuredImage = await fun.uploadFile(file, 'rf_featured_images');

      // check already added
      var checkAlr ={};
      checkAlr = await RiparoFriends.findOne({
        where:{
          title:requestData.title,
        }
      });

      if(!checkAlr){

        insertData = await RiparoFriends.create({
                        riparoFriendCategory : requestData.rfCategory,
                        title: requestData.title,
                        opening:requestData.opening,
                        address: requestData.address,
                        website: requestData.website,
                        telephone: requestData.telephone,
                        featuredImage:featuredImage,
                        description:requestData.description,
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong.");
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

  updateRf: async function (req, res) {
    try {
      req.check('rfCategory').notEmpty().withMessage('Please select category.');
      req.check('title').notEmpty().withMessage('Please enter title.');
      req.check('opening').notEmpty().withMessage('Please enter opening.');
      req.check('address').notEmpty().withMessage('Please enter address.');
      req.check('website').notEmpty().withMessage('Please enter website.');
      req.check('telephone').notEmpty().withMessage('Please enter telephone.');
      req.check('description').notEmpty().withMessage('Please enter description.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // blog id valid
      var blogIsValid = {};
      blogIsValid = await RiparoFriends.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!blogIsValid) return fun.returnResponse(res,false,401,"Resource id with "+ req.params.id +" not found.");

      var fileData = req.files;
      var featuredImage = blogIsValid.featuredImage;
      if(fileData){
        var file = req.files.featuredImage;
        featuredImage = await fun.uploadFile(file, 'blog_featured_images');
      }

      var checkBlog ={};
      checkBlog = await RiparoFriends.findOne({
        where:{
          title:requestData.title,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!checkBlog){

        updateData =  await RiparoFriends.update({ 
                                      riparoFriendCategory : requestData.rfCategory,
                                      title: requestData.title,
                                      opening:requestData.opening,
                                      address: requestData.address,
                                      website: requestData.website,
                                      telephone: requestData.telephone,
                                      featuredImage:featuredImage,
                                      description:requestData.description
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,"Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Cannot be updated.");
        }

      } else {
        return fun.returnResponse(res,false,400,"Already added with same title.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get

  getRf: async function (req, res) {
    try {

      // blog id valid
      var blogIsValid = {};
      blogIsValid = await RiparoFriends.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!blogIsValid) return fun.returnResponse(res,false,401,"RF id with "+ req.params.id +" not found.");

      var blog ={};
      blog = await RiparoFriends.findOne({
        where:{
          id : req.params.id
        }
      });

      if(blog){
          return fun.returnResponse(res,true,200,"RF",blog);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all

  allRfs: async function (req, res) {
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
                            [Op.like]: '%' + req.query.search + '%'
                          }
                        },
                        { 
                          riparoFriendCategory: {
                            [Op.like]: '%' + req.query.search + '%'
                          }
                        }
                     ]
                  }
      }

      // total records

      allOptionsYM = await RiparoFriends.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptionsYM.count/limit);

      var allOptionsP = {};
      allOptionsP = await RiparoFriends.findAll({
        limit,offset,
        where : whereCond,
        order: [
          ['id', 'DESC']
        ]
      });

      if(allOptionsYM){

        const _metadata = { 'totalRecords' : allOptionsYM.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All RFs",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No RFs.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
}