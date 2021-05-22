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
const User = db.users;

module.exports = {
  
  /*
  |--------------------------------------------------------------------------
  |            S U P P I L E R S
  |------------------------------------------------------------------------ */

  // all suppliers

  allSuppliers: async function (req, res) {
    try {

      let whereCond = {};
      // Pagination
      var page = 1;
      if(req.query.page){
        page = req.query.page;
      }

      var limit = 10;
      if(req.query.limit){
        limit = Number(req.query.limit);
      }

      const offset = (page-1) * Number(limit);

      // search
      var search = "";
      if(req.query.search){
        whereCond.firstName = { [Op.like] : '' + req.query.search + '%' }
      }
      whereCond.userType = 'Supplier';

      // total records

      allOptions = await User.findAndCountAll({where:whereCond});
      const totalPages = Math.ceil(allOptions.count/limit);


      var allOptionsP = {};
      allOptionsP = await User.findAll({
        attributes:['id','firstName','lastName','email','accountStatus','userType',[sequelize.fn('date_format', sequelize.col('created_at'), '%Y-%m-%d'), 'createdAt']
      ],
        limit,offset,
        where : whereCond ,
        // Add order conditions here....
        order: [
            ['id', 'DESC']
        ]
      });

      if(allOptions){

        const _metadata = { 'totalRecords' : allOptions.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"All Customers",allOptionsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Membership Options.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // Add Supplier

  addSupplier: async function (req, res) {
    try {
      var requestData = req.body;

      var passwordO = requestData.password;

      // password
      requestData.password = crypto.createHash('sha1').update(requestData.password).digest('hex');

      requestData.userType = 'Supplier';

      var check_email = await User.findOne({
       where:{
         email:requestData.email
       },
       raw:true
     });

     if(check_email !=null){
      return fun.returnResponse(res,false,409,"Email is already linked with another account.");
      return false;
     }

     var create_data = await User.create(requestData);
      if(create_data){

        // sending email verification code

        var data =  {
                      firstName: requestData.firstName,
                      lastName:requestData.lastName,
                      to : requestData.email,
                      password: requestData.passwordO,
                      subject: "New Account Created"
                    };

        fun.sendEmail(req, res, data, 'newSupplierAccount.html');



        return fun.returnResponse(res,true,200,"Supplier Added Successfully");          
      }else{
        return fun.returnResponse(res,false,500,"Supplier cannot be inserted.");
      }

    
    } catch (error) {
      throw error;
    }
  },

  // Edit Supplier

  getSupplier: async function (req, res) {
    try {
      var optionIsValid = {};
      optionIsValid = await User.findOne({
        where:{
          id:req.query.id,
        }
      });

      if (!optionIsValid) return fun.returnResponse(res,false,401,"Supplier id with "+ req.query.id +" not found.");

      var resultData ={};
      resultData = await User.findOne({
        where:{
          id : req.query.id
        },
        raw:true
      });

      if(resultData){
          return fun.returnResponse(res,true,200,"Supplier",resultData);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },


  //  update supplier

  updateSupplier: async function (req, res) {
    try {
     var requestData = req.body;

     var check_email = await User.findOne({
       where:{
         email:requestData.email,
         id:{
           [Op.ne]:requestData.id
         }
       },
       raw:true
     });

     if(check_email !=null){
      return fun.returnResponse(res,false,409,"Email is already linked with another accout.");
      return false;
     }
     var id =requestData.id;
     delete requestData.id
     var create_data = await User.update(requestData,{
       where:{
         id:id
       }
     });
        if(create_data){
          return fun.returnResponse(res,true,200,"Supplier Updated Successfully");          
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong.");
        }

    
    } catch (error) {
      throw error;
    }
  },
}