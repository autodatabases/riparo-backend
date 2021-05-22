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
const RuntRegisteredVehicles =  db.runtregisteredvehicles;
 
/** Belongs **/

/*model_name.belongsTo(another_model, {
  foreignKey: 'id'
});*/

module.exports = {

/*
|--------------------------------------------------------------------------
| IMPORT RUNT DATABASE
|------------------------------------------------------------------------ */

  
  // import runt

  importRunt: async function (req, res) {
    try {

      var requestData = req.files;
      var file = req.files.file;
      let oldpath = await fun.uploadFile(file, 'uploads');

      readXlsxFile(fs.createReadStream(process.cwd()+'/server/public/'+oldpath)).then(async (rows) => {

        if(rows.length){

          for(var i=0; i < rows.length;i++){

            var checkVin ={};
            checkVin = await RuntRegisteredVehicles.findOne({
              where:{
                vin:rows[i][8],
              }
            });

            if(!checkVin){
              await RuntRegisteredVehicles.create({
                vehicleRegisteredId : rows[i][0],
                vehicleType : rows[i][1],
                vehicleBrand : rows[i][2],
                vehicleModel : rows[i][3],
                vehicleBodyWork : rows[i][4],
                vehicleRegisteredYear : rows[i][5],
                vehicleDisplacement : rows[i][6],
                vehicleFuelType : rows[i][7],
                vin : rows[i][8],
                vehicleChassisNumber : rows[i][9],
                vehicleSerialNumber : rows[i][10],
                vehiclePlateNumber : rows[i][10]
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

  // get all runt db

  allRuntDb: async function (req, res) {
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
                             vehiclePlateNumber:  req.query.search,
                            }
                         ]
                        }
      }

      // total records

      allData = await RuntRegisteredVehicles.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);


      var allDataP = {};
      allDataP = await RuntRegisteredVehicles.findAll({
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
}