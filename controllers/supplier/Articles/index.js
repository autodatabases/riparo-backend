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

SupplierArticles.hasMany(SupplierArticlesAttributes, {
   foreignKey: 'supplierArticlesid'
});

SupplierArticles.hasMany(SupplierArticlesFiles, {
  foreignKey: 'supplierArticlesid'
});

module.exports = {
  
  // Add
  addArticle: async function (req, res) {
    try {
      req.check('supplierId').notEmpty().withMessage('supplierId cannot be empty');
      req.check('carType').notEmpty().withMessage('carType cannot be empty');
      req.check('manuId').notEmpty().withMessage('brand cannot be empty');
      req.check('modelId').notEmpty().withMessage('Model Series cannot be empty');
      req.check('carId').notEmpty().withMessage('Engine cannot be empty');
      req.check('categoryId').notEmpty().withMessage('Category cannot be empty');
      req.check('subCategoryId').notEmpty().withMessage('SubCategory cannot be empty');
      req.check('articleName').notEmpty().withMessage('Article Name cannot be empty');
      req.check('description').notEmpty().withMessage('Description cannot be empty');
      req.check('articleMfr').notEmpty().withMessage('Article Manufacturer cannot be empty');
      req.check('quantityPerPackingUnit').notEmpty().withMessage('quantityPerPackingUnit cannot be empty');
      req.check('warranty').notEmpty().withMessage('Warranty cannot be empty');
      req.check('inStock').notEmpty().withMessage('In Stock cannot be empty');
      req.check('retailPrice').notEmpty().withMessage('Retail Price cannot be empty');
      req.check('articleAttributes').notEmpty().withMessage('Article Attributes cannot be empty');
      req.check('zoneNumber').notEmpty().withMessage('Zone Number cannot be empty');
      var error = req.validationErrors();

      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      var fileData = req.files;

      if(!fileData){
        return  fun.returnResponse(res,false,400,"Please select atleast one article image");
        return false;
      }

      // check already added
      var checkAlr ={};
      checkAlr = await SupplierArticles.findOne({
        where:{
          articleName:requestData.articleName,
          supplierId:  requestData.supplierId,
          manuId:  requestData.manuId,
          modelId:  requestData.modelId,
          carId:  requestData.carId,
          categoryId: requestData.categoryId,
          subCategoryId: requestData.subCategoryId,
          zoneNumber: requestData.zoneNumber
        }
      });

      if(!checkAlr){

        insertData = await SupplierArticles.create({
                        supplierId: requestData.supplierId,
                        carType: requestData.carType,
                        manuId: requestData.manuId,
                        modelId: requestData.modelId,
                        carId: requestData.carId,
                        categoryId: requestData.categoryId,
                        subCategoryid: requestData.subCategoryId,
                        subSubCategoryid: requestData.subSubCategoryid,
                        articleName: requestData.articleName,
                        articleDescription: requestData.description,
                        quantityPerPackingUnit: requestData.quantityPerPackingUnit,
                        warranty: requestData.warranty,
                        inStock: requestData.inStock,
                        weightKg: requestData.weightKg,
                        widthCm: requestData.widthCm,
                        lengthCm: requestData.lengthCm,
                        heightCm: requestData.heightCm,
                        inStockNumber: requestData.inStockNumber,
                        retailPrice: requestData.retailPrice,
                        commissionType: requestData.commissionType,
                        commissionValue: requestData.commissionValue,
                        articleMfr: requestData.articleMfr,
                        zoneNumber: requestData.zoneNumber
                      });

        if(insertData){

          // upload & save article media
          var mediaFiles = req.files.media;
          if(mediaFiles.length){
            for(var i=0; i < mediaFiles.length;i++){
              var file = mediaFiles[i];
              let mediaFile = await fun.uploadFile(file, 'supplier_article_files');
              await SupplierArticlesFiles.create({
                supplierArticlesid: insertData.id,
                file: mediaFile
              });
            }
          }

          // article attr.
          var articleAttributes = JSON.parse(requestData.articleAttributes);
          if(articleAttributes.length){
            for(var i=0; i < articleAttributes.length;i++){
              var name = articleAttributes[i].name;
              var value = articleAttributes[i].value;
              await SupplierArticlesAttributes.create({
                supplierArticlesid: insertData.id,
                name: name,
                value: value
              });
            }
          }

          return fun.returnResponse(res,true,200,"Added Successfully");
        }else{
          return fun.returnResponse(res,false,500,"Something went wrong");
        }

      } else {
        return fun.returnResponse(res,false,409,"Article is already added with same name");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // import articles

  importArticles: async function (req, res) {
    try {

      var requestData = req.files;
      var file = req.files.file;

      let oldpath = await fun.uploadFile(file, 'uploads');

      readXlsxFile(fs.createReadStream(process.cwd()+'/server/public/'+oldpath)).then(async (rows) => {

        rows = rows.slice(1);

        if(rows.length){

          for(var i=0; i < rows.length;i++){

            insertData = await SupplierArticles.create({
                supplierId: req.id,
                carType: rows[i][0],
                manuId: rows[i][1],
                modelId: rows[i][2],
                carId: rows[i][3],
                categoryId: rows[i][4],
                subCategoryid: rows[i][5],
                subSubCategoryid: rows[i][6],
                articleName: rows[i][7],
                articleDescription: rows[i][8],
                quantityPerPackingUnit: rows[i][9],
                warranty: rows[i][10],
                inStock: rows[i][11],
                inStockNumber: rows[i][12],
                retailPrice: rows[i][13],
                priceCurrency: rows[i][14],
                weightKg: rows[i][15],
                lengthCm: rows[i][16],
                widthCm: rows[i][17],
                heightCm: rows[i][18],
                articleMfr: rows[i][19],
                zoneNumber: rows[i][22],
                commissionType: 2,
                commissionValue: 2,
              });

            if(insertData){

              // article attr.
              var articleAttributes = JSON.parse(rows[i][20]);
              if(articleAttributes.length){
                for(var j=0; j < articleAttributes.length;j++){
                  var name = articleAttributes[j].name;
                  var value = articleAttributes[j].value;
                  await SupplierArticlesAttributes.create({
                    supplierArticlesid: insertData.id,
                    name: name,
                    value: value
                  });
                }
              }

              // upload & save article media
              var mediaFiles = rows[i][21].split(',');
              if(mediaFiles.length){
                for(var k=0; k < mediaFiles.length;k++){
                  var file = mediaFiles[k];
                  await SupplierArticlesFiles.create({
                    supplierArticlesid: insertData.id,
                    file: file,
                    isUrl : 1
                  });
                }
              }
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

  // Update
  updateArticle: async function (req, res) {
    try {
      req.check('enTitle').notEmpty().withMessage('English Title ');
      req.check('esTitle').notEmpty().withMessage('Spanish Title ');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // is valid
      var IsValid = {};
      IsValid = await Amenities.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,res.__('RESOURCE_NOT_FOUND'));

      var fileData = req.files;
      var icon = IsValid.icon;
      if(fileData){
        var file = req.files.icon;
        icon = await fun.uploadFile(file, 'amenities_icons');
      }

      var check ={};
      check = await AmenitGolfCourseies.findOne({
        where:{
          enTitle:requestData.enTitle,
          id :{
            [Op.ne] : req.params.id
          }
        }
      });

      if(!check){

        updateData =  await GolfCourse.update({ 
                                      enTitle: requestData.enTitle,
                                      esTitle:requestData.esTitle,
                                      icon:icon,
                                      updatedAt: await fun.getDate()
                                    },{
                                    where:{
                                      id : req.params.id
                                    }
                                });
        if(updateData){
          return fun.returnResponse(res,true,200,res.__('UPDATED',{ module: 'Amenity'}));
        }else{
          return fun.returnResponse(res,false,500,res.__('500'));
        }

      } else {
        return fun.returnResponse(res,false,409,res.__('ALREADY_ADDED',{ module: 'Amenity', column: 'title' }));
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // Get
  getArticle: async function (req, res) {
    try {

      // is valid
      var IsValid = {};
      IsValid = await SupplierArticles.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,res.__('RESOURCE_NOT_FOUND'));

      var result ={};
      result = await SupplierArticles.findOne({
        attributes:[`id`, `supplierId`, `carType`, `manuId`, `modelId`, `carId`, `categoryId`, `subCategoryid`, `subSubCategoryid`, `articleName`, `articleDescription`, `quantityPerPackingUnit`, `warranty`, `inStock`, `retailPrice`, `price_currency`, `salePrice`, `discountedPrice`, `weight_kg`, `length_cm`, `width_cm`, `height_cm`, `in_stock_number`, `commissionType`, `commissionValue`, `base_insurance_value`, `indirect_expense`, `direct_cost`, `tec_percent`, `expected_profit`, `local_taxes`, `discount`, `articleMfr`, `is_approved`, `zone_number`, `createdAt`, `updatedAt`, `status`,[sequelize.literal('(select manuName from ta_getmanufacturers where manuId = manuId limit 1)'),'manuName'],[sequelize.literal('(select modelname from ta_getmodelseries where modelId = modelId limit 1)'),'modelName'],[sequelize.literal('(select carName from ta_getvehicleidsbycriteria where carId = carId limit 1)'),'carName'],[sequelize.literal('(select shortCutName from ta_parts_category where shortCutId = categoryId limit 1)'),'categoryName'],[sequelize.literal('(select assemblyGroupName from ta_parts_category_sub where id = subCategoryid limit 1)'),'subCategoryName']],
        where:{
          id : req.params.id
        },
        include:[
          {
            model:SupplierArticlesAttributes,
            required:false
          },{
            model:SupplierArticlesFiles,
            required:false
          }
        ]
      });

      if(result){

        result = result.toJSON();

        var isWishlisted =  await Wishlist.findOne({
                              where: {
                                userId: req.query.userId,
                                productId: result.id
                              }
                            });

        if(isWishlisted){
          result.isWishlisted = 1;
        }else{
          result.isWishlisted = 0;
        }

        return fun.returnResponse(res,true,200,"Success",result);
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // Delete
  deleteArticle: async function (req, res) {
    try {

      // is valid
      var IsValid = {};
      IsValid = await SupplierArticles.findOne({
        where:{
          id:req.params.id,
        }
      });

      if (!IsValid) return fun.returnResponse(res,false,401,res.__('RESOURCE_NOT_FOUND'));

      var result ={};
      result = await SupplierArticles.destroy({
        where:{
          id : req.params.id
        }
      });

      result = await SupplierArticlesAttributes.destroy({
        where:{
          supplierArticlesid : req.params.id
        }
      });

      result = await SupplierArticlesFiles.destroy({
        where:{
          supplierArticlesid : req.params.id
        }
      });

      if(result){
          return fun.returnResponse(res,true,200,"Deleted Successfully");
      } else {
        return fun.returnResponse(res,false,500,"Something went wrong.");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // all
  allArticles: async function (req, res) {
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

      var condition = {};

      // manuId
      if(req.query.manuId){
        condition.manuId = req.query.manuId;
      }

      // modelId
      if(req.query.modelId){
        condition.modelId = req.query.modelId;
      }

      // carId
      if(req.query.carId){
        condition.carId = req.query.carId;
      }

      // categoryId
      if(req.query.categoryId){
        condition.categoryId = req.query.categoryId;
      }

      // subCategoryId
      if(req.query.subCategoryId){
        condition.subCategoryid = req.query.subCategoryId;
      }

      // isApproved
      if(req.query.isApproved){
        condition.isApproved = req.query.isApproved;
      }

      // userId
      if(req.query.userId){
        condition.supplierId = req.query.userId;
      }

      // search
      if(req.query.search){
        var search =  {
                    [Op.like]:'%'+ req.query.search +'%'
                  }
        condition.articleName = search;
      }

      // total records
      allRecords = await SupplierArticles.findAndCountAll({where:condition});
      const totalPages = Math.ceil(allRecords.count/limit);

      var allRecordsP = await SupplierArticles.findAll({
          attributes:[`id`, `supplierId`, `carType`, `manuId`, `modelId`, `carId`, `categoryId`, `subCategoryid`, `subSubCategoryid`, `articleName`, `articleDescription`, `quantityPerPackingUnit`, `warranty`, `inStock`, `retailPrice`, `price_currency`, `salePrice`, `discountedPrice`, `weight_kg`, `length_cm`, `width_cm`, `height_cm`, `in_stock_number`, `commissionType`, `commissionValue`, `base_insurance_value`, `indirect_expense`, `direct_cost`, `tec_percent`, `expected_profit`, `local_taxes`, `discount`, `articleMfr`, `is_approved`, `zone_number`, `createdAt`, `updatedAt`, `status`,[sequelize.literal('(select manuName from ta_getmanufacturers where manuId = manuId limit 1)'),'manuName'],[sequelize.literal('(select modelname from ta_getmodelseries where modelId = modelId limit 1)'),'modelName'],[sequelize.literal('(select carName from ta_getvehicleidsbycriteria where carId = carId limit 1)'),'carName'],[sequelize.literal('(select shortCutName from ta_parts_category where shortCutId = categoryId limit 1)'),'categoryName'],[sequelize.literal('(select assemblyGroupName from ta_parts_category_sub where id = subCategoryid limit 1)'),'subCategoryName']],
          limit,offset,
          where: condition,
          raw:true,
          nest:true,
          order: [
            ['id', 'DESC']
          ]
      });

      if(allRecords){

        //allRecordsP = allRecordsP.map(val => { return val.toJSON() });

        __final = [];
        for (var i in allRecordsP) {

          // attr
          var attributes = await SupplierArticlesAttributes.findAll({
            where: {
              supplierArticlesid: allRecordsP[i].id
            }
          });

          // files ( images )
          var files = await SupplierArticlesFiles.findAll({
            where: {
              supplierArticlesid: allRecordsP[i].id
            }
          });

          allRecordsP[i].attributes = attributes;
          allRecordsP[i].files = files;
        }

        const _metadata = { 'totalRecords' : allRecords.count , 'totalPages' : totalPages  }

        return fun.returnResponse(res,true,200,"Success",allRecordsP,_metadata);
      } else {
        return fun.returnResponse(res,false,204,"No Data");
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  // approveArticle
  approveArticle: async function (req, res) {
    try {
      req.check('baseInsuranceValue').notEmpty().withMessage('baseInsuranceValue');
      req.check('indirectExpense').notEmpty().withMessage('indirectExpense');
      req.check('directCost').notEmpty().withMessage('directCost');
      req.check('tecPercent').notEmpty().withMessage('tecPercent');
      req.check('expectedProfit').notEmpty().withMessage('expectedProfit');
      req.check('localTaxes').notEmpty().withMessage('localTaxes');
      req.check('discount').notEmpty().withMessage('discount');
      var error = req.validationErrors();
      if (error) {
        return  fun.returnResponse(res,false,400,fun.checkRequired(error).message);
        return false;
      }

      var requestData = req.body;

      // is valid
      var IsValid = {};
      IsValid = await SupplierArticles.findOne({
        where:{
          id:req.params.id,
        },
        raw: true
      });

      // sales price : (( Price of article + Base Insurance Value ( Price ) + Indirect Expenses Factor Local Company + % Direct Costs + % Tecalliance) * (1 + % Expected Profitability)) + Local Taxes

      var salePriceF = Number(( (Number(IsValid.retailPrice) + Number(requestData.baseInsuranceValue) + Number(requestData.indirectExpense) + Number(requestData.directCost/100) + Number(requestData.tecPercent/100)) * ( 1 + (requestData.expectedProfit/100) ) ) + (requestData.localTaxes/100));

      // Discounted Article Price: (((Factory Part Cost Value + Base Insurance Value + Indirect Expenses Factor Local Company +% Direct Costs +% Tecalliance) * (1 +% Expected Profitability)) * (1-% discount) + Local Taxes

      var discountedPriceF = Number( ( ( (Number(IsValid.retailPrice) + Number(requestData.baseInsuranceValue) + Number(requestData.indirectExpense) + Number(requestData.directCost/100) + Number(requestData.tecPercent/100)) * ( 1 + (requestData.expectedProfit/100) ) ) * Number(1-(requestData.discount/100)) ) + (requestData.localTaxes/100) );

      requestData.salePrice = salePriceF.toFixed(2);
      requestData.discountedPrice = discountedPriceF.toFixed(2);

      updateData =  await SupplierArticles.update(requestData,{
                                  where:{
                                    id : req.params.id
                                  }
                              });
      if(updateData){
        return fun.returnResponse(res,true,200,"Updated Successfully");
      }else{
        return fun.returnResponse(res,false,500,"Something went wrong");
      }
    } catch (error) {
      throw error;
    }
  },
}