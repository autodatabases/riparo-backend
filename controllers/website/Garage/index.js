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
const Garage = db.garage;

module.exports = {
  
  // Add
  addGarage: async function (req, res) {
    try {
      req.check('manuId').notEmpty().withMessage('manuId cannot be empty');
      req.check('modelId').notEmpty().withMessage('modelId cannot be empty');
      req.check('carId').notEmpty().withMessage('carId cannot be empty');
      req.check('soat').notEmpty().withMessage('soat cannot be empty');
      req.check('revision').notEmpty().withMessage('revision cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check already added
      var checkAlr ={};
      checkAlr = await Garage.findOne({
        where:{
          licensePlate:  requestData.licensePlate,
          manuId:  requestData.manuId,
          modelId:  requestData.modelId,
          carId:  requestData.carId,
          userId:  requestData.userId
        }
      });

      if(!checkAlr){

        insertData = await Garage.create({
                        userId: requestData.userId,
                        licensePlate:  requestData.licensePlate,
                        manuId:  requestData.manuId,
                        modelId:  requestData.modelId,
                        carId:  requestData.carId,
                        soat:  requestData.soat,
                        revision:  requestData.revision
                      });

        if(insertData){
          return fun.returnResponse(res,true,200,"Vehicle Added",1);
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong",0);
        }

      } else {
        return fun.returnResponse(res,false,400,"Same vehicle is already added",0);
      }
    } catch (error) {
      throw error;
    }
  },
  
  // Edit
  editGarage: async function (req, res) {
    try {
      req.check('id').notEmpty().withMessage('id cannot be empty');
      req.check('manuId').notEmpty().withMessage('manuId cannot be empty');
      req.check('modelId').notEmpty().withMessage('modelId cannot be empty');
      req.check('carId').notEmpty().withMessage('carId cannot be empty');
      req.check('soat').notEmpty().withMessage('soat cannot be empty');
      req.check('revision').notEmpty().withMessage('revision cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // check already added
      var checkAlr ={};
      checkAlr = await Garage.findOne({
        where:{
          licensePlate:  requestData.licensePlate,
          manuId:  requestData.manuId,
          modelId:  requestData.modelId,
          carId:  requestData.carId,
          userId:  requestData.userId,
          id :{
            [Op.ne] : requestData.id
          }
        }
      });

      if(!checkAlr){

        updateData = await Garage.update({
                                      userId: requestData.userId,
                                      licensePlate:  requestData.licensePlate,
                                      manuId:  requestData.manuId,
                                      modelId:  requestData.modelId,
                                      carId:  requestData.carId,
                                      soat:  requestData.soat,
                                      revision:  requestData.revision
                                    },{
                                    where:{
                                      id : requestData.id
                                    }});

        if(updateData){
          return fun.returnResponse(res,true,200,"Vehicle Updated",1);
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong",0);
        }

      } else {
        return fun.returnResponse(res,false,400,"Same vehicle is already added",0);
      }
    } catch (error) {
      throw error;
    }
  },

  // get
  getGarages: async function (req, res) {
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

      allData = await Garage.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await Garage.findAll({
          attributes:[`id`, `userId`, `licensePlate`, `manuId`, `modelId`, `carId`, `soat`, `revision`, `createdAt`, `updatedAt`, `status`,[sequelize.literal('(select manuName from ta_getmanufacturers where manuId = garage.manuId limit 1)'),'manuName'],[sequelize.literal('(select modelname from ta_getmodelseries where modelId = garage.modelId limit 1)'),'modelName'],[sequelize.literal('(select carName from ta_getvehicleidsbycriteria where carId = garage.carId limit 1)'),'carName']],
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

  // delete
  deleteGarage: async function (req, res) {
    try {

      deleteRow = await Garage.destroy({
                        where:{
                          id: req.query.id,
                        }
                      });

      if(deleteRow){
        return fun.returnResponse(res,true,200,"Deleted Successfully");
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get Garage

  getGarage: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await Garage.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,"Garage id with "+ req.params.id +" not found.");

      var checkRow ={};
      checkRow = await Garage.findOne({
        attributes:[`id`, `userId`, `licensePlate`, `manuId`, `modelId`, `carId`, `soat`, `revision`, `createdAt`, `updatedAt`, `status`,[sequelize.literal('(select manuName from ta_getmanufacturers where manuId = garage.manuId limit 1)'),'manuName'],[sequelize.literal('(select modelname from ta_getmodelseries where modelId = garage.modelId limit 1)'),'modelName'],[sequelize.literal('(select carName from ta_getvehicleidsbycriteria where carId = garage.carId limit 1)'),'carName']],
        where:{
          id : req.params.id
        }
      });

      if(checkRow){
          return fun.returnResponse(res,true,200,"Garage",checkRow);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
}