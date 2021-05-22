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

// Tecalliance
const TaGetManufacturers =  db.taGetmanufacturers;
const TaGetAmBrands =  db.taGetambrands;
const TaGetModelSeries =  db.taGetmodelseries;
const TaGetVehicleIdsByCriteria =  db.taGetvehicleidsbycriteria;
const TaGetArticles =  db.taGetArticles;
const TaPartsCategory =  db.taPartsCategory;
const TaPartsCategorySub =  db.taPartsCategorySub;
const TaArticlePrices =  db.taArticlePrices;
 
/** Belongs **/

module.exports = {

/*
|--------------------------------------------------------------------------
| TECALLIANCE
|------------------------------------------------------------------------ */

  // tecallianceCategories

  tecallianceCategories: async function (req, res) {
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
                         shortCutName: {
                          [Op.like]: '' + req.query.search + '%'
                          },
                        },
                       { 
                         carType: {
                          [Op.like]: '' + req.query.search + '%'
                          }
                       }
                     ]
                  }
      }

      // type
      var type = "";
      if(req.query.type){
        whereCond = { carType: {
                          [Op.eq]: req.query.type
                          } }
      }

      // isFeatured
      var isFeatured = "";
      if(req.query.isFeatured){
        whereCond = { isFeatured: {
                          [Op.eq]: 1
                          } }
      }

      // total records

      allData = await TaPartsCategory.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await TaPartsCategory.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['shortCutName', 'ASC']
        ]
      });

      if(allData){

        if (allDataP) {

          allDataP = allDataP.map(value => { return value.toJSON() });

          for(var i in allDataP){

            allDataP[i].subCategories = await TaPartsCategorySub.findAll({
                                    where : { shortCutId: allDataP[i].shortCutId } ,
                                    // Add order conditions here....
                                    order: [
                                      ['id', 'ASC']
                                    ]
                                  });
          }
        }

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Data",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // featureCategory

  featureCategory: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await TaPartsCategory.findOne({
        where:{
          id:req.params.id,
        },
        raw: true
      });

      if (!IsValid) return fun.returnResponse(res,false,400,"Category id with "+ req.params.id +" not found.");

      if(IsValid.isFeatured === 1){

        updateData =  await TaPartsCategory.update({ 
                                    isFeatured: 0,
                                  },{
                                  where:{
                                    id : req.params.id
                                  }
                              });
        var message = "Category Unfeatured Successfully"
      }else{
        updateData =  await TaPartsCategory.update({ 
                                    isFeatured: 1,
                                  },{
                                  where:{
                                    id : req.params.id
                                  }
                              });
        var message = "Category Featured Successfully"
      }

      if(updateData){
        return fun.returnResponse(res,true,200,message);
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
      }
    } catch (error) {
      throw error;
    }
  },

  // get single category

  tecallianceCategory: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await TaPartsCategory.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,400,"Category id with "+ req.params.id +" not found.");

      var result ={};
      result = await TaPartsCategory.findOne({
        where:{
          id : req.params.id
        }
      });

      if(result){
          return fun.returnResponse(res,true,200,"Success",result);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get single sub category

  tecallianceSubCategory: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await TaPartsCategorySub.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,400,"Sub Category id with "+ req.params.id +" not found.");

      var result ={};
      result = await TaPartsCategorySub.findOne({
        where:{
          id : req.params.id
        }
      });

      if(result){
          return fun.returnResponse(res,true,200,"Success",result);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get single category by name

  tecallianceCategoryByName: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await TaPartsCategory.findOne({
        where:{
          shortCutId:req.query.name,
        }
      });

      var result ={};
      result = await TaPartsCategory.findOne({
        where:{
          shortCutId : req.query.name
        },
        raw: true
      });

      if(result){

        result.subCategories = await TaPartsCategorySub.findAll({
                                    where : { shortCutId: result.shortCutId } ,
                                    // Add order conditions here....
                                    order: [
                                      ['id', 'ASC']
                                    ]
                                  });

        return fun.returnResponse(res,true,200,"Success",result);
      } else {

        var result = {};
        result.subCategories = [];

        return fun.returnResponse(res,true,200,"Success",result);
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get single manu

  tecallianceManu: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await TaGetManufacturers.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,400,"Manu id with "+ req.params.id +" not found.");

      var result ={};
      result = await TaGetManufacturers.findOne({
        where:{
          id : req.params.id
        }
      });

      if(result){
          return fun.returnResponse(res,true,200,"Success",result);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get single manu

  tecallianceManuId: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await TaGetManufacturers.findOne({
        where:{
          manuId:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,400,"Manu id with "+ req.params.id +" not found.");

      var result ={};
      result = await TaGetManufacturers.findOne({
        where:{
          manuId : req.params.id
        }
      });

      if(result){
          return fun.returnResponse(res,true,200,"Success",result);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get single am brands

  tecallianceAmBrandsSingle: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await TaGetAmBrands.findOne({
        where:{
          brandId:req.query.id,
        },
        raw: true
      });

      return fun.returnResponse(res,true,200,"Success",IsValid);
    } catch (error) {
      throw error;
    }
  },

  // Edit Categories

  tecallianceEditCategory: async function (req, res) {
    try {

      var requestData = req.body;

      // id valid
      var bIsValid = {};
      bIsValid = await TaPartsCategory.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!bIsValid) return fun.returnResponse(res,false,400,"Resource id with "+ req.params.id +" not found.");

      var fileData = req.files;
      var image = bIsValid.image;
      if(fileData){
        var file = req.files.image;
        image = await fun.uploadFile(file, 'ta_categories');
      }

      updateData =  await TaPartsCategory.update({
                                    image:image,
                                    shortCutName:requestData.shortCutName,
                                    shortCutNameEs:requestData.shortCutNameEs
                                  },{
                                  where:{
                                    id : req.params.id
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

  // Edit Sub Categories

  tecallianceEditSubCategory: async function (req, res) {
    try {

      var requestData = req.body;

      // id valid
      var bIsValid = {};
      bIsValid = await TaPartsCategorySub.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!bIsValid) return fun.returnResponse(res,false,400,"Resource id with "+ req.params.id +" not found.");

      var fileData = req.files;
      var image = bIsValid.image;
      if(fileData){
        var file = req.files.image;
        image = await fun.uploadFile(file, 'ta_sub_categories');
      }

      updateData =  await TaPartsCategorySub.update({
                                    image:image,
                                    assemblyGroupName:requestData.assemblyGroupName,
                                    assemblyGroupNameEs:requestData.assemblyGroupNameEs
                                  },{
                                  where:{
                                    id : req.params.id
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

  // Edit Manu

  tecallianceEditManu: async function (req, res) {
    try {

      var requestData = req.body;

      // id valid
      var bIsValid = {};
      bIsValid = await TaGetManufacturers.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!bIsValid) return fun.returnResponse(res,false,400,"Resource id with "+ req.params.id +" not found.");

      var fileData = req.files;
      var image = bIsValid.image;
      if(fileData){
        var file = req.files.image;
        image = await fun.uploadFile(file, 'ta_manu_images');
      }

      updateData =  await TaGetManufacturers.update({
                                    image:image
                                  },{
                                  where:{
                                    id : req.params.id
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

  // tecallianceSubCategories

  tecallianceSubCategories: async function (req, res) {
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
        whereCond.assemblyGroupName = { [Op.like] : '' + req.query.search + '%' }
        search = " and (  b.carType LIKE '" + req.query.search + "%' OR a.assemblyGroupName LIKE '" + req.query.search + "%' OR b.shortCutName LIKE '" + req.query.search + "%') ";
      }

      // shortCutId
      var shortCutId = "";
      if(req.query.shortCutId){
        shortCutId = "and a.shortCutId = '" + req.query.shortCutId + "'";
      }

       // parentNodeId
      var parentNodeId = "";
      if(req.query.parentNodeId){
        parentNodeId = "and a.parentNodeId = '" + req.query.parentNodeId + "'";
      }

      // total records

      allData = await TaPartsCategorySub.sequelize.query(`SELECT a.*,b.shortCutName from ta_parts_category_sub as a , ta_parts_category as b where a.shortCutId = b.shortCutId `+ shortCutId +` ` + parentNodeId + ` `+ search +` order by assemblyGroupName asc`, {
        type: sequelize.QueryTypes.SELECT
      });
      const totalPages = Math.ceil(allData.length/limit);


      var allDataP = [];
      allDataP = await TaPartsCategorySub.sequelize.query(`SELECT a.*,b.shortCutName from ta_parts_category_sub as a , ta_parts_category as b where a.shortCutId = b.shortCutId `+ shortCutId +` ` + parentNodeId + ` `+ search +` order by assemblyGroupName asc LIMIT  `+ offset +` , `+ limit +` `, {
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

  // tecallianceAmBrands

  tecallianceAmBrands: async function (req, res) {
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
                         brandName: {
                          [Op.like]: '%' + req.query.search + '%'
                          }
                        }
                     ]
                  }
      }

      // total records

      allData = await TaGetAmBrands.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await TaGetAmBrands.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'ASC']
        ]
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Data",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // tecallianceManufacturers

  tecallianceManufacturers: async function (req, res) {
    try {

      let whereCond = { status : 'Active' };

      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 2;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      var linkingType = '';
      if(req.query.linkingType){
        whereCond.linkingType = req.query.linkingType;
      }

      const offset = (page-1) * Number(limit);

      // search
      var search = "";
      if(req.query.search){
        whereCond = {
                      [Op.or]: [ 
                        { 
                         manuName: req.query.search,
                        },
                        {
                         linkingType: {
                          [Op.like]: '' + req.query.search + '%'
                          }
                        }
                     ]
                  }
      }

      // total records

      allData = await TaGetManufacturers.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await TaGetManufacturers.findAll({
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'ASC']
        ]
      });

      if(allData){

        const _metadata = { 'totalRecords' : allData.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Data",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // tecallianceModelSeries

  tecallianceModelSeries: async function (req, res) {
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
        whereCond.modelname = { [Op.like] : '' + req.query.search + '%' }
        search = " and ( a.modelname LIKE '" + req.query.search + "%' OR b.manuName LIKE '" + req.query.search + "%' OR b.manuId LIKE '" + req.query.search + "%') ";
      }

      // brand
      var brand = "";
      if(req.query.brand){
        brand = "and a.manuId = '" + req.query.brand + "'";
      }

      // total records

      allData = await TaGetModelSeries.sequelize.query(`SELECT a.*,b.manuName from ta_getmodelseries as a , ta_getmanufacturers as b where a.manuId = b.manuId `+ brand +` `+ search +` GROUP BY a.modelId`, {
        type: sequelize.QueryTypes.SELECT
      });
      const totalPages = Math.ceil(allData.length/limit);

      var allDataP = [];
      allDataP = await TaGetModelSeries.sequelize.query(`SELECT a.*,b.manuName from ta_getmodelseries as a , ta_getmanufacturers as b where a.manuId = b.manuId `+ brand +` `+ search +` GROUP BY a.modelId LIMIT  `+ offset +` , `+ limit +` `, {
        type: sequelize.QueryTypes.SELECT
      });

      var resNewArr = await fun.arrayGroupBy(allDataP, 'model_start');

      //console.log(resNewArr);

      if(allData){

        const _metadata = { 'totalRecords' : allData.length , 'totalPages' : totalPages,'categorized' : resNewArr  }

        return fun.returnResponse(res,true,200,"All Data",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // tecallianceVehicleIdsByCriteria

  tecallianceVehicleIdsByCriteria: async function (req, res) {
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
        whereCond.modelname = { [Op.like] : '' + req.query.search + '%' }
        search = " and ( a.carName LIKE '" + req.query.search + "%' OR b.manuName LIKE '" + req.query.search + "%' OR c.modelname LIKE '" + req.query.search + "%') ";
      }

      // manuId
      var manuId = "";
      if(req.query.manuId){
        manuId = "and a.manuId = '" + req.query.manuId + "'";
      }

      // modId
      var modId = "";
      if(req.query.modId){
        modId = "and a.modId = '" + req.query.modId + "'";
      }

      // total records

      allData = await TaGetVehicleIdsByCriteria.sequelize.query(`SELECT a.id from ta_getvehicleidsbycriteria as a , ta_getmanufacturers as b , ta_getmodelseries as c where a.manuId = b.manuId and a.modId = c.modelId `+manuId+` `+ modId +` `+ search +``, {
        type: sequelize.QueryTypes.SELECT
      });

      const totalPages = Math.ceil(allData.length/limit);

      var allDataP = [];
      allDataP = await TaGetVehicleIdsByCriteria.sequelize.query(`SELECT a.*,b.manuName,c.modelname from ta_getvehicleidsbycriteria as a , ta_getmanufacturers as b , ta_getmodelseries as c where a.manuId = b.manuId and a.modId = c.modelId `+manuId+` `+ modId +` `+ search +` group by a.carName LIMIT  `+ offset +` , `+ limit +` `, {
        type: sequelize.QueryTypes.SELECT
      });

      var resNewArr = await fun.arrayGroupBy(allDataP, 'fuelType');

      if(allData){

        const _metadata = { 'totalRecords' : allData.length , 'totalPages' : totalPages,'categorized' : resNewArr  }

        return fun.returnResponse(res,true,200,"All Data",allDataP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // getLinkedVehicle

  getLinkedVehicle: async function (req, res) {
    try {

      var newItems = [];
      console.log(req.body.vehicleCompatibility);

      var items = req.body.vehicleCompatibility.split(',');

      for (var i = 0; i < ( (items.length > 7) ? 7 : items.length ); i++) {
        var idx = Math.floor(Math.random() * items.length);
        newItems.push(items[idx]);
        items.splice(idx, 1);
      }

      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 200;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      const offset = (page-1) * Number(limit);

      var whereCond = { carId : newItems };

      // total records

      allData = await TaGetVehicleIdsByCriteria.sequelize.query(`SELECT a.id from ta_getvehicleidsbycriteria as a , ta_getmanufacturers as b , ta_getmodelseries as c where a.manuId = b.manuId and a.modId = c.modelId and a.carId IN ( `+ newItems.join(',') +` )`, {
        type: sequelize.QueryTypes.SELECT
      });

      const totalPages = Math.ceil(allData.length/limit);

      var allDataP = [];
      allDataP = await TaGetVehicleIdsByCriteria.sequelize.query(`SELECT a.*,b.manuName,c.modelname,c.yearOfConstrFrom,c.yearOfConstrTo from ta_getvehicleidsbycriteria as a , ta_getmanufacturers as b , ta_getmodelseries as c where a.manuId = b.manuId and a.modId = c.modelId and a.carId IN ( `+ newItems.join(',') +` ) group by a.carId LIMIT  `+ offset +` , `+ limit +` `, {
        type: sequelize.QueryTypes.SELECT,
        mapToModel:true
      });

      var resNewArr = await fun.arrayGroupBy(allDataP, 'manuName');

      //console.log(resNewArr);

      return fun.returnResponse(res,true,200,"All Compared Vehicles",resNewArr,{});

      return false;
    } catch (error) {
      throw error;
    }
  },

  // tecallianceArticles

  tecallianceArticles: async function (req, res) {
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
        search = " and ( a.mfrName LIKE '" + req.query.search + "%' OR a.articleNumber LIKE '" + req.query.search + "%' OR b.carName LIKE '" + req.query.search + "%') ";
      }

      // carId
      var articleNumber = "";
      if(req.query.articleNumber){
        articleNumber = "and a.articleNumber = '" + req.query.articleNumber + "'";
      }

      // total records

      allData = await TaGetVehicleIdsByCriteria.sequelize.query(`SELECT a.mfrName,a.articleNumber,b.carName from ta_getArticles as a LEFT JOIN ta_getvehicleidsbycriteria as b ON a.carId = b.carId `+ articleNumber +` `+ search +``, {
        type: sequelize.QueryTypes.SELECT
      });

      const totalPages = Math.ceil(allData.length/limit);

      var allDataP = [];
      allDataP = await TaGetVehicleIdsByCriteria.sequelize.query(`SELECT a.*,b.carName,(select manuName from ta_getmanufacturers where manuId = (select manuId from ta_getvehicleidsbycriteria where carId = a.carId)) as manuName,(select modelname from ta_getmodelseries where modelId = (select modId from ta_getvehicleidsbycriteria where carId = a.carId)) as modelName from ta_getArticles as a , ta_getvehicleidsbycriteria as b where a.carId = b.carId `+ articleNumber +` `+ search +` LIMIT  `+ offset +` , `+ limit +` `, {
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

  // update

  editArticlePrice: async function (req, res) {
    try {
      req.check('rentalPrice').notEmpty().withMessage('Please enter rentalPrice.');
      req.check('salePrice').notEmpty().withMessage('Please enter salePrice.');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // option id valid
      var optionIsValid = {};
      optionIsValid = await TaArticlePrices.findOne({
        where:{
          articleNumber:req.params.id,
        }
      });

      if (optionIsValid){
        updateData =  await TaArticlePrices.update({ rentalPrice:requestData.rentalPrice, salePrice: requestData.salePrice },{
                              where:{
                                articleNumber : req.params.id
                              }
                            });
      }else{
        updateData =  await TaArticlePrices.create({ 
                                rentalPrice:requestData.rentalPrice,
                                salePrice: requestData.salePrice,
                                articleNumber : req.params.id
                            });
      }

      if(updateData){
        return fun.returnResponse(res,true,200,"Price Updated Successfully");
      }else{
        return fun.returnResponse(res,false,500,"Price cannot be updated.");
      }
    } catch (error) {
      throw error;
    }
  },

  // get

  getArticlePrice: async function (req, res) {
    try {

      // option id valid
      var optionIsValid = {};
      optionIsValid = await TaArticlePrices.findOne({
        where:{
          articleNumber:req.params.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,404,"articleNumber id with "+ req.params.id +" not found.");

      var membershipOption ={};
      membershipOption = await TaArticlePrices.findOne({
        where:{
          articleNumber : req.params.id
        }
      });

      if(membershipOption){
          return fun.returnResponse(res,true,200,"Success",membershipOption);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
}