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
const Orders = db.orders;
const User = db.users;

module.exports = {

  // get
  getOrders: async function (req, res) {
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

      // User orders
      if(req.query.userId){
        whereCond.userId =  req.query.userId
      }

      // Supplier orders
      if(req.query.supplierId){
        whereCond.supplierId =  req.query.supplierId
      }

      const offset = (page-1) * Number(limit);

      // total records

      allData = await Orders.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allData.count/limit);

      var allDataP = {};
      allDataP = await Orders.findAll({
          limit,offset,
          where: whereCond,
          raw:true,
          nest:true,
          group:['refPayco'],
          order: [
            ['id', 'DESC']
          ]
      });

      if(allDataP){

        for(var i=0; i < allDataP.length; i++){

          allDataP[i].userDetails =  await User.findOne({
                                      where:{
                                        id:allDataP[i].userId,
                                      },
                                      raw: true
                                    });

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

  // get order

  getOrderDetail: async function (req, res) {
    try {

      // id valid
      var IsValid = {};
      IsValid = await Orders.findOne({
        where:{
          refPayco:req.query.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,202,"Order id with "+ req.query.id +" not found.");

      var order ={};
      order = await Orders.findAll({
        where:{
          refPayco : req.query.id
        },
        raw: true
      });

      if(order){

        for(var i=0; i < order.length; i++){

          order[i].userDetails = await User.findOne({
                                      where:{
                                        id:order[i].userId,
                                      },
                                      raw: true
                                    });
        }

          return fun.returnResponse(res,true,200,"Order",order);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
}