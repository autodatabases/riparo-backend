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

const GlobalSettings = db.globalSettings;
const Timezones = db.timezones;

/** Belongs **/

/*model_name.belongsTo(another_model, {
  foreignKey: 'id'
});*/

module.exports = {


/*
|--------------------------------------------------------------------------
|             G L O B A L  S E T T I N G S
|------------------------------------------------------------------------ */

  // update global settings

  updateGlobalSettings: async function (req, res) {
    try {

      var requestData = req.body;

      console.log(requestData);

      var KeyArr = Object.keys(req.body);
      var ValueArr = Object.values(req.body);

      if(KeyArr.length){  

        for(var i=0; i < KeyArr.length;i++){

          // check already added
          var checkAlr ={};
          checkAlr = await GlobalSettings.findOne({
            where:{
              metaKey:KeyArr[i],
            }
          });

          if(!checkAlr){
            result = await GlobalSettings.create({
                        metaKey : KeyArr[i],
                        metaValue : ValueArr[i]
                      });

          }else{
            result =  await GlobalSettings.update({ 
                                      metaValue: ValueArr[i]
                                    },{
                                    where:{
                                      metaKey : KeyArr[i]
                                    }
                                });
          }
        }

        if(result){
          return fun.returnResponse(res,true,200,"Settings Updated Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong ! Please try again later.");
        }
      }
    } catch (error) {
      throw error;
    }
  },

  // get all global settings

  allGlobalSettings: async function (req, res) {
    try {

      let whereCond = {};


      var allResult = {};
      allResult = await GlobalSettings.findAll();

      if(allResult){

        const _metadata = {}

        return fun.returnResponse(res,true,200,"All Global Settings",allResult,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Global Settings.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // get all timezones

  allTimezones: async function (req, res) {
    try {

      let whereCond = {};


      var allResult = {};
      allResult = await Timezones.findAll();

      if(allResult){

        const _metadata = {}

        return fun.returnResponse(res,true,200,"All Timezones",allResult,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Timezones.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
}