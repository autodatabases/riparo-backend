const db = require('../models');
var dateFormat = require('dateformat');
const sequelize = require('sequelize');
const Op = sequelize.Op;
var moment = require('moment');
var crypto = require('crypto');
const fun = require('../function/api_fun.js');
//const base_url ="http://192.168.1.98:4900";
//const base_url ="http://202.164.42.227:4900";
const base_url = "http://64.225.27.71:4900"
//var expressValidator = require('express-validator');
const current_time = Math.floor(Date.now() / 1000);
const user = db.user;
const category = db.category;
const provider_category = db.providerCategory;
const provider = db.provider;
const favorite = db.favorite;
const order = db.order;
const order_image = db.orderImages;
const notification = db.notification;
const content = db.content;
const rating = db.rating;
const invoice = db.invoice;
const user_card = db.userCards;
const bid = db.bids;
const raise_invoice = db.raiseInvoiceProvider;
const cancel_with_reason = db.cancelAcceptOrder;
const checkin = db.checkinOrder;
const admin = db.admin;
const setting = db.setting;
const extra_work_images = db.extraWorkImages;
const archive_order = db.archiveOrder;
const delete_order = db.orderDelete
 
provider.hasMany(provider_category, {
});

provider_category.belongsTo(provider, {
  foreignKey: 'providerId'
});

provider_category.belongsTo(category, {
  foreignKey: 'categoryId'
});

checkin.belongsTo(provider, {
  foreignKey: 'providerId'
});

notification.belongsTo(user, {
  foreignKey: 'userId'
});
notification.belongsTo(provider, {
  foreignKey: 'userId'
});

notification.belongsTo(order, {
  foreignKey: 'orderId'
});

order.hasMany(order_image, {
});
order.hasMany(bid, {
});
rating.belongsTo(user, {
  foreignKey: 'userId'
});

rating.belongsTo(provider, {
  foreignKey: 'userId'
});

order.belongsTo(bid, {
  foreignKey: 'orderId'
});

order.belongsTo(category, {
  foreignKey: 'categoryId'
});
order.belongsTo(provider, {
  foreignKey: 'providerId'
});
invoice.belongsTo(order, {
  foreignKey: 'orderId'
});
// order.hasMany(invoice, {
 
// });
order.belongsTo(user, {
  foreignKey: 'userId'
});
raise_invoice.belongsTo(order, {
  foreignKey: 'orderId'
});
order.belongsTo(raise_invoice,{
  foreignKey: 'orderId'
})

raise_invoice.hasMany(extra_work_images,{
foreignKey:"invoiceIds"
})

checkin.belongsTo(order, {
  foreignKey: 'orderId'
});
module.exports = {
  Login: async function (req, res) {
    try {
      // ----------------- validation required parm ------------
      req.check('email').isEmail().withMessage('email field is required');
      req.check('password').notEmpty().withMessage('password field is required');
      req.check('deviceToken').notEmpty().withMessage('deviceToken field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      //console.log(req.headers.devicetoken); return;
      var requestdata = req.body;
      requestdata.device_token = req.headers.devicetoken;
      //console.log(requestdata); return;
      var get_data = await fun.LoginUser(res, requestdata);
      // console.log(get_data);return;
      if (get_data) {
        let msg = 'User Login Successfully';
        requestdata.id = get_data.id;
        await fun.UpdateDevice(requestdata);
        var send_data = await fun.GetUser(get_data.id);
        fun.true_status(res, send_data, msg);
      } else {
        let msg = 'Invalide Login Details';
        fun.false_status(res, msg)
      }

    } catch (error) {
      throw error;

    }
  },
  SignUp: async function (req, res) {
    try {
      req.check('name').notEmpty().withMessage('Name field is required');
      req.check('email').isEmail().withMessage('Email field is required');
      req.check('password').notEmpty().withMessage('Password field is required');
      req.check('deviceToken').notEmpty().withMessage('deviceToken field is required');
      // req.check('device_type').notEmpty().withMessage('device_type field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.device_token = req.headers.devicetoken;
      requestdata.date_created = fun.get_date();
      //console.log(requestdata);return false;
      var checkemail = await fun.CheckEmailExist(res, requestdata.email);
      if (checkemail == false) {
        return false;
      }
      var image = '';
      if (req.files && req.files.image) {
        image = await fun.single_image_upload(req.files.image, 'upload');
      }
      requestdata.image = image;
      // console.log(requestdata);return false;
      var insert_data = await fun.InsertUserData(requestdata);
      if (insert_data) {
        var send_data = await fun.GetUser(insert_data.id);
        let msg = "Signup Successfully"
        fun.true_status(res, send_data, msg);
      } else {
        let msg = 'User Not Register';
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }

  },

  ForgotPassword: async function (req, res) {
    req.check('email').isEmail().withMessage('email field is required');
    var error = req.validationErrors();
    if (error) {
      res.send(fun.required_data(error));
      return false;
    }
    var requestdata = req.body;

    var checkemail = await fun.GetEmailData(res, requestdata.email);
    // console.log(checkemail);return false;
    if (checkemail != false) {

      var otp = crypto.randomBytes(20).toString('hex');
      let mail = {
        from: "admin@pronto.com",
        to: requestdata.email,
        subject: "Pronto360 Forgot Password (" + new Date() + ")",
        html:
          'Click here for change password <a href="' + base_url + "/apis/url_idd/" + otp + '"> Click</a>'
      };
      var update = await user.update({
        otp: otp
      }, {
        where: {
          id: checkemail.id
        }
      }
      );
      let email = await fun.SendMail(mail);
      let msg = "Mail Send Successfully"
      fun.true_status(res, requestdata, msg);
    } else {
      let msg = 'This Email Not Exist';
      fun.false_status(res, msg);
    }

  },

  UrlIdd: async function (req, res) {
    const data = await user.findAll({
      where: {
        otp: req.params.id,
      }
    });
    if (data.length > 0) {
      res.render("reset_password", {
        title: "Pronto360",
        response: data[0].otp,
        flash: "",
        hash: req.params.id
      });
    } else {
      res.status(403).send("Link has been expired!");
    }

  },
  ResetPassword: async function (req, res) {
    const data = await user.findOne({
      where: {
        otp: req.body.hash,
      }
    });
    if (data) {
      const hashm = crypto.createHash('sha1').update(req.body.confirm_password).digest('hex');
      const save = await user.update({
        password: hashm,
      },
        {
          where: {
            otp: req.body.hash
          }
        }
      );
      if (save) {
        const up = await user.update({
          otp: '',
        },
          {
            where: {
              otp: req.body.hash
            }
          }
        );
        res.render("success_page", { msg: "Password Changed successfully" });
      } else {
        res.render("success_page", { msg: "Invalid user" });
      }
    } else {
      res.render("success_page", { msg: "Link has Expired" });
    }
  },

  Category: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var _category = await category.findAll({
        where: {
          status: 1
        }
      });
      if (_category) {
        _category = _category.map(value => { return value.toJSON() });
      }

      if (_category) {
        let msg = "Categories get successfully";
        fun.true_status(res, _category, msg);
      } else {
        let msg = "Categories get successfully";
        _category = [];
        fun.true_status(res, _category, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  SocialLogin: async function (req, res) {
    try {
      req.check('social_id').notEmpty().withMessage('social_id fields is required');
      req.check('social_type').notEmpty().withMessage('social_type fields is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.device_token = req.headers.devicetoken;
      var auth_key = crypto.randomBytes(10).toString('hex');
      requestdata.date_created = fun.get_date();
      var check_social_id_exist = await user.findOne({
        where: {
          socialId: requestdata.social_id,
          socialType: requestdata.social_type
        }
      });
      //  console.log(check_social_id_exist);return;
      if (check_social_id_exist) {
        check_social_id_exist = check_social_id_exist.toJSON();
        var update_data = await user.update({
          name: requestdata.name,
          email: requestdata.email,
          latitude: requestdata.latitude,
          longitude: requestdata.longitude,
          deviceToken: requestdata.device_token,
          socialId: requestdata.social_id,
          socialType: requestdata.social_type,
          deviceType: requestdata.device_type,
          authorization: auth_key

        }, {
          where: {
            id: check_social_id_exist.id
          }
        }
        );

        var data = await fun.GetUser(check_social_id_exist.id);
        let msg = "Login Successfully";
        let body = data;
        fun.true_status(res, body, msg);

      } else {
        var update_data = await user.create({
          name: requestdata.name,
          email: requestdata.email,
          latitude: requestdata.latitude,
          longitude: requestdata.longitude,
          deviceToken: requestdata.device_token,
          deviceType: requestdata.device_type,
          socialId: requestdata.social_id,
          socialType: requestdata.social_type,
          status: 1,
          authorization: auth_key
        });
        if (update_data) {
          update_data = update_data.toJSON();
          var data = await fun.GetUser(update_data.id);
          let msg = "Login Successfully";
          let body = data;
          fun.true_status(res, body, msg);
        } else {
          let msg = "Error";
          fun.false_status(res, msg);
        }
      }


    } catch (error) {
      throw error;
    }
  },

  GetAdviserList: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('category_id').notEmpty().withMessage('category_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }

      var category_name = await category.findOne({
        where: {
          id: requestdata.category_id
        }
      });
      if (category_name) {
        category_name = category_name.toJSON();
      }

      //  console.log(check_auth,'====================check_auth'); return false;

      var get_category_data = await provider_category.findAll({
        where: {
          categoryId: requestdata.category_id
        },
        include: [{
          model: provider,
          where: {
            isBlock: 0
          },
          required: false
        }]
      });
      //  console.log(get_category_data,'=============='); return;
      if (get_category_data) {
        get_category_data = get_category_data.map(value => { return value.toJSON() });
        //  console.log(get_category_data,'=============='); return;
        var provider_data = [];
        for (var i in get_category_data) {
          if (get_category_data[i].provider != null && get_category_data[i].provider != 'null' && get_category_data[i].provider != '') {
            // get_category_data[i].provider.isApprove ==1 && 
            if (get_category_data[i].provider.status == 1) {
              provider_data.push(get_category_data[i].provider);
            }
          }
        }
      }
      //   console.log(provider_data,"================provider");return;
      for (var j in provider_data) {
        var get_fav = await favorite.findOne({
          where: {
            userId: check_auth.id,
            providerId: provider_data[j].id
          }
        });

        if (get_fav) {
          provider_data[j].fav = 1;
        } else {
          provider_data[j].fav = 0;
        }

        if (category_name) {
          provider_data[j].category = category_name.name;
        } else {
          provider_data[j].category = '';
        }

        // console.log(get_category_data,'=================get_category_data');

        var get_rating_profile = await rating.findOne({
          attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'ratingAvg']],
          where: {
            user2Id: provider_data[j].id,
          },
          group: ['user2Id']
        });


        if (get_rating_profile) {
          get_rating_profile = get_rating_profile.toJSON();
        }
        //console.log(get_rating_profile,"=====================get_rating_profile");
        if (get_rating_profile && get_rating_profile.ratingAvg != '') {
          provider_data[j].avg_rating = get_rating_profile.ratingAvg;
        } else {
          provider_data[j].avg_rating = 0;
        }

        //  console.log(get_rating_profile,'====================get_rating_profile');

      }
      // console.log(provider_data,'==========================get_rating_profile'); return
      if (provider_data) {
        let msg = "Provider get successfully";
        fun.true_status(res, provider_data, msg);
      } else {
        let msg = "Provider get successfully";
        provider_data = [];
        fun.true_status(res, provider_data, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  ProviderDetail: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('provider_id').notEmpty().withMessage('provider_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var _provider = await provider.findOne({
        where: {
          id: requestdata.provider_id
        },
        include: [{
          model: provider_category,
          attributes: ['id', 'categoryId', 'providerId'],
          required: false,
          include: [{
            model: category,
            attributes: ['id', 'name'],
            required: false
          }]
        }]
      });
      if (_provider) {
        _provider = _provider.toJSON();
        //  get review =================================
        var reviews = await rating.findAll({
          include: [{
            model: user,
            attributes: ['id', 'image', 'name'],
            required: false
          }],
          where: {
            user2Id: requestdata.provider_id
          }
        });
        if (reviews) {
          reviews = reviews.map(value => {
            var _data = value.toJSON();
            var tm = new Date(_data.createdAt);
            var tim = Math.round(tm.getTime() / 1000);
            _data.createdAt = tim;
            return _data;
          });
        } else {
          reviews = [];
        }
        // console.log(reviews);
        //  get previous order =========================
        var get_order = await order.findAll({
          attributes: ['id', 'title', 'status', 'description', 'quote', 'categoryId', 'completeOrderTime'],
          include: [{
            model: order_image,
            required: false
          }, {
            model: provider,
            attributes: ['id', 'name', 'image', 'about', 'createdAt'],
            required: false
          }],
          where: {
            providerId: _provider.id,
            status: 4
          }
        });
        //  get current order =========================
        var get_order_current = await order.findAll({
          attributes: ['id', 'title', 'status', 'description', 'quote', 'categoryId', 'completeOrderTime'],
          include: [{
            model: order_image,
            required: false
          }, {
            model: provider,
            attributes: ['id', 'name', 'image', 'about', 'createdAt'],
            required: false
          }],
          where: {
            providerId: _provider.id,
            status: [3, 1],
          }
        });
        // console.log(get_order_current,'===============get order');return false;
        if (get_order) {
          get_order = get_order.map(val => {
            var data = val.toJSON();
            data.createdAt = data.completeOrderTime;
            delete data.completeOrderTime;
            var tm = new Date(data.provider.createdAt);
            var tim = Math.round(tm.getTime() / 1000);
            data.provider.createdAt = tim;
            data.provider.createdAt = data.provider.completeOrderTime;

            return data
          });
        }
        if (get_order_current) {
          get_order_current = get_order_current.map(val => {
            var data = val.toJSON();
            data.createdAt = data.completeOrderTime;
            delete data.completeOrderTime;
            var tm = new Date(data.provider.createdAt);
            var tim = Math.round(tm.getTime() / 1000);
            data.provider.createdAt = tim;
            return data
          });
        }

        _provider.reviews = reviews;
        _provider.complete_order = get_order;
        _provider.current_order = get_order_current;
        delete _provider.password;
      }
      //console.log(_provider); return false;

      if (_provider) {
        let msg = "Provider get successfully";
        fun.true_status(res, _provider, msg);
      } else {
        let msg = "Invalid Adviser ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  GetProfile: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      let msg = "Get successfully";
      _adviser = check_auth;
      fun.true_status(res, _adviser, msg);

    } catch (error) {
      throw error;
    }
  },

  NotificationList: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var update_notification = await notification.update({
        isRead: 1
      }, {
        where: {
          usertypeId: check_auth.id
        }
      }
      );
      var get_notification = await notification.findAll({
        where: {
          usertypeId: check_auth.id,
           notificationCode:{
            [Op.ne]:20
          }
        },
        include: [{
          model: provider,
          attributes: ['id', 'name', 'image', 'phone'],
          required: false
        }, {
          model: order,
          attributes: ['id', 'status', 'completeOrderTime'],
          required: false
        }],
        order: [['id', 'desc']]
      });

      if (get_notification) {
        get_notification = get_notification.map(value => {
          var av = value.toJSON();
          av.user_data = av.provider;
          delete av.provider;
          var tm = new Date(av.createdAt);
          var tim = Math.round(tm.getTime() / 1000);
          av.createdAt = tim;
          if (av.order == null || av.order == 'null' || av.order == '') {
            av.order = {}
          }
          return av;
        });

        for(var i in get_notification){
          if(get_notification[i].order.id !=undefined){
          var get_count =  await rating.count({
            where:{
              user2Id:check_auth.id,
              orderId:get_notification[i].order.id
            },
            raw:true
          });
           get_notification[i].is_rate = get_count;
          }else{
            get_notification[i].is_rate = 0
          }
        }
        let msg = "Get successfully";
        _adviser = get_notification;
        fun.true_status(res, _adviser, msg);
      } else {
        let msg = "Get successfully";
        _adviser = [];
        fun.true_status(res, _adviser, msg);
      }


    } catch (error) {
      throw error;
    }
  },

  EditProfile: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      var image = '';
      if (req.files && req.files.image) {
        image = await fun.single_image_upload(req.files.image, 'upload');
        requestdata.image = image;
      } else {
        requestdata.image = check_auth.image;
      }

      var update = await user.update({
        name: requestdata.name,
        about: requestdata.about,
        image: requestdata.image,
        email: requestdata.email,
        dob: requestdata.dob,
        phone: requestdata.phone,
        location: requestdata.location,
        latitude: requestdata.latitude,
        longitude: requestdata.longitude
      }, {
        where: {
          id: check_auth.id
        }
      }
      );
      if (update) {
        var send_data = await fun.GetUser(check_auth.id);
        let msg = "Profile Update Successfully";
        fun.true_status(res, send_data, msg);
      } else {
        let msg = "Profile Not Updated";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  NearMeProvider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('latitude').notEmpty().withMessage('latitude field is required');
      req.check('longitude').notEmpty().withMessage('longitude field is required');

      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false
      }

      var get_count = await notification.count({
        where: {
          usertypeId: check_auth.id,
          isRead: 0
        }
      });

      var get_setting_data = await setting.findOne({
        raw:true
      });

      var data = await provider.findAll({
        attributes: ['id', 'name', 'latitude', 'longitude', 'email', 'location', 'isApprove', 'isBlock', [sequelize.literal("6371 * acos(cos(radians(" + requestdata.latitude + ")) * cos(radians(latitude)) * cos(radians(" + requestdata.longitude + ") - radians(longitude)) + sin(radians(" + requestdata.latitude + ")) * sin(radians(latitude)))"), 'distance']],
        include: [{
          model: provider_category,
          attributes: ['id', 'categoryId', 'providerId', 'price'],
          required: false,
          include: [{
            model: category,
            attributes: ['id', 'name', 'image', 'description'],
            required: false
          }]
        }],
        where: {
          isBlock: 0
        },
        order: sequelize.col('distance'),
        having: { 'distance': { [sequelize.Op.lte]: get_setting_data.searchDistance } }

      });

      if (data) {
        data = data.map(value => { return value.toJSON() });
      }
      var final_array = {
        notification_count: get_count,
        data: data
      }
      if (final_array) {
        let msg = "Provider Get Successfully";
        var send_data = final_array;
        fun.true_status(res, send_data, msg);
      } else {
        let msg = "Provider Not Found";
        var send_data = final_array;
        fun.true_status(res, send_data, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  About: async function (req, res) {
    try {
      //   req.check('authorization').notEmpty().withMessage('authorization field is required');
      //   var error = req.validationErrors();
      //     if (error) {
      //         res.send(fun.required_data(error));
      //         return false;
      //     }
      //     var requestdata =req.headers;
      //     var check_auth = await fun.CheckAuthKey(requestdata.authorization,res);
      //     if(check_auth==false){
      //         return false
      //     }
      var get_data = await content.findOne({
        attributes: ['about'],
      });
      if (get_data) {
        var send_data = get_data.toJSON();
        let msg = "Get Successfully";
        fun.true_status(res, send_data, msg);
      } else {
        let msg = "Error";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },



  Terms: async function (req, res) {
    try {
      // req.check('authorization').notEmpty().withMessage('authorization field is required');
      //   var error = req.validationErrors();
      //     if (error) {
      //         res.send(fun.required_data(error));
      //         return false;
      //     }
      //     var requestdata =req.headers;
      //     var check_auth = await fun.CheckAuthKey(requestdata.authorization,res);
      //     if(check_auth==false){
      //         return false
      //     }
      var get_data = await content.findOne({
        attributes: ['term'],
      });
      if (get_data) {
        var send_data = get_data.toJSON();
        let msg = "Get Successfully";
        fun.true_status(res, send_data, msg);
      } else {
        let msg = "Error";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  Policy: async function (req, res) {
    try {
      //   req.check('authorization').notEmpty().withMessage('authorization field is required');
      //   var error = req.validationErrors();
      //     if (error) {
      //         res.send(fun.required_data(error));
      //         return false;
      //     }
      //     var requestdata =req.headers;
      //     var check_auth = await fun.CheckAuthKey(requestdata.authorization,res);
      //     if(check_auth==false){
      //         return false
      //     }
      var get_data = await content.findOne({
        attributes: ['privacy'],
      });
      if (get_data) {
        var send_data = get_data.toJSON();
        let msg = "Get Successfully";
        fun.true_status(res, send_data, msg);
      } else {
        let msg = "Error";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  Logout: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      //   req.check('type').notEmpty().withMessage('type field is required');
      //   0=user,1=provider
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false
      }
      var get_data = await user.update({
        authorization: '',
        deviceToken: ''
      }, {
        where: {
          id: check_auth.id
        }
      });
      if (get_data) {
        send_data = {};
        let msg = "Logout Successfully";
        fun.true_status(res, send_data, msg);
      } else {
        let msg = "Error";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },
  AdviserFav: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('provider_id').notEmpty().withMessage('provider_id field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      // 1=fav,0=unfav
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }

      var _adviser = await favorite.findOne({
        where: {
          userId: check_auth.id,
          providerId: requestdata.provider_id
        }
      });
      if (_adviser) {
        _adviser = _adviser.toJSON();
        if (requestdata.type == 0) {
          var delete_status = await favorite.destroy({
            where: {
              id: _adviser.id
            }
          });
        }
      } else {
        if (requestdata.type == 1) {
          var create_data = await favorite.create({
            userId: check_auth.id,
            providerId: requestdata.provider_id,
            status: requestdata.type

          });
        }
      }

      let msg = "True successfully";
      _adviser = {};
      fun.true_status(res, _adviser, msg);

    } catch (error) {
      throw error;
    }
  },

  ChangePassword: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('old_password').notEmpty().withMessage('old_password field is required');
      req.check('new_password').notEmpty().withMessage('new_password field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      const password = crypto.createHash('sha1').update(requestdata.old_password).digest('hex');
      var new_password = crypto.createHash('sha1').update(requestdata.new_password).digest('hex');
      if (check_auth.password == password) {
        var update = await user.update({
          password: new_password
        }, {
          where: {
            id: check_auth.id
          }
        }
        );
      } else {
        let msg = "Old Password is Wrong";
        fun.false_status(res, msg);
        return false;
      }
      let body = {};
      let msg1 = "Password Change Successfully";
      fun.true_status(res, body, msg1);

    } catch (error) {
      throw error;
    }

  },

  Rating: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('provider_id').notEmpty().withMessage('provider_id field is required');
      req.check('rating').notEmpty().withMessage('rating field is required');
      req.check('orderId').notEmpty().withMessage('orderId field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      //   type : 0=user,1=provider
      //   req.check('comment').notEmpty().withMessage('comment field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      if (requestdata.type == 0) {
        var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      } else {
        var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      }
      if (check_auth == false) {
        return false
      }
      requestdata.user2Id = requestdata.provider_id;
      requestdata.userId = check_auth.id;
      // requestdata.requestId =requestdata.request_id;
      var update = await rating.create(requestdata);
      var data = {};
      if (requestdata.type == 0) {
        data.type = 1;
        var get_provider_data = await provider.findOne({
          attributes: ['id', 'name', 'deviceToken'],
          where:
          {
            id: requestdata.provider_id
          }
        });
      } else {
        data.type = 0;
        var get_provider_data = await user.findOne({
          attributes: ['id', 'name', 'deviceToken'],
          where:
          {
            id: requestdata.provider_id
          }
        });
      }
      if (get_provider_data) {
        get_provider_data = get_provider_data.toJSON();
      }
      // console.log(get_provider_data,"====================");return
      if (update) {
        //  send push  -------------------------------------------
        var body = {
          name: check_auth.name,
          id: check_auth.id,
          body: check_auth
        }

        data.token = get_provider_data.deviceToken;
        data.title = check_auth.name + " rating your work";
        data.code = 9;
        data.body = body;
        var send_push = await fun.PushNotification(data);
        var my_array = {
          userId: check_auth.id,
          usertypeId: get_provider_data.id,
          userType: 1,
          notificationCode: data.code,
          orderId: requestdata.orderId,
          message: data.title
        }
        var create_notification = await notification.create(my_array);
        let msg = "Rating Send Successfully";
        var send_data = {};
        fun.true_status(res, send_data, msg);
      } else {
        let msg = "Rating Not Updated";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },



  GetFavList: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var get_fav_data = await favorite.findAll({
        attributes: ['id', 'userId', 'providerId', 'createdAt'],
        where: {
          userId: check_auth.id
        }
      });
      if (get_fav_data) {
        get_fav_data = get_fav_data.map(val => { return val.toJSON() });
      }
      // console.log(get_fav_data);
      __final = [];
      for (var i in get_fav_data) {
        var provider_data = await provider.findOne({
          where: {
            id: get_fav_data[i].providerId,
            isBlock: 0
          },
          include: [{
            model: provider_category,
            attributes: ['id', 'categoryId', 'providerId'],
            required: false,
            include: [{
              model: category,
              attributes: ['id', 'name'],
              required: false
            }]
          }]
        });

        if (provider_data) {
          provider_data = provider_data.toJSON();
          var tm = new Date(provider_data.createdAt);
          var tim = Math.round(tm.getTime() / 1000);

          var tm1 = new Date(get_fav_data[i].createdAt);
          var tim1 = Math.round(tm1.getTime() / 1000);
          provider_data.fav_created = tim1
        }
        __final.push(provider_data);
      }
      if (__final) {
        let msg = "Favorit get successfully";
        fun.true_status(res, __final, msg);
      } else {
        let msg = "Invalid favorit ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  CreateWorkOrder: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('title').notEmpty().withMessage('title field is required');
      req.check('category_id').notEmpty().withMessage('category_id field is required');
      req.check('description').notEmpty().withMessage('description field is required');
      req.check('schedule').notEmpty().withMessage('schedule field is required');
      //schedule : 0=request_now,1=specific date,2= flexibal
      req.check('quote').notEmpty().withMessage('quote field is required');
      //quote: 	(send total person) 0= 3,1= unlimted,2=only selected provider
      req.check('location').notEmpty().withMessage('location field is required');
      req.check('latitude').notEmpty().withMessage('latitude field is required');
      req.check('longitude').notEmpty().withMessage('longitude field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      requestdata.categoryId = requestdata.category_id;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      // console.log(req.files,"=======================req.files.thumb");return;
      if (check_auth == false) {
        return false;
      }
      requestdata.userId = check_auth.id;
      requestdata.username = check_auth.name;
      if (requestdata.hasOwnProperty("providerId")) {
        requestdata.providerId = requestdata.providerId;
      } else {
        requestdata.providerId = 0;
      }
      //console.log(requestdata,"=======================requestdata");
      var timestamp = moment().format('x') / 1000;
      requestdata.created = timestamp;
      var types = requestdata.type.split(",");
      //   types.forEach(function(v,k){
      //       console.log(k,"=============k");
      //       console.log(v,"=============v");
      //   });

      //   return false;
      var create_order = await order.create(requestdata);
      if (create_order) {
        create_order = create_order.toJSON();
        // console.log(create_order,"====================create_order");
        requestdata.order_id = create_order.id;

        var send_push_notification = await fun.create_push_data(requestdata);
        //  console.log(send_push_notification,"===============send_push_notification");
        //  image upload -------------
        let media = [];
        var type = requestdata.type.split(",");
        let video_thumbnail = [];
        let _media = [];
        //    console.log(requestdata,"===================requestdata");
        //    console.log(req.files,"==================req.files.thumb");
        if (req.files != null && req.files.thumb) {
          if (Array.isArray(req.files.thumb)) {
            var thumb = req.files.thumb;
            for (let i in thumb) {
              let thumbs = await fun.single_image_upload(thumb[i], 'upload');
              video_thumbnail.push(thumbs);
            }
          } else {
            let thumbs = await fun.single_image_upload(req.files.thumb, 'upload');

            video_thumbnail = [thumbs];
          }
        }


        //   add image -----------

        if (req.files != null && req.files.images) {
          if (Array.isArray(req.files.images)) {
            var image = req.files.images;
            for (let i in image) {
              let imagess = await fun.single_image_upload(image[i], 'upload');
              media.push(imagess);
            }

            let video_thumbnail_index = 0;

            media.forEach((item, index) => {
              let obj = {
                // index,
                orderId: requestdata.order_id,
                type: type[index] ? type[index] : '0',
                image: media[index],
              }
              if (type[index] == 1) {
                obj['thumb'] = video_thumbnail[video_thumbnail_index] ? video_thumbnail[video_thumbnail_index] : '';
                video_thumbnail_index++;
              } else {
                obj['thumb'] = '';
              }
              _media.push(obj);
            });

          } else {
            let image = await fun.single_image_upload(req.files.images, 'upload');
            // let file = await helpers.fileUpload(requestData.media, 'posts');

            _media = [{
              //  index: 0,
              type: type[0],
              orderId: requestdata.order_id,
              image: image,
              thumb: video_thumbnail.length > 0 ? video_thumbnail[0] : ''
            }];

          }
        }
        var insert_images = await order_image.bulkCreate(_media);
        //  console.log(_media,"========================_media");

      } else {
        let msg = "Some error";
        fun.false_status(res, msg);
      }
      if (create_order) {
        var __final = {};
        let msg = "Order Created Successfully";
        fun.true_status(res, __final, msg);
      } else {
        let msg = "Some error";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  ScheduleOrder: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('month').notEmpty().withMessage('month field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      //  var get_month =moment.unix(endOfMonth).format("MM");
      var month = requestdata.month * 1000;
      var startOfMonth = moment(month).startOf('month').format('x') / 1000;
      var endOfMonth = moment(month).endOf('month').format('x') / 1000;
      var get_order_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'date', 'completeOrderTime'],
        where: {
          userId: check_auth.id,
          schedule: 1,
          date: {
            [Op.between]: [startOfMonth, endOfMonth]
          },
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'price', 'image', 'phone'],
          required: false
        }]
      });
      if (get_order_data) {
        get_order_data = get_order_data.map(val => {
          var data = val.toJSON();
          // console.log(data);
          var mg = {};
          if (data.provider == '' || data.provider == null || data.provider == 'null') {
            data.provider = mg
          }
          return data;
        });
      }

      if (get_order_data) {
        let msg = "Order get successfully";
        fun.true_status(res, get_order_data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

   ScheduleOrderProvider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('month').notEmpty().withMessage('month field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      //  var get_month =moment.unix(endOfMonth).format("MM");
      var month = requestdata.month * 1000;
      var startOfMonth = moment(month).startOf('month').format('x') / 1000;
      var endOfMonth = moment(month).endOf('month').format('x') / 1000;
      var get_order_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'date', 'completeOrderTime'],
        where: {
          providerId: check_auth.id,
          schedule: 1,
          date: {
            [Op.between]: [startOfMonth, endOfMonth]
          },
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: user,
           attributes: ['id', 'name', 'image', 'phone', 'location'],
          required: false
        }]
      });
      if (get_order_data) {
        get_order_data = get_order_data.map(val => {
          var data = val.toJSON();
          // console.log(data);
          var mg = {};
          if (data.provider == '' || data.provider == null || data.provider == 'null') {
            data.provider = mg
          }
          return data;
        });
      }

      if (get_order_data) {
        let msg = "Order get successfully";
        fun.true_status(res, get_order_data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },



  GetOrderDetils: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('order_id').notEmpty().withMessage('order_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      // requestdata.authorization =req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var get_order_data = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'created', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status'],
        where: {
          id: requestdata.order_id,
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'price', 'image', 'phone', 'location'],
          required: false
        }, {
          model: user,
          attributes: ['id', 'name', 'image', 'phone', 'location'],
          required: false
        }
        //  {
        //   model: invoice,
        //   required: false
        // }
      ]
      });
      if (get_order_data) {
        //  console.log()
        var data = get_order_data.toJSON()
        var get_invoice = await invoice.findAll({
          attributes: ['id', 'amount', 'adminFees','createdAt', 'providerId', 'userId', 'type', 'cardId','isOrderType'],
          where: {
            orderId: requestdata.order_id,
          },
          raw: true
        });
        var mg = {};
        if (data.provider == '' || data.provider == null || data.provider == 'null') {
          data.provider = mg
        }
        if (data.user == '' || data.user == null || data.user == 'null') {
          data.user = mg
        }
        data.createdAt = await fun.ConvertTime(data.createdAt);

        if(get_invoice){
          for(var i in get_invoice){
             get_invoice[i].createdAt = await fun.ConvertTime(get_invoice[i].createdAt);
          }
        }

        data.invoice = get_invoice;

      }

      // console.log(data,"=======================data")
      if (data) {
        let msg = "Order get successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  AcceptReject: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('order_id').notEmpty().withMessage('order_id field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      // console.log(requestdata,"=========");
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }


      var get_order_data = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'completeOrderTime'],
        where: {
          id: requestdata.order_id,
        }
      });

      var get_bid_data = await bid.findOne({
        where: {
          id: requestdata.bid_id
        },
        raw: true
      });
      //  console.log(get_bid_data,'===============get_bid_data')
      if (get_order_data) {
        var update_data = await order.update({
          status: requestdata.type,
          providerId: get_bid_data.providerId
        }, {
          where: {
            id: requestdata.order_id
          }
        }
        );

        var get_provider = await provider.findOne({
          where: {
            id: get_bid_data.providerId
          },
          raw: true
        });

        var update_bid = await bid.update(
          {
            status: requestdata.type
          }, {
          where: {
            id: requestdata.bid_id
          }
        }
        );
      } else {
        let msg = "Invalid Order Id";
        fun.false_status(res, msg);
      }
      // ----------------send push-------------------

      var _push_data = {};
      var body = {
        id: requestdata.bid_id,
        body: get_provider,
        order: get_order_data
      }
      _push_data.type = 1;
      _push_data.model = provider
      _push_data.token = get_provider.deviceToken;
      if (requestdata.type == 1) {
        _push_data.title = check_auth.name + " accept  your Bid ";
        _push_data.code = 13;
      } else {
        _push_data.title = check_auth.name + " Reject  your Bid ";
        _push_data.code = 14;
      }
      // _push_data.code =13;
      _push_data.body = body;
      var send_push = await fun.PushNotification(_push_data);

      var my_array = {
        userId: check_auth.id,
        usertypeId: get_provider.id,
        userType: 1,
        notificationCode: _push_data.code,
        orderId: requestdata.order_id,
        message: _push_data.title
      }
      var create_notification = await notification.create(my_array);
      if (get_order_data) {
        var data = {};
        let msg = "Order Status Change successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  AddCard: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('name').notEmpty().withMessage('name field is required');
      req.check('cardNumber').notEmpty().withMessage('cardNumber field is required');
      req.check('expYear').notEmpty().withMessage('expYear field is required');
      req.check('expMonth').notEmpty().withMessage('expMonth field is required');

      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      requestdata.userId = check_auth.id;
      var check_card = await user_card.findOne({
        where: {
          cardNumber: requestdata.cardNumber
        }
      });
      if (check_card) {
        let msg = "Card Number already Exist ";
        fun.false_status(res, msg);
      }
      var create_card = await user_card.create(requestdata);
      if (create_card) {
        var data = {};
        let msg = "Card  add successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Invalid details ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  GetCard: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      requestdata.userId = check_auth.id;
      var check_card = await user_card.findAll({
        where: {
          userId: check_auth.id
        }
      });
      if (check_card) {
        check_card = check_card.map(val => { return val.toJSON() });
      }
      if (check_card) {
        var data = check_card;
        let msg = "Card Get successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Invalid details ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  GetWorkOrder: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var get_order_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'completeOrderTime'],
        where: {
          userId: check_auth.id,
          // schedule:[0,2]
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'price', 'image', 'phone'],
          required: false
        }],
        order: [
          ['id', 'desc']
        ]
      });
      if (get_order_data) {
        get_order_data = get_order_data.map(val => {
          var data = val.toJSON();
          // console.log(data);
          var mg = {};
          if (data.provider == '' || data.provider == null || data.provider == 'null') {
            data.provider = mg
          }
          return data;
        });
      }

      if (get_order_data) {
        let msg = "Order get successfully";
        fun.true_status(res, get_order_data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  GetSingleOrderDetils: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('order_id').notEmpty().withMessage('order_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      // requestdata.authorization =req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var get_order_data = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'createdAt','isEdit', 'title', 'category_id', 'description','isEdit', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'date'],
        where: {
          id: requestdata.order_id,
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'price', 'image'],
          required: false
        }, 
        // {
        //   model: invoice,
        //   attributes: ['id', 'amount', 'adminFees', 'providerId', 'userId', 'type', 'cardId'],
        //   required: false
        // },
         {
          model: bid,
          required: false
        }]
      });
      if (get_order_data) {
        var data = get_order_data.toJSON();

        var get_extra = await raise_invoice.findOne({
          where: {
            orderId: data.id
          },
          raw: true
        });

        var get_invoice = await invoice.findAll({
          where: {
            orderId: data.id
          },
          raw: true
        });
        if (get_extra == '' || get_extra == null || get_extra == 'null') {
          data.extra_work = {};
        } else {
          data.extra_work = get_extra;
        }
        data.invoice = get_invoice;
        var tm = new Date(data.createdAt);
        var tim = Math.round(tm.getTime() / 1000);
        data.createdAt = tim;
        var mg = {};
        if (data.provider == '' || data.provider == null || data.provider == 'null') {
          data.provider = mg
        }
        if (data.invoice == '' || data.invoice == null || data.invoice == 'null') {
          data.invoice = []
        }
      }

      if (data.bids) {
        for (var i in data.bids) {
          var tm = new Date(data.bids[i].createdAt);
          var tim = Math.round(tm.getTime() / 1000);
          data.bids[i].createdAt = tim;
          delete data.bids[i].updatedAt;
          var get_rating_profile = await rating.findOne({
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'ratingAvg']],
            where: {
              user2Id: data.bids[i].providerId,
            },
            group: ['user2Id']
          });
          if (get_rating_profile) {
            get_rating_profile = get_rating_profile.toJSON();
          }
          if (get_rating_profile && get_rating_profile.ratingAvg != '') {
            data.bids[i].avg_rating = get_rating_profile.ratingAvg;
          } else {
            data.bids[i].avg_rating = 0;
          }


          var user_data = await provider.findOne({
            attributes: ['id', 'name', 'image'],
            where: {
              id: data.bids[i].providerId
            }
          });

          if (user_data) {
            user_data = user_data.toJSON();
          }
          data.bids[i].username = user_data.name;
          data.bids[i].image = user_data.image;
        }
      }
      if (data) {
        let msg = "Order get successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  BidDetails: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('bid_id').notEmpty().withMessage('bid_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      // requestdata.authorization =req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }

      var find_bid_data = await bid.findOne({
        where: {
          id: requestdata.bid_id
        }
      });
      if (find_bid_data) {
        find_bid_data = find_bid_data.toJSON();
      } else {
        let msg = "Invalid Bid Id ";
        fun.false_status(res, msg);
      }
      var get_order_data = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'createdAt','isEdit', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'date'],
        where: {
          id: find_bid_data.orderId,
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
         }, 
        //{
        //   model: invoice,
        //   attributes: ['id', 'amount', 'adminFees', 'providerId', 'userId', 'type', 'cardId'],
        //   required: false
        // },
        {
          model: provider,
          attributes: ['id', 'name', 'image'],
          required: false
        }]
      });
      var settings = await setting.findOne();
      settings = settings.toJSON();
      //console.log(settings,"===============settings");
      var admin_fees = settings.comission;
      if (get_order_data) {
        var data = get_order_data.toJSON();

        var get_extra = await raise_invoice.findOne({
          where: {
            orderId: data.id,
            price:{
              [Op.ne]:''
            }
          },
          raw: true
        });

        var get_invoice = await invoice.findAll({
          attributes: ['id', 'amount', 'adminFees', 'providerId', 'userId', 'type', 'cardId','isOrderType'],
          where: {
            orderId: data.id,
          },
          raw: true
        });
        if (get_extra == '' || get_extra == null || get_extra == 'null') {
          data.extra_work = {};
        } else {
          data.extra_work = get_extra;
        }

        if (get_invoice == '' || get_invoice == null || get_invoice == 'null') {
          data.invoice = [];
        } else {
          data.invoice = get_invoice;
        }
        //data.extra_work = get_extra;
        data.adminFees = admin_fees;
        var tm = new Date(data.createdAt);
        var tim = Math.round(tm.getTime() / 1000);
        data.createdAt = tim;
        var mg = {};
        if (data.provider == '' || data.provider == null || data.provider == 'null') {
          data.provider = mg
        }
        if (data.invoice == '' || data.invoice == null || data.invoice == 'null') {
          data.invoice = []
        }
      } else {
        data = {};
      }

      if (data) {
        let msg = "Order get successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  CanelAcceptedOrder: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('orderId').notEmpty().withMessage('orderId field is required');
      req.check('reason').notEmpty().withMessage('reason field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      requestdata.userId = check_auth.id;
      var cancel_order = await order.update(
        {
          status: 2
        }, {
        where: {
          id: requestdata.orderId
        }
      }
      );
      if (cancel_order) {
        var create_order = await cancel_with_reason.create(requestdata);
      }
      if (cancel_order) {
        var data = {}
        let msg = "Order Update successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  ProviderLogin: async function (req, res) {
    try {
      // ----------------- validation required parm ------------
      req.check('email').isEmail().withMessage('email field is required');
      req.check('password').notEmpty().withMessage('password field is required');
      req.check('deviceToken').notEmpty().withMessage('deviceToken field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      //console.log(req.headers.devicetoken); return;
      var requestdata = req.body;
      requestdata.device_token = req.headers.devicetoken;
      //console.log(requestdata); return;
      var get_data = await fun.LoginProvider(res, requestdata);
      // console.log(get_data);return;
      if (get_data) {
        let msg = 'Provider Login Successfully';
        requestdata.id = get_data.id;
        await fun.UpdateDeviceProvider(requestdata);
        var send_data = await fun.GetProvider(get_data.id);
        fun.true_status(res, send_data, msg);
      } else {
        let msg = 'Invalide Login Details';
        fun.false_status(res, msg)
      }

    } catch (error) {
      throw error;

    }
  },


  //  ++++++++++++++++++++++++++++  provider +++++++++++++++++++++++++++++++++++++

  ProviderSignUp: async function (req, res) {
    try {
      req.check('name').notEmpty().withMessage('Name field is required');
      req.check('email').isEmail().withMessage('Email field is required');
      req.check('password').notEmpty().withMessage('Password field is required');
      req.check('deviceToken').notEmpty().withMessage('deviceToken field is required');
      req.check('category_id').notEmpty().withMessage('category_id field is required');
      // req.check('device_type').notEmpty().withMessage('device_type field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.device_token = req.headers.devicetoken;
      // requestdata.date_created =fun.get_date();
      requestdata.category_id = requestdata.category_id.split(",").map(Number);
      //  console.log(requestdata);return false;
      var checkemail = await fun.CheckEmailProviderExist(res, requestdata.email);
      if (checkemail == false) {
        return false;
      }
      var image = '';
      if (req.files && req.files.image) {
        image = await fun.single_image_upload(req.files.image, 'upload');
      }
      var business_licence = '';
      if (req.files && req.files.business_licence) {
        business_licence = await fun.single_image_upload(req.files.business_licence, 'upload');
      }
      var insurance = '';
      if (req.files && req.files.insurance) {
        insurance = await fun.single_image_upload(req.files.insurance, 'upload');
      }
      requestdata.image = image;
      requestdata.business_licence = business_licence;
      requestdata.insurance = insurance;

      // console.log(requestdata);return false;
      var insert_data = await fun.InsertProviderData(requestdata);
      if (insert_data) {
        var _my_category = [];
        for (var i in requestdata.category_id) {
          var ar = {
            'providerId': insert_data.id,
            'categoryId': requestdata.category_id[i]
          }
          _my_category.push(ar);
        }
        var create_category = await provider_category.bulkCreate(_my_category);
        var send_data = await fun.GetProvider(insert_data.id);
        let msg = "Signup Successfully";
        fun.true_status(res, send_data, msg);
      } else {
        let msg = 'Provider Not Register';
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }

  },


  ForgotPasswordProvider: async function (req, res) {
    req.check('email').isEmail().withMessage('email field is required');
    var error = req.validationErrors();
    if (error) {
      res.send(fun.required_data(error));
      return false;
    }
    var requestdata = req.body;

    var checkemail = await fun.GetEmailDataProvider(res, requestdata.email);
    // console.log(checkemail);return false;
    if (checkemail != false) {
      var otp = crypto.randomBytes(10).toString('hex');
      var url = base_url + "/apis/link_creating/" + otp;
      let mail = {
        from: "admin@bliss.com",
        to: requestdata.email,
        subject: "Pronto360 Forgot Password (" + new Date() + ")",
        html: '<!DOCTYPE html><html><head><title>Pronto360</title><link href="https://fonts.googleapis.com/css?family=Pacifico&display=swap&subset=cyrillic,cyrillic-ext,latin-ext,vietnamese" rel="stylesheet"> <link href="https://fonts.googleapis.com/css?family=Exo+2:200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&display=swap" rel="stylesheet"> </head><body style="font-family: Exo 2, sans-serif; margin:0;"><div style="width: 430px;margin: auto;"><table style="width: 100%;text-align: center; background:url(https://images.unsplash.com/photo-1535498730771-e735b998cd64?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80) no-repeat left top / cover;"><tbody><tr><td><table style="width: 100%;text-align: center;"><tbody><tr><td style="padding: 20px;"><img src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/26fd2b78444493.5ca4ef9d727af.png" height="50" width="50"></td></tr></tbody></table><table style="width: 100%;text-align: center;"><tbody><tr><td style="font-size: 52px;color: #fff;font-weight: bold;text-shadow: 0 0 0;">Pro<span style="font-size: 52px;color: #81d462;font-weight: bold;text-shadow: 0 0 0;text-shadow: 1px 1px 0px #fff;">nto</span>360</td></tr><tr><td style="padding: 50px 0 10px;"><img src="https://cdn.pixabay.com/photo/2016/12/18/12/49/cyber-security-1915628_960_720.png" style="width: 120px;"></td></tr><tr><td style="font-size: 23px;color: #fff;font-weight: 400;padding: 20px 26px 0;">Please click the button to reset your password</td></tr><tr><td style="font-size: 30px;color: #fff;font-weight: bold;padding: 46px 0 10px;"><a href="' + url + '" style="background: #81d462;color: #fff;text-decoration: none;font-size: 19px;text-transform: uppercase;padding: 10px 40px;display: inline;border-radius: 80px;">Click Here</a></td></tr></tbody></table><table style="width: 100%;padding: 30px 0 0;" cellspacing="0" cellpadding="0"><tbody></tbody></table></td></tr></tbody></table></div></body></html>'
        // html:
        //   'Click here for change password <a href="'+base_url+"/apis/url_idd/" +otp +'"> Click</a>'
      };
      var update = await provider.update({
        otp: otp
      }, {
        where: {
          id: checkemail.id
        }
      }
      );
      let email = await fun.SendMail(mail);
      let msg = "Mail Send Successfully"
      var bd = {}
      fun.true_status(res, bd, msg);
    } else {
      let msg = 'This Email Not Exist';
      fun.false_status(res, msg);
    }

  },

  createLink: async function (req, res) {
    var data = await provider.findOne({
      where: {
        otp: req.params.id,
      }
    });

    //console.log(data,'=============data');
    if (data) {
      data = data.toJSON();
      res.render("reset_password_provider", {
        title: "Pronto360",
        response: data.otp,
        flash: "",
        hash: req.params.id
      });
    } else {
      res.status(403).send("Link has been expired!");
    }

  },
  ResetPasswordProvider: async function (req, res) {
    const data = await provider.findOne({
      where: {
        otp: req.body.hash,
      }
    });
    /*  console.log(data,"data");return ; */
    if (data) {
      const hashm = crypto.createHash('sha1').update(req.body.confirm_password).digest('hex');
      const save = await provider.update({
        password: hashm,
      },
        {
          where: {
            otp: req.body.hash
          }
        }
      );
      if (save) {
        const up = await provider.update({
          otp: '',
        },
          {
            where: {
              otp: req.body.hash
            }
          }
        );
        res.render("success_page", { msg: "Password Changed successfully" });
      } else {
        res.render("success_page", { msg: "Invalid user" });
      }
    } else {
      res.render("success_page", { msg: "Link has Expired" });
    }
  },


  CategoryProvider: async function (req, res) {
    try {
      var _category = await category.findAll({
        where: {
          status: 1
        }
      });
      if (_category) {
        _category = _category.map(value => { return value.toJSON() });
      }

      if (_category) {
        let msg = "Categories get successfully";
        fun.true_status(res, _category, msg);
      } else {
        let msg = "Categories get successfully";
        _category = [];
        fun.true_status(res, _category, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  SocialLoginProvider: async function (req, res) {
    try {
      req.check('social_id').notEmpty().withMessage('social_id fields is required');
      req.check('social_type').notEmpty().withMessage('social_type fields is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.device_token = req.headers.devicetoken;
      var auth_key = crypto.randomBytes(10).toString('hex');
      var check_social_id_exist = await provider.findOne({
        where: {
          socialId: requestdata.social_id,
          socialType: requestdata.social_type
        }
      });
      //  console.log(check_social_id_exist);return;
      if (check_social_id_exist) {
        check_social_id_exist = check_social_id_exist.toJSON();
        var update_data = await provider.update({
          name: requestdata.name,
          email: requestdata.email,
          latitude: requestdata.latitude,
          phone: requestdata.phone,
          countryCode: requestdata.countryCode,
          longitude: requestdata.longitude,
          location: requestdata.location,
          deviceToken: requestdata.device_token,
          socialId: requestdata.social_id,
          socialType: requestdata.social_type,
          deviceType: requestdata.device_type,

          authorization: auth_key

        }, {
          where: {
            id: check_social_id_exist.id
          }
        }
        );

        var data = await fun.GetProvider(check_social_id_exist.id);
        let msg = "Login Successfully";
        let body = data;
        fun.true_status(res, body, msg);

      } else {
        var update_data = await provider.create({
          name: requestdata.name,
          email: requestdata.email,
          phone: requestdata.phone,
          countryCode: requestdata.countryCode,
          latitude: requestdata.latitude,
          longitude: requestdata.longitude,
          location: requestdata.location,
          deviceToken: requestdata.device_token,
          deviceType: requestdata.device_type,
          socialId: requestdata.social_id,
          socialType: requestdata.social_type,
          status: 1,
          authorization: auth_key
        });
        if (update_data) {
          update_data = update_data.toJSON();
          var data = await fun.GetProvider(update_data.id);
          let msg = "Login Successfully";
          let body = data;
          fun.true_status(res, body, msg);
        } else {
          let msg = "Error";
          fun.false_status(res, msg);
        }
      }


    } catch (error) {
      throw error;
    }
  },


  GetHomeData: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var providerId = check_auth.id
      // type : 0=open,1=complete
      // [0,1,3];
      if (requestdata.type == 0) {
        var status = 0;
      } else {
        var status = 4;
      }
      var delete_order_id = await delete_order.findAll({
        attributes: ['id', 'userId', 'orderId'],
        where: {
          userId: check_auth.id
        }
      });
      var get_archive_order = await archive_order.findAll({
        attributes: ['id', 'userId', 'orderId'],
        where: {
          userId: check_auth.id
        }
      });
      //  get deleted ids --------------------
      var delete__id = []
      if (delete_order_id) {
        for (var i in delete_order_id) {
          delete__id.push(delete_order_id[i].orderId);
        }
      }
      if (get_archive_order) {
        for (var j in get_archive_order) {
          delete__id.push(get_archive_order[j].orderId);
        }
      }
      //console.log(delete__id,"===============")
      var get_order_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'date', 'created', 'completeOrderTime'],
        where: {
          [Op.or]: [{ providerId: providerId }, { providerId: 0 }],
          // providerId:providerId,  
          status: status,
          id: {
            [Op.notIn]: delete__id
          }

        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'price', 'image'],
          required: false
        }, {
          model: user,
          attributes: ['id', 'name', 'image', 'phone'],
          required: false
        }],
        order:[
          ['id','desc']
        ]
      });


      if (get_order_data) {
        get_order_data = get_order_data.map(value => {
          data = value.toJSON();
          var mg = {};
          if (data.provider == '' || data.provider == null || data.provider == 'null') {
            data.provider = mg
          }
          var tm = new Date(data.createdAt);
          var tim = Math.round(tm.getTime() / 1000);
          data.createdAt = tim;
          return data;
        });
      }

      var get_count = await notification.count({
        where: {
          usertypeId: check_auth.id,
          isRead: 0
        }
      });
      var final_array = {
        notification_count: get_count,
        data: get_order_data
      }
      if (final_array) {
        let msg = "Order get successfully";
        fun.true_status(res, final_array, msg);
      } else {
        let msg = "Order get successfully";
        _category = final_array;
        fun.true_status(res, _category, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  NotificationOnOff: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      // type : 0=off,1=on
      var update_provider = await provider.update({
        isNotification: requestdata.type
      }, {
        where: {
          id: check_auth.id
        }
      }
      );
      if (update_provider) {
        let msg = "Notification Update successfully";
        var body = {}
        fun.true_status(res, body, msg);
      } else {
        let msg = "Notification Not updated";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  GetProfileAdviser: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var data = await fun.GetProvider(check_auth.id);
      //  -------------rating ------------------------------
      var get_rating = await rating.findAll({
        where: {
          user2Id: data.id
        },
        include: [{
          model: user,
          attributes: ['id', 'name', 'image'],
          required: false

        }]
      });
      if (get_rating.length > 0) {
        get_rating = get_rating.map(val => {
          var ab = val.toJSON();
          var tm = new Date(ab.createdAt);
          var tim = Math.round(tm.getTime() / 1000);
          ab.createdAt = tim;
          if (ab.user == null && ab.user == 'null') {
            ab.user = [];
          }
          //  ab.createdAt =await fun.ConvertTime(ab.createdAt);
          return ab;
        });

      }
      //     ------------------- previous jobs -----------------
      var get_order_data = [];
      var get_order_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'date'],
        where: {
          providerId: check_auth.id,
          status: 4
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'price', 'image'],
          required: false
        }, {
          model: user,
          attributes: ['id', 'name', 'image', 'about'],
          required: false
        }]
      });


      if (get_order_data.length > 0) {
        get_order_data = get_order_data.map(value => {
          data1 = value.toJSON();
          var tm = new Date(data1.createdAt);
          var tim = Math.round(tm.getTime() / 1000);
          data1.createdAt = tim;
          return data1;
        });
      }

      data.rating = get_rating;
      data.previous_order = get_order_data;
      let msg = "Get successfully";
      _adviser = data;
      fun.true_status(res, _adviser, msg);

    } catch (error) {
      throw error;
    }
  },

  GetOrderDetailProvider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('order_id').notEmpty().withMessage('order_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      // requestdata.authorization =req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var get_order_data = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'created', 'date'],
        where: {
          id: requestdata.order_id,
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'price', 'image', 'phone', 'location'],
          required: false
        }, {
          model: user,
          attributes: ['id', 'name', 'image', 'phone', 'location'],
          required: false
        }, 
        // {
        //   model: invoice,
        //   required: false
        // },
         {
          model: bid,
          where: {
            providerId: check_auth.id
          },
          required: false
        }]
      });
      if (get_order_data) {
        var data = get_order_data.toJSON();
        var get_extra = await raise_invoice.findOne({
          where: {
            orderId: data.id
          },
          raw: true
        });
        var get_invoice = await invoice.findAll({
          attributes: ['id', 'amount', 'adminFees', 'providerId','createdAt', 'userId', 'type', 'cardId','isOrderType'],
          where: {
            orderId: data.id,
          },
          raw: true
        });
        if (get_extra == '' || get_extra == null || get_extra == 'null') {
          data.extra_work = {};
        } else {
          data.extra_work = get_extra;
        }

        if(get_invoice){
          for(var i in get_invoice){
             get_invoice[i].createdAt = await fun.ConvertTime(get_invoice[i].createdAt);
          }
        }

        data.invoice = get_invoice;
        var mg = {};
        var bid_array = [];
        if (data.provider == '' || data.provider == null || data.provider == 'null') {
          var my_provider = {
            id: check_auth.id,
            name: check_auth.name,
            price: check_auth.price,
            image: check_auth.image,
            phone: check_auth.phone,
            location: check_auth.location,
          }
          data.provider = my_provider
        }
        if (data.invoice == '' || data.invoice == null || data.invoice == 'null') {
          data.invoice = []
        } else {
          var tm1 = new Date(data.invoice.createdAt);
          var tim1 = Math.round(tm1.getTime() / 1000);
          data.invoice.createdAt = tim1;
        }
        if (data.bids == '' || data.bids == null || data.bids == 'null') {
          data.bids = bid_array
        }
        if (data.user == '' || data.user == null || data.user == 'null') {
          data.user = mg
        }
        var tm = new Date(data.createdAt);
        var tim = Math.round(tm.getTime() / 1000);
        data.createdAt = tim;
        var get_bid = await bid.findOne({
          where: {
            orderId: requestdata.order_id,
            providerId: check_auth.id
          }
        });
        data.is_bid = 0;
        if (get_bid) {
          data.is_bid = 1
        }

      }
      if (data) {
        let msg = "Order get successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  RaiseInvoiceProvider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('orderId').notEmpty().withMessage('orderId field is required');
      // req.check('type').notEmpty().withMessage('type field is required');
      req.check('title').notEmpty().withMessage('title field is required');
      req.check('description').notEmpty().withMessage('description field is required');
      //req.check('price').notEmpty().withMessage('price field is required');
      req.check('app_type').notEmpty().withMessage('app_type field is required');
      // 0=user,1=provider
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
       if(requestdata.app_type ==0){
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
       }else{
       var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization,res);
       }
      if (check_auth == false) {
        return false;
      }
     // requestdata.providerId = check_auth.id;
      var get_order = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'created', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status'],

        where: {
          id: requestdata.orderId
        }
      });
      // console.log(get_order,'================'); return;
      if (get_order) {
        get_order = get_order.toJSON();
       // console.log(get_order, "=================get_order")
        // requestdata.image ='';
        requestdata.userId = get_order.userId;
        requestdata.providerId =  get_order.providerId;

        if(requestdata.app_type==0){
        var get_provider = await provider.findOne({
          attributes:['id','name','image','deviceToken'],
          where: {
            id: get_order.providerId
          },
          raw: true
        });
      }else{
        var get_provider = await user.findOne({
          attributes:['id','name','image','deviceToken'],
          where: {
            id: get_order.userId
          },
          raw: true
        });
      }
      // console.log(get_provider, "=================get_provider");return;
        // requestdata.image ='';
        // if(req.files && req.files.image){
        //     requestdata.image =await fun.single_image_upload(req.files.image,'upload');
        // } 
        // requestdata.thumb ='';
        // if(req.files && req.files.thumb){
        //     requestdata.thumb =await fun.single_image_upload(req.files.thumb,'upload');
        // }
         //console.log(requestdata);return false;


        var create_invoice = await raise_invoice.create(requestdata);
        create_invoice = create_invoice.toJSON();

        let media = [];
        if(requestdata.hasOwnProperty('type')){
        var type = requestdata.type.split(",");
        }
        let video_thumbnail = [];
        let _media = [];
        //    console.log(requestdata,"===================requestdata");
        //    console.log(req.files,"==================req.files.thumb");
        if (req.files != null && req.files.thumb) {
          if (Array.isArray(req.files.thumb)) {
            var thumb = req.files.thumb;
            for (let i in thumb) {
              let thumbs = await fun.single_image_upload(thumb[i], 'upload');
              video_thumbnail.push(thumbs);
            }
          } else {
            let thumbs = await fun.single_image_upload(req.files.thumb, 'upload');

            video_thumbnail = [thumbs];
          }
        }


        //   add image -----------

        if (req.files != null && req.files.images) {
          if (Array.isArray(req.files.images)) {
            var image = req.files.images;
            for (let i in image) {
              let imagess = await fun.single_image_upload(image[i], 'upload');
              media.push(imagess);
            }

            let video_thumbnail_index = 0;

            media.forEach((item, index) => {
              let obj = {
                // index,
                invoiceId: create_invoice.id,
                type: type[index] ? type[index] : '0',
                image: media[index],
              }
              if (type[index] == 1) {
                obj['thumb'] = video_thumbnail[video_thumbnail_index] ? video_thumbnail[video_thumbnail_index] : '';
                video_thumbnail_index++;
              } else {
                obj['thumb'] = '';
              }
              _media.push(obj);
            });

          } else {
            let image = await fun.single_image_upload(req.files.images, 'upload');
            // let file = await helpers.fileUpload(requestData.media, 'posts');

            _media = [{
              //  index: 0,
              type: type[0],
              invoiceId: create_invoice.id,
              image: image,
              thumb: video_thumbnail.length > 0 ? video_thumbnail[0] : ''
            }];

          }
        }
        var insert_images = await extra_work_images.bulkCreate(_media);

        var get_extra_images = await  extra_work_images.findAll({
          attributes:['id','image','thumb','type'],
          where:{
            invoiceId: create_invoice.id
          },
          raw:true
        });

        // ----------------send push-------------------
        delete create_invoice.createdAt;
        delete create_invoice.updatedAt;
        get_order.extra_work = create_invoice;
        get_order.extra_work.extra_image = get_extra_images;
        var _push_data = {};
        if(requestdata.app_type ==0){
          _push_data.code = 20;
          _push_data.model = provider
          _push_data.type = 1;
        }else{
          _push_data.code = 21;
          _push_data.model = user
          _push_data.type = 0;
        }

       // define top
        _push_data.token = get_provider.deviceToken;
        _push_data.title = check_auth.name + " create Extra work order ";
       // _push_data.code = 20;
        delete get_provider.deviceToken;
        var body = {
          id: create_invoice.id,
          body: get_provider,
          order: get_order
        }
        // _push_data.code =13;
        _push_data.body = body;

      //  console.log(_push_data,"================================_push_data");return false;
        var send_push = await fun.PushNotification(_push_data);

        var my_array = {
          userId: check_auth.id,
          usertypeId: get_provider.id,
          userType: 1,
          // notificationCode: _push_data.code,
          notificationCode: 20,
          orderId: requestdata.orderId,
          message: _push_data.title,
          checkinId:create_invoice.id,
          isCheckin:1
        }
        var create_notification = await notification.create(my_array);

      } else {
        var msg = 'invalide order id'
        fun.false_status(res, msg);
      }
      if (create_invoice) {
        let msg = "Extra Work Order create successfully";
        var _adviser = {};
        fun.true_status(res, _adviser, msg);
      } else {
        var msg = 'Error'
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  AddBid: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('orderId').notEmpty().withMessage('orderId field is required');
      req.check('price').notEmpty().withMessage('price field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      requestdata.providerId = check_auth.id;
      var get_order = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'title'],
        where: {
          id: requestdata.orderId
        },
        include: [{
          model: user,
          attributes: ['id', 'name', 'deviceToken'],
          required: false,
        }, {
          model: provider,
          attributes: ['id', 'name'],
          required: false
        }]
      });
      // console.log(get_order,'================'); return;
      if (get_order) {
        get_order = get_order.toJSON();
//  update edit order status --------------------------------------
        var update_order = await order.update({
          isEdit:0
        },{
          where:{
            id:get_order.id
          }
        })
        // console.log(get_order,"==============");
        var create_invoice = await bid.create(requestdata);
        create_invoice = create_invoice.toJSON();
        delete create_invoice.createdAt;
        delete create_invoice.updatedAt;
        // ----------------send push-------------------
        var _push_data = {};
        var body = {
          id: create_invoice.id,
          body: create_invoice
        }
        _push_data.type = 0;
        _push_data.model = user
        _push_data.token = get_order.user.deviceToken;
        _push_data.title = check_auth.name + " Bid on your Project #" + get_order.title;
        _push_data.code = 3;
        _push_data.body = body;
        var send_push = await fun.PushNotification(_push_data);

        var my_array = {
          userId: check_auth.id,
          usertypeId: get_order.user.id,
          userType: 1,
          notificationCode: _push_data.code,
          orderId: requestdata.orderId,
          message: _push_data.title
        }
        var create_notification = await notification.create(my_array);
      } else {
        var msg = 'invalide order id'
        fun.false_status(res, msg);
      }
      if (create_invoice) {
        let msg = "Bid Add successfully";
        var _adviser = {};
        fun.true_status(res, _adviser, msg);
      } else {
        var msg = 'Error'
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  AcceptRejectProvider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('order_id').notEmpty().withMessage('order_id field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      // time parm  not required
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      //console.log(requestdata,"=========");
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var msg = '';
      var code = 0;
      if (requestdata.type == 1) {
        msg = "Accept successfully";
        code = 5;
      } else if (requestdata.type == 2) {
        msg = "Reject successfully";
        code = 6;
      } else if (requestdata.type == 3) {
        msg = "Start successfully";
        code = 7;

      } else {
        msg = "Complete successfully";
        code = 8;
      }
      var get_order_data = await order.findOne({
        attributes: ['id', 'userId', 'status', 'completeOrderTime'],
        where: {
          id: requestdata.order_id,
        },
        include: [{
          model: provider,
          attributes: ['id', 'name', 'deviceToken', 'image'],
          required: false
        }, {
          model: user,
          attributes: ['id', 'name', 'deviceToken', 'image'],
          required: false
        }]
      });
      if (requestdata.hasOwnProperty('time')) {
        requestdata.time = requestdata.time
      } else {
        requestdata.time = fun.Time
      }
      //console.log(get_order_data,'===============get_order_data')
      if (get_order_data) {
        get_order_data = get_order_data.toJSON();
        if (requestdata.type == 4) {
          var update_data = await order.update({
            status: requestdata.type,
            providerId: check_auth.id,
            completeOrderTime: get_order_data.completeOrderTime
          }, {
            where: {
              id: requestdata.order_id
            }
          }
          );
        } else {
          var update_data = await order.update({
            status: requestdata.type,
            providerId: check_auth.id,
            completeOrderTime: requestdata.time
          }, {
            where: {
              id: requestdata.order_id
            }
          }
          );
        }
        //  notification ---------------------
        var body = {
          name: check_auth.name,
          id: check_auth.id,
          order_id: get_order_data.id,
          body: get_order_data
        }
        data = {};
        data.type = 0;
        data.model = user
        data.token = get_order_data.user.deviceToken;
        data.title = check_auth.name + ' order ' + msg;
        data.code = code;
        data.body = body;
        if (requestdata.type == 3) {
          data.body.time = requestdata.time;
        }
        var get_bid = await bid.findOne({
          attributes: ['id', 'price'],
          where: {
            orderId: requestdata.order_id,
            providerId: check_auth.id,
            status: 1
          }
        });

        //  console.log(get_bid,"========================getbid");

        if (get_bid) {
          get_bid = get_bid.toJSON();
          data.body.price = get_bid.price;
        }
        var settings = await setting.findOne();
        settings = settings.toJSON();
        //console.log(settings,"===============settings");
        var admin_fees = settings.comission;
        var get_commision = Number(admin_fees / 100) * Number(data.body.price);
        var last_price = Number(get_commision) + Number(data.body.price);
        data.body.price = last_price;
        //console.log(data,"==================data");
        var send_push = await fun.PushNotification(data);

        var my_array = {
          userId: check_auth.id,
          usertypeId: get_order_data.user.id,
          userType: 1,
          notificationCode: data.code,
          orderId: requestdata.order_id,
          message: data.title
        }
        var create_notification = await notification.create(my_array);
      } else {
        let msg = "Invalid Order Id";
        fun.false_status(res, msg);
      }

      if (get_order_data) {
        var data = get_order_data;

        let msg = "Order Status Change successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  UpdateCategory: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('category_id').notEmpty().withMessage('category_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      requestdata.providerId = check_auth.id;
      requestdata.category_id = requestdata.category_id.split(",").map(Number);
      if (requestdata.category_id) {
        var _category = [];
        for (var i in requestdata.category_id) {
          var _arry = {
            'providerId': requestdata.providerId,
            'categoryId': requestdata.category_id[i],
            'price': 0
          }
          _category.push(_arry);
        }
        var _delete = await provider_category.destroy({
          where: {
            providerId: requestdata.providerId
          }
        });

        await provider_category.bulkCreate(_category);

      }
      if (requestdata.category_id) {
        let msg = "Category update successfully";
        var _adviser = {};
        fun.true_status(res, _adviser, msg);
      } else {
        var msg = 'Error'
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  EditProfileProvider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var image = '';
      if (req.files && req.files.image) {
        image = await fun.single_image_upload(req.files.image, 'upload');
        requestdata.image = image;
      } else {
        requestdata.image = check_auth.image;
      }

      var update = await provider.update({
        name: requestdata.name,
        about: requestdata.about,
        image: requestdata.image,
        email: requestdata.email,
        dob: requestdata.dob,
        countryCode: requestdata.countryCode,
        phone: requestdata.phone,
        location: requestdata.location,
        latitude: requestdata.latitude,
        longitude: requestdata.longitude
      }, {
        where: {
          id: check_auth.id
        }
      }
      );

      requestdata.category_id = requestdata.category_id.split(",").map(Number);
      if (requestdata.category_id) {
        var _category = [];
        for (var i in requestdata.category_id) {
          var _arry = {
            'providerId': check_auth.id,
            'categoryId': requestdata.category_id[i],
            'price': 0
          }
          _category.push(_arry);
        }
        var _delete = await provider_category.destroy({
          where: {
            providerId: check_auth.id
          }
        });

        await provider_category.bulkCreate(_category);

      }
      if (update) {
        var send_data = await fun.GetProvider(check_auth.id);
        let msg = "Profile Update Successfully";
        fun.true_status(res, send_data, msg);
      } else {
        let msg = "Profile Not Updated";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  ChangePasswordProvider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('old_password').notEmpty().withMessage('old_password field is required');
      req.check('new_password').notEmpty().withMessage('new_password field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      const password = crypto.createHash('sha1').update(requestdata.old_password).digest('hex');
      var new_password = crypto.createHash('sha1').update(requestdata.new_password).digest('hex');
      if (check_auth.password == password) {
        var update = await provider.update({
          password: new_password
        }, {
          where: {
            id: check_auth.id
          }
        }
        );
      } else {
        let msg = "Old Password is Wrong";
        fun.false_status(res, msg);
        return false;
      }
      let body = {};
      let msg1 = "Password Change Successfully";
      fun.true_status(res, body, msg1);

    } catch (error) {
      throw error;
    }

  },

  TermAndAbout: async function (req, res) {
    try {
      // req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      //   type 0=term,1=about,3=privacy
      //   var error = req.validationErrors();
      //     if (error) {
      //         res.send(fun.required_data(error));
      //         return false;
      //     }
      var requestdata = req.body;
      //     var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization,res);
      //     if(check_auth==false){
      //         return false
      //     }
      var get_data = await content.findOne({
        attributes: ['about', 'term', 'privacy'],
      });
      if (get_data) {
        var send_data = get_data.toJSON();
        var data = {};
        if (requestdata.type == 0) {
          data = send_data.term;
        } else if (requestdata.type == 1) {
          data = send_data.about;
        } else {
          data = send_data.privacy;
        }
        let msg = "Get Successfully";
        fun.true_status(res, data, msg);
      } else {
        let msg = "Error";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  CheckIn: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('orderId').notEmpty().withMessage('orderId field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false
      }
      var get_data = await order.findOne({
        attributes: ['id'],
        where: {
          id: requestdata.orderId
        },
        include: [{
          model: user,
          attributes: ['id', 'deviceType', 'deviceToken'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'deviceType', 'deviceToken'],
          required: false
        }]
      });
      requestdata.providerId = check_auth.id;
      requestdata.status = 0;

      // console.log(requestdata,"===============requestdata");
      if (get_data) {
        var send_data = get_data.toJSON();
        //  ----------send push  type 0=send user push ,1 =send provider push-------------
        requestdata.time = current_time;
        var create_checkin = await checkin.create(requestdata);
        var body = {
          name: send_data.provider.name,
          id: send_data.provider.id,
          order:get_data
        }
        data = {};
        data.type = 0;
        data.model = user
        data.token = send_data.user.deviceToken;
        data.title = send_data.provider.name + " send checkIn Request";
        data.code = 0;
        data.body = body;

        if (create_checkin) {
          create_checkin = create_checkin.toJSON();
          var send_data_push = {
            id: create_checkin.id
          }
          data.body.body = send_data_push;
          //console.log(data,"=================data");
          var send_push = await fun.PushNotification(data);
          var my_array = {
            userId: check_auth.id,
            usertypeId: send_data.user.id,
            userType: 1,
            orderId: requestdata.orderId,
            isCheckin: 1,
            notificationCode: data.code,
            checkinId: create_checkin.id,
            message: data.title
          }
          var create_notification = await notification.create(my_array);
          var data = {};
          let msg = "Send Successfully";
          fun.true_status(res, data, msg);
        } else {
          let msg = "Invalid Error";
          fun.false_status(res, msg);
        }
      } else {
        let msg = "Invalid OrderID";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  AcceptRejectCheckin: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('id').notEmpty().withMessage('id field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      //  id given in push notification
      // type =1=accept,2=reject
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false
      }
      var ab = ['1', '2'];
      var check_ = ab.includes(requestdata.type);
      if (check_ == false) {
        let msg = "Invalid Type";
        fun.false_status(res, msg);
      }

      if (requestdata.type == 1) {
        var msg = " Accept Your Request";
      } else {
        var msg = " Reject Your Request";
      }
      var check_request = await checkin.findOne({
        where: {
          id: requestdata.id
        },
        include: [{
          model: provider,
          attributes: ['id', 'name', 'image', 'deviceToken', 'phone', 'countryCode'],
          required: false
        }, {
          model: order,
          attributes: ['id'],
          required: false
        }]
      });
      if (check_request) {
        check_request = check_request.toJSON();
        var update_request = await checkin.update({
          status: requestdata.type,
          time: current_time
        }, {
          where: {
            id: requestdata.id
          }
        });
        //  send push  -------------------------------------------
        var body = {
          name: check_auth.name,
          id: check_auth.id,
          name: check_auth.name,
          order_id: check_request.order.id,
          body: check_request.provider
        }
        data = {};
        data.type = 1;
        data.model = provider
        data.token = check_request.provider.deviceToken;
        data.title = check_auth.name + msg;
        data.code = 1;
        data.body = body;
        // console.log(data,"===================Accept_reject_Checkin");
        var send_push = await fun.PushNotification(data);
        var my_array = {
          userId: check_auth.id,
          usertypeId: check_request.provider.id,
          userType: 1,
          notificationCode: data.code,
          orderId: check_request.order.id,
          message: data.title
        }
        var create_notification = await notification.create(my_array);

        let msg1 = msg;
        var sen_body = {}
        fun.true_status(res, sen_body, msg);

      } else {
        let msg = "Invalid Error";
        fun.false_status(res, msg);
      }


    } catch (error) {
      throw error;
    }
  },

  GetWorkOrderProvider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var get_order_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'created', 'completeOrderTime'],
        where: {
          providerId: check_auth.id
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: user,
          attributes: ['id', 'name', 'phone', 'image'],
          required: false
        }],
        order: [
          ['id','desc']
        ]
      });
      if (get_order_data) {
        get_order_data = get_order_data.map(val => {
          var data = val.toJSON();
          // console.log(data);
          var mg = {};
          if (data.user == '' || data.user == null || data.user == 'null') {
            data.user = mg
          }
          var tm1 = new Date(data.createdAt);
          var tim1 = Math.round(tm1.getTime() / 1000);
          data.createdAt = tim1;
          return data;
        });
      }

      if (get_order_data) {
        let msg = "Order get successfully";
        fun.true_status(res, get_order_data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  NotificationListProvider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var update_notification = await notification.update({
        isRead: 1
      }, {
        where: {
          usertypeId: check_auth.id
        }
      }
      );
      //  console.log(check_auth);
      var get_notification = await notification.findAll({
        where: {
          usertypeId: check_auth.id,
          notificationCode:{
            [Op.ne]:20
          }
        }, include: [{
          model: user,
          attributes: ['id', 'name', 'image', 'phone'],
          required: false
        }, {
          model: order,
          attributes: ['id', 'status', 'completeOrderTime'],
          required: false
        }],
        order: [['id', 'desc']]
      });

      if (get_notification) {
        get_notification = get_notification.map(value => {
          var av = value.toJSON();
          av.user_data = av.user;
          delete av.user;
          var tm = new Date(av.createdAt);
          var tim = Math.round(tm.getTime() / 1000);
          av.createdAt = tim;
          if (av.order == null || av.order == 'null' || av.order == '') {
            av.order = {}
          }
          return av;
        });

        for(var i in get_notification){
          if(get_notification[i].order.id !=undefined){
          var get_count =  await rating.count({
            where:{
              user2Id:check_auth.id,
              orderId:get_notification[i].order.id
            },
            raw:true
          });
           get_notification[i].is_rate = get_count;
          }else{
            get_notification[i].is_rate = 0
          }
        }
        let msg = "Get successfully";
        _adviser = get_notification;
        fun.true_status(res, _adviser, msg);
      } else {
        let msg = "Get successfully";
        _adviser = [];
        fun.true_status(res, _adviser, msg);
      }


    } catch (error) {
      throw error;
    }
  },

  GetUser: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('id').notEmpty().withMessage('id field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      //   type 0=user,1=provider,
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var types = ['0', '1'];
      var check_type = types.includes(requestdata.type);
      if (check_type == false) {
        let msg = "Invalide Type";
        fun.false_status(res, msg);
      }
      if (requestdata.type == 0) {
        var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
        var get_user = await user.findOne({
          where: {
            id: requestdata.id
          }
        });
      } else {
        var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
        var get_user = await provider.findOne({
          where: {
            id: requestdata.id
          }
        });
      }
      if (get_user) {
        var send_data = get_user.toJSON();
        var final = {
          login_data: check_auth,
          other_data: send_data
        }
        let msg = "Get Successfully";
        fun.true_status(res, final, msg);
      } else {
        let msg = "Invalide id";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  Payment: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('orderId').notEmpty().withMessage('orderId field is required');
      req.check('cardId').notEmpty().withMessage('cardId field is required');
      req.check('amount').notEmpty().withMessage('amount field is required');
      req.check('cvv').notEmpty().withMessage('cvv field is required');
      req.check('isOrderType').notEmpty().withMessage('isOrderType field is required');
      // isOrderType : 0= normal,1=extrawork
      
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var check_invoice = await invoice.findOne({
        where: {
          orderId: requestdata.orderId
        }
      });
      if (check_invoice) {
        let msg = "Payment Already Done this Order";
        fun.false_status(res, msg);
      }
      //     get card --------------
      var get_card = await user_card.findOne({ where: { id: requestdata.cardId } });
      if (get_card) {
        get_card = get_card.toJSON();
      }
      //  var get order ------------------------------
      var get_order = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'createdAt'],
        include: [{
          model: provider,
          attributes: ['id', 'name', 'price', 'image'],
          required: false
        }],
        where: {
          id: requestdata.orderId
        }
      });
      if (get_order) {
        get_order = get_order.toJSON();
      }
      var payment_data = requestdata;
      payment_data.card = get_card;
      payment_data.order = get_order;
      //console.log(payment_data,"=================payment_data");
      var payments = await fun.StripePayment(payment_data);
      if (payments == "succeeded") {
        final = {};
        let msg = "Payment Successfully";
        fun.true_status(res, final, msg);
      } else {
        let msg = "Payment Not success";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  SyncPhone: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('data').notEmpty().withMessage('data field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var __contact = JSON.parse(requestdata.data);
      //   console.log('__contact======',__contact); return;
      if (__contact) {
        for (var i in __contact) {
          var get_data = await provider.findOne({
            where:
            {
              phone: __contact[i].phone,
              // countryCode: __contact[i].country_code 
            }
          });
          if (get_data) {
            get_data = get_data.toJSON();
            var update_data = await provider.update(
              {
                isBlock: 1
              }, {
              where: {
                id: get_data.id
              }
            }
            );
            var get_admin = await admin.findOne();

            // ----------------send push-------------------
            var _push_data = {};
            var body = {
              body: get_data
            }
            _push_data.type = 1;
            _push_data.model = provider
            _push_data.token = get_data.deviceToken;
            _push_data.title = "Due To share contact no Your Account has been block by admin.PLease contact admin #" + get_admin.dataValues.email;
            _push_data.code = 401;
            _push_data.body = body;
            var send_push = await fun.PushNotification(_push_data);
          }
        }
        var final = {}
        let msg = "Sync done Successfully";
        fun.true_status(res, final, msg);
      } else {
        let msg = "Sync not done Successfully";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  PaymentPaypal: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('orderId').notEmpty().withMessage('orderId field is required');
      req.check('transection_id').notEmpty().withMessage('transection_id field is required');
      req.check('data').notEmpty().withMessage('data field is required');
      req.check('amount').notEmpty().withMessage('amount field is required');
      req.check('created').notEmpty().withMessage('created field is required');
      req.check('isOrderType').notEmpty().withMessage('isOrderType field is required');

      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
     // console.log(requestdata,"==================================requestdata");
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
     // console.log(check_auth,"=====================");return;

      if (check_auth == false) {
        return false;
      }
      var check_invoice = await invoice.findOne({
        where: {
          orderId: requestdata.orderId
        }
      });

    
      // if(check_invoice){
      //     let msg ="Payment Already Done this Order";
      //     fun.false_status(res,msg);
      // }
      //     get card --------------

      var get_order = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'createdAt'],
        include: [{
          model: provider,
          attributes: ['id', 'name', 'price', 'image'],
          required: false
        }],
        where: {
          id: requestdata.orderId
        }
      });
      if (get_order) {
        get_order = get_order.toJSON();
      }
//console.log(get_order,"=========================")
      var settings = await setting.findOne();
      settings = settings.toJSON();
      var _final_fees = Number(requestdata.amount) - Number(requestdata.adminFees);

   //   console.log(_final_fees,"========================_final_fees");
      var insert_invoice = await invoice.create({
        userId: get_order.userId,
        orderId: get_order.id,
        amount: _final_fees,
        providerId: get_order.providerId,
        cardId: 0,
        type: 0,
        isOrderType:requestdata.isOrderType,
        adminFees: requestdata.adminFees,
        transectionId: requestdata.transection_id,
        data:JSON.stringify(requestdata.data),
        created: requestdata.created
      });

      if (insert_invoice) {
        final = {};
        let msg = "Payment Successfully";
        fun.true_status(res, final, msg);
      } else {
        let msg = "Payment Not success";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  GetAll: async function (req, res) {
    try {

      var update_notification = await provider.findAll({
        include: [{
          model: provider_category,
          required: false
        }],
        raw: true,
        nest: true,
      });
      for (var i in update_notification) {
        update_notification[i].my_key = 'hello';
      }

      let msg = "Get successfully";
      _adviser = update_notification
      fun.true_status(res, _adviser, msg);
    } catch (error) {
      throw error;
    }
  },


  get_review_provider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var data = await fun.GetProvider(check_auth.id);
      //  -------------rating ------------------------------
      var get_rating = await rating.findAll({
        where: {
          user2Id: data.id
        },
        include: [{
          model: user,
          attributes: ['id', 'name', 'image'],
          required: false

        }]
      });
      if (get_rating.length > 0) {
        get_rating = get_rating.map(val => {
          var ab = val.toJSON();
          var tm = new Date(ab.createdAt);
          var tim = Math.round(tm.getTime() / 1000);
          ab.createdAt = tim;
          if (ab.user == null && ab.user == 'null') {
            ab.user = [];
          }
          //  ab.createdAt =await fun.ConvertTime(ab.createdAt);
          return ab;
        });

      }
      var _rating = get_rating;
      let msg = "Rating Get successfully";
      _adviser = _rating;
      fun.true_status(res, _adviser, msg);

    } catch (error) {
      throw error;
    }
  },
   get_review_user: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var data = await fun.GetUser(check_auth.id);
      //  -------------rating ------------------------------
      var get_rating = await rating.findAll({
        where: {
          user2Id: data.id
        },
        include: [{
          model: provider,
          attributes: ['id', 'name', 'image'],
          required: false

        }]
      });
      if (get_rating.length > 0) {
        get_rating = get_rating.map(val => {
          var ab = val.toJSON();
          var tm = new Date(ab.createdAt);
          var tim = Math.round(tm.getTime() / 1000);
          ab.createdAt = tim;
          if (ab.provider == null && ab.provider == 'null') {
            ab.user = [];
          }
          //  ab.createdAt =await fun.ConvertTime(ab.createdAt);
          return ab;
        });

      }
      var _rating = get_rating;
      let msg = "Rating Get successfully";
      _adviser = _rating;
      fun.true_status(res, _adviser, msg);

    } catch (error) {
      throw error;
    }
  },

  delete_order_image: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('image_id').notEmpty().withMessage('image_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var delete_image = await order_image.destroy({
        where: {
          id: requestdata.image_id
        }
      });
      var _rating = {};
      let msg = "Image Delete successfully";
      _adviser = _rating;
      fun.true_status(res, _adviser, msg);

    } catch (error) {
      throw error;
    }
  },

  EditBid: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('bid_id').notEmpty().withMessage('bid_id field is required');
      req.check('price').notEmpty().withMessage('price field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      requestdata.providerId = check_auth.id;
      var get_bid = await bid.findOne({
        where: {
          id: requestdata.bid_id
        },
        raw: true
      });

      if (get_bid) {
        var update_bid = await bid.update(
          {
            price: requestdata.price
          }, {
          where: {
            id: get_bid.id
          }
        }
        );
      }
// update order edit bid status
      var update_order =  await order .update(
        {
          isEdit:0
        },{
          where:{
            id:get_bid.orderId
          }
        }
      );
 
      var get_order = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'title'],
        where: {
          id: get_bid.orderId
        },
        include: [{
          model: user,
          attributes: ['id', 'name', 'deviceToken'],
          required: false,
        }, {
          model: provider,
          attributes: ['id', 'name'],
          required: false
        }]
      });
      // console.log(get_order,'================'); return;
      if (get_order) {
        get_order = get_order.toJSON();
        // console.log(get_order,"==============");
        //   var create_invoice = await bid.create(requestdata)
        // ----------------send push-------------------
        requestdata.orderId = get_order.id
        var _push_data = {};
        var body = {
          id: requestdata.bid_id,
          body: requestdata
        }
        _push_data.type = 0;
        _push_data.model = user
        _push_data.token = get_order.user.deviceToken;
        _push_data.title = check_auth.name + " Edit Bid on your Project #" + get_order.title;
        _push_data.code = 3;
        _push_data.body = body;
        var send_push = await fun.PushNotification(_push_data);

        var my_array = {
          userId: check_auth.id,
          usertypeId: get_order.user.id,
          userType: 1,
          notificationCode: _push_data.code,
          orderId: requestdata.orderId,
          message: _push_data.title
        }
        var create_notification = await notification.create(my_array);
      } else {
        var msg = 'invalide order id'
        fun.false_status(res, msg);
      }
      if (create_notification) {
        let msg = "Bid edit successfully";
        var _adviser = {};
        fun.true_status(res, _adviser, msg);
      } else {
        var msg = 'Error'
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  EditOrder: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('order_id').notEmpty().withMessage('order_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }


      var update_order = await order.update({
        description: requestdata.description,
        isEdit:1
      }, {
        where: {
          id: requestdata.order_id,
          userId: check_auth.id
        }
      }
      );
      //  Thumb uploads ---------------------------

      let media = [];
      if (requestdata.hasOwnProperty('type')) {
        var type = requestdata.type.split(",");
      }
      let video_thumbnail = [];
      let _media = [];
      if (req.files != null && req.files.thumb) {
        if (Array.isArray(req.files.thumb)) {
          var thumb = req.files.thumb;
          for (let i in thumb) {
            let thumbs = await fun.single_image_upload(thumb[i], 'upload');
            video_thumbnail.push(thumbs);
          }
        } else {
          let thumbs = await fun.single_image_upload(req.files.thumb, 'upload');
          video_thumbnail = [thumbs];
        }
      }
      //   add image -----------

      if (req.files != null && req.files.images) {
        if (Array.isArray(req.files.images)) {
          var image = req.files.images;
          for (let i in image) {
            let imagess = await fun.single_image_upload(image[i], 'upload');
            media.push(imagess);
          }
          let video_thumbnail_index = 0;
          media.forEach((item, index) => {
            let obj = {
              // index,
              orderId: requestdata.order_id,
              type: type[index] ? type[index] : '0',
              image: media[index],
            }
            if (type[index] == 1) {
              obj['thumb'] = video_thumbnail[video_thumbnail_index] ? video_thumbnail[video_thumbnail_index] : '';
              video_thumbnail_index++;
            } else {
              obj['thumb'] = '';
            }
            _media.push(obj);
          });

        } else {
          let image = await fun.single_image_upload(req.files.images, 'upload');
          _media = [{
            type: type[0],
            orderId: requestdata.order_id,
            image: image,
            thumb: video_thumbnail.length > 0 ? video_thumbnail[0] : ''
          }];

        }
      }
      var insert_images = await order_image.bulkCreate(_media);

      var get_order_data = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'created', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status'],
        where: {
          id: requestdata.order_id,
        },
        include: [{
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'price', 'image', 'phone', 'location', 'deviceToken'],
          required: false
        }, {
          model: user,
          attributes: ['id', 'name', 'image', 'phone', 'location'],
          required: false
        }],
        raw: true,
        nest: true
      });
      // console.log(get_order_data,"================get_order_data")
      if (get_order_data) {

        var data = get_order_data
        var _push_data = {};
        var body = {
          id: data.id,
          body: data
        }
        //console.log(data.provider.id,"data.provider");return;
        if (data.provider.id != null) {
          _push_data.type = 1;
          _push_data.model = provider
          _push_data.token = (data.provider) ? data.provider.deviceToken : '';
          _push_data.title = data.user.name + " Update Order " + data.title;
          _push_data.code = 2;
          _push_data.body = body;

          var send_push = await fun.PushNotification(_push_data);
          //console.log(data.provider,"wfdsfs========================");
          var my_array = {
            userId: check_auth.id,
            usertypeId: data.provider.id,
            userType: 2,
            notificationCode: _push_data.code,
            orderId: requestdata.order_id,
            message: _push_data.title
          }
          var create_notification = await notification.create(my_array);
        } else {
          let bid_array = []
          final_data = []
          get_bids_provider = await bid.findAll({
            attributes: ['id', 'providerId', 'orderId'],
            where: {
              orderId: requestdata.order_id
            },
            raw: true
          })

          for (var i in get_bids_provider) {
            provider_ids = get_bids_provider[i].providerId
            bid_array.push(provider_ids)
          }
          //console.log(bid_array,"bid_array");return;

          get_device_token = await provider.findAll({
            attributes: ['id', 'deviceType', 'deviceToken'],
            where: {
              id: bid_array
            },
            raw: true
          })
         
          for (var k in get_device_token) {
            _push_data.token = get_device_token[k].deviceToken;
            var my_array = {
              userId: check_auth.id,
              usertypeId: get_device_token[k].id,
              userType: 2,
              notificationCode: _push_data.code,
              orderId: requestdata.order_id,
              message: data.user.name + " Update Order " + data.title
            }
          var create_notification = await notification.create(my_array);
          _push_data.type = 1;
          _push_data.model = provider
          _push_data.title = data.user.name + " Update Order " + data.title;
          _push_data.code = 2;
          _push_data.body = body;

          var send_push = await fun.PushNotification(_push_data);
          }
          
          //console.log(get_device_token,"get_device_token");return;

        }
        let msg = "order description edit successfully";
        var _adviser = {};
        fun.true_status(res, _adviser, msg);
      } else {
        var msg = 'Error'
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  add_archive_order: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('order_id').notEmpty().withMessage('order_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }

      var checkorder = await archive_order.findOne({
        where: {
          userId: check_auth.id,
          orderId: requestdata.order_id
        },
        raw: true
      });
      if (checkorder) {
        var msg = 'Order already archive'
        fun.false_status(res, msg);
        return false
      } else {
        var create_archive = await archive_order.create({
          userId: check_auth.id,
          orderId: requestdata.order_id,
          status: 0
        });
        let msg = "order add  successfully";
        var _adviser = {};
        fun.true_status(res, _adviser, msg);
      }

    } catch (error) {
      throw error
    }
  },


  archive_order: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var providerId = check_auth.id
      var get_archive = await archive_order.findAll({
        attributes: ['id', 'userId', 'orderId'],
        where: {
          userId: providerId
        }
      });
      if (get_archive) {
        var order_ids = []
        for (var i in get_archive) {
          order_ids.push(get_archive[i].orderId);
        }
        var get_order_data = await order.findAll({
          attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'date', 'created', 'completeOrderTime'],
          where: {
            [Op.or]: [{ providerId: providerId }, { providerId: 0 }],
            // providerId:providerId,  
            id: order_ids,
          },
          include: [{
            model: order_image,
            required: false
          }, {
            model: category,
            attributes: ['id', 'name', 'description', 'image'],
            required: false
          }, {
            model: provider,
            attributes: ['id', 'name', 'price', 'image'],
            required: false
          }, {
            model: user,
            attributes: ['id', 'name', 'image', 'phone'],
            required: false
          }]
        });


        if (get_order_data) {
          get_order_data = get_order_data.map(value => {
            data = value.toJSON();
            var mg = {};
            if (data.provider == '' || data.provider == null || data.provider == 'null') {
              data.provider = mg
            }
            var tm = new Date(data.createdAt);
            var tim = Math.round(tm.getTime() / 1000);
            data.createdAt = tim;
            return data;
          });
        }

        var get_count = await notification.count({
          where: {
            usertypeId: check_auth.id,
            isRead: 0
          }
        });
        var final_array = {
          notification_count: get_count,
          data: get_order_data
        }
      } else {
        var final_array = {
          notification_count: get_count,
          data: []
        }

      }
      if (final_array) {
        let msg = "Order get successfully";
        fun.true_status(res, final_array, msg);
      } else {
        let msg = "Order get successfully";
        _category = final_array;
        fun.true_status(res, _category, msg);
      }

    } catch (error) {
      throw error;
    }
  },

  remove_archive: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('id').notEmpty().withMessage('id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var delete_image = await archive_order.destroy({
        where: {
          userId: check_auth.id,
          orderId: requestdata.id
        }
      });
      var _rating = {};
      let msg = "Order remove successfully";
      _adviser = _rating;
      fun.true_status(res, _adviser, msg);

    } catch (error) {
      throw error;
    }
  },

  delete_order_provider: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('order_id').notEmpty().withMessage('order_id field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }

      var checkorder = await delete_order.findOne({
        where: {
          userId: check_auth.id,
          orderId: requestdata.order_id
        },
        raw: true
      });
      if (checkorder) {

      } else {
        var create_archive = await delete_order.create({
          userId: check_auth.id,
          orderId: requestdata.order_id,
          status: 0,
          createdAt: fun.Time()
        });

      }
      let msg = "Order delete  successfully";
      var _adviser = {};
      fun.true_status(res, _adviser, msg);

    } catch (error) {
      throw error
    }
  },
  user_accept_reject: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('order_id').notEmpty().withMessage('order_id field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      //console.log(requestdata,"=========");
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      var msg = '';
      var code = 0;
      if (requestdata.type == 1) {
        msg = "Completed successfully";
        code = 21;
      } else if (requestdata.type == 2) {
        msg = "The work does not complete";
        code = 22;
      }
      var get_order_data = await order.findOne({
        attributes: ['id', 'userId', 'status', 'completeOrderTime', 'providerId'],
        where: {
          id: requestdata.order_id,
        },
        include: [{
          model: provider,
          attributes: ['id', 'name', 'deviceToken', 'image', 'phone'],
          required: false
        }, {
          model: user,
          attributes: ['id', 'name', 'deviceToken', 'image', 'phone'],
          required: false
        }]
      });
      if (requestdata.hasOwnProperty('time')) {
        requestdata.time = requestdata.time
      } else {
        requestdata.time = fun.Time
      }
      //console.log(get_order_data,'===============get_order_data')
      if (get_order_data) {
        get_order_data = get_order_data.toJSON();
        if (requestdata.type == 1) {
          completeOrderTime = requestdata.time
          status = 5
        } else {
          completeOrderTime = get_order_data.completeOrderTime
          status = 3
        }
        var update_data = await order.update({
          status: status,
          completeOrderTime: completeOrderTime
        }, {
          where: {
            id: requestdata.order_id
          }
        }
        );
        //  notification ---------------------
        var body = {
          name: check_auth.name,
          id: check_auth.id,
          order_id: get_order_data.id,
          body: get_order_data
        }
        data = {};
        data.type = 1;
        data.model = user
        data.token = get_order_data.provider.deviceToken;
        data.title = check_auth.name + ' order ' + msg;
        data.code = code;
        data.body = body;
        //console.log(data.body.provider,"data.code==============");return;
        if (requestdata.type == 1) {
          data.body.time = requestdata.time;
        }
        var get_bid = await bid.findOne({
          attributes: ['id', 'price'],
          where: {
            orderId: requestdata.order_id,
            providerId: get_order_data.providerId,
            status: 1
          },
          raw: true
        });

        //console.log(get_bid,"========================getbid");

        if (get_bid) {
          // console.log("innnnnnnnnnnnnnnn");return;
          body;
        }
        //console.log(body,"body");return;
        var settings = await setting.findOne();
        settings = settings.toJSON();
        //console.log(data.body.price,"===============data.body.price");return
        var admin_fees = settings.comission;
        //console.log(admin_fees,"admin_fees");return;
        var get_commision = Number(admin_fees / 100) * Number(get_bid.price);
        //  console.log(get_commision,"get_commision");return;
        var last_price = Number(get_commision) + Number(get_bid.price);
        data.body.price = last_price;
        //console.log(data,"==================data");
        var send_push = await fun.PushNotification(data);

        var my_array = {
          userId: check_auth.id,
          usertypeId: get_order_data.provider.id,
          userType: 2,
          notificationCode: data.code,
          orderId: requestdata.order_id,
          message: data.title
        }
        var create_notification = await notification.create(my_array);

        if (requestdata.type == 1) {
          let msg = "Order Completed";
        } else {
          let msg = "Order Rejected";

        }
        var _adviser = {};
        fun.true_status(res, _adviser, msg);

      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error
    }
  },

   extra_work_notification: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      // 0=user,1=provider

      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      if(requestdata.type ==0){
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
    }else{
       var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
    }
      if (check_auth == false) {
        return false;
      }
      var update_notification = await notification.update({
        isRead: 1
      }, {
        where: {
          usertypeId: check_auth.id,
          notificationCode:20
        }
      }
      );

      if(requestdata.type == 0){
      var get_notification = await notification.findAll({
        attributes:['id','usertypeId','userId','orderId','message','checkinId','isCheckin','notificationCode','createdAt'],
        where: {
          usertypeId: check_auth.id,
           notificationCode:20
        },
        include: [{
          model: provider,
          attributes: ['id', 'name', 'image', 'phone'],
          required: false
        }, {
          model: order,
          attributes: ['id', 'status', 'completeOrderTime'],
          required: false,
          
        }],
        order: [['id', 'desc']]
      });
    }else{
      var get_notification = await notification.findAll({
        attributes:['id','usertypeId','userId','orderId','message','checkinId','isCheckin','notificationCode','createdAt'],
        where: {
          usertypeId: check_auth.id,
           notificationCode:20
        },
        include: [{
          model: user,
          attributes: ['id', 'name', 'image', 'phone'],
          required: false
        }, {
          model: order,
          attributes: ['id', 'status', 'completeOrderTime'],
          required: false,
        
        }],
        order: [['id', 'desc']]
      });
    }

      if (get_notification) {
        get_notification = get_notification.map(value => {
          var av = value.toJSON();

          av.user_data = av.provider;
          delete av.provider;
          var tm = new Date(av.createdAt);
          var tim = Math.round(tm.getTime() / 1000);
          av.createdAt = tim;
          if (av.order == null || av.order == 'null' || av.order == '') {
            av.order = {}
          }
          return av;
        });

        for(var i in get_notification){
          if(get_notification[i].order.id !=undefined){
          var get_count =  await rating.count({
            where:{
              user2Id:check_auth.id,
              orderId:get_notification[i].order.id
            },
            raw:true
          });
           get_notification[i].is_rate = get_count;
          }else{
            get_notification[i].is_rate = 0
          }
           var get_extra = await raise_invoice.findOne({
            where:{
              id:get_notification[i].checkinId
            },
            raw:true
          });

          if(get_extra){
            get_notification[i].order.extra_work = get_extra;
          }else{
            get_notification[i].order.extra_work = {}
          }
        }
        let msg = "Get successfully";
        _adviser = get_notification;
        fun.true_status(res, _adviser, msg);
      } else {
        let msg = "Get successfully";
        _adviser = [];
        fun.true_status(res, _adviser, msg);
      }


    } catch (error) {
      throw error;
    }
  },

  ExtraBid: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('orderId').notEmpty().withMessage('orderId field is required');
      req.check('id').notEmpty().withMessage('id field is required');
      req.check('price').notEmpty().withMessage('price field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
      var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      if (check_auth == false) {
        return false;
      }
      requestdata.providerId = check_auth.id;
      var get_order = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'title'],
        where: {
          id: requestdata.orderId
        },
        include: [{
          model: user,
          attributes: ['id', 'name', 'deviceToken'],
          required: false,
        }, {
          model: provider,
          attributes: ['id', 'name'],
          required: false
        }]
      });
      // console.log(get_order,'================'); return;
      if (get_order) {
        get_order = get_order.toJSON();
//  update edit order status --------------------------------------
        var update_order = await raise_invoice.update({
          price:requestdata.price
        },{
          where:{
            id:requestdata.id,
            orderId:requestdata.orderId
          }
        });

        var get_extra_work_order = await raise_invoice.findOne({
          attributes: ['id', 'userId', 'providerId', 'title','description','price'],
          where:{
            id:requestdata.id
          },
          // include:[{
          //   model:extra_work_images,
          //   attributes:['id','image','invoiceId'],
          //   required:false,
          // }],
          raw:true,
          //nest:true
        });
        // console.log(get_order,"==============");
        //var create_invoice = await bid.create(requestdata);
        // create_invoice = create_invoice.toJSON();
        // delete create_invoice.createdAt;
        // delete create_invoice.updatedAt;

        if(get_extra_work_order){
          var get_images = await extra_work_images.findAll({
            attributes:['id','image','thumb','type'],
            where:{
              invoiceId:get_extra_work_order.id
            },
            raw:true
          });
        get_extra_work_order.extra_image =get_images;

        }
        get_order.extra_work = get_extra_work_order;
        var settings = await setting.findOne();
        settings = settings.toJSON();
        //console.log(settings,"===============settings");
        var admin_fees = settings.comission;

        get_order.admin_fees = admin_fees;
        // ----------------send push-------------------
        var _push_data = {};
        var body = {
          id: requestdata.id,
          body: get_order
        }
        _push_data.type = 0;
        _push_data.model = user
        _push_data.token = get_order.user.deviceToken;
        _push_data.title = check_auth.name + " Bid on your Project #" + get_order.title;
        _push_data.code = 20;
        _push_data.body = body;
        var send_push = await fun.PushNotification(_push_data);

        var my_array = {
          userId: check_auth.id,
          usertypeId: get_order.user.id,
          userType: 1,
          notificationCode: _push_data.code,
          orderId: requestdata.orderId,
          message: _push_data.title
        }
        var create_notification = await notification.create(my_array);
      } else {
        var msg = 'invalide order id'
        fun.false_status(res, msg);
      }
      if (update_order) {
        let msg = "Bid Add successfully";
        var _adviser = {};
        fun.true_status(res, _adviser, msg);
      } else {
        var msg = 'Error'
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  get_current_order: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('type').notEmpty().withMessage('type field is required');
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.headers;
      // requestdata.authorization =req.headers.authorization;
      if(requestdata.type ==0){
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
      }else{
        var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization, res);
      }
      if (check_auth == false) {
        return false;
      }

      if(requestdata.type ==0){
        var id ='userId'
      }else{
        var id  ='providerId'
      }
    

      var get_order_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId', 'createdAt', 'title', 'category_id', 'description', 'schedule', 'quote', 'location', 'latitude', 'longitude', 'status', 'completeOrderTime'],
        where: {
          [id]: check_auth.id,
          // status:{
          //   [Op.ne]:[0,2,4,5]
          // }
          status:[1,3]
        },
        include: [{
          model: order_image,
          required: false
        }, {
          model: category,
          attributes: ['id', 'name', 'description', 'image'],
          required: false
        }, {
          model: provider,
          attributes: ['id', 'name', 'price', 'image', 'phone'],
          required: false
        },{
          model:user,
          attributes: ['id', 'name', 'image', 'phone'],
          required:false

        }],
        order: [
          ['id', 'desc']
        ]
      });
        
    //  if(get_order_data == null){
    //      get_order_data ={}
    //  }
      if (get_order_data) {
        for(var i in get_order_data){
          get_order_data[i] =get_order_data[i].toJSON();
          if(get_order_data[i].orderImages.id==null){
            get_order_data[i].orderImages =[];
          }
        }

        let msg = "Order get successfully";
        fun.true_status(res, get_order_data, msg);
      } else {
        let msg = "Invalid Order ";
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },


  cancel_extra_work_order: async function (req, res) {
    try {
      req.check('authorization').notEmpty().withMessage('authorization field is required');
      req.check('extra_order_id').notEmpty().withMessage('extra_order_id field is required');
      req.check('app_type').notEmpty().withMessage('app_type field is required');
      // 0=user,1=provider
      var error = req.validationErrors();
      if (error) {
        res.send(fun.required_data(error));
        return false;
      }
      var requestdata = req.body;
      requestdata.authorization = req.headers.authorization;
       if(requestdata.app_type ==0){
      var check_auth = await fun.CheckAuthKey(requestdata.authorization, res);
       }else{
       var check_auth = await fun.CheckAuthKeyProvider(requestdata.authorization,res);
       }
      if (check_auth == false) {
        return false;
      }
      var get_extra_work_order = await raise_invoice.findOne({
        where:{
          id:requestdata.extra_order_id
        },
        raw:true
      });

        if(requestdata.app_type==0){
        var get_provider = await provider.findOne({
          attributes:['id','name','image','deviceToken'],
          where: {
            id: get_extra_work_order.providerId
          },
          raw: true
        });
      }else{
        var get_provider = await user.findOne({
          attributes:['id','name','image','deviceToken'],
          where: {
            id: get_extra_work_order.userId
          },
          raw: true
        });
      }
    
      // console.log(get_provider,"===========================get_provider")
        var get_extra_images = await  extra_work_images.findAll({
          attributes:['id','image','thumb','type'],
          where:{
            invoiceId: requestdata.extra_order_id
          },
          raw:true
        });

        // ----------------send push-------------------
        get_extra_work_order.extra_image = get_extra_images;
        var _push_data = {};
        if(requestdata.app_type ==0){
          _push_data.code = 25;
          _push_data.model = provider
          _push_data.type = 1;
        }else{
          _push_data.code = 25;
          _push_data.model = user
          _push_data.type = 0;
        }

       // define top
        _push_data.token = get_provider.deviceToken;
        _push_data.title = check_auth.name + " Cancel Extra work order #" + get_extra_work_order.title ;
       // _push_data.code = 20;
        delete get_provider.deviceToken;
        var body = {
          id: requestdata.extra_order_id,
          body: get_extra_work_order
        }
        _push_data.body = body;
        var send_push = await fun.PushNotification(_push_data);
      if (get_extra_work_order) {
        let msg = "Extra Work Order cancel successfully";
        var _adviser = {};
        fun.true_status(res, _adviser, msg);
      } else {
        var msg = 'Error'
        fun.false_status(res, msg);
      }

    } catch (error) {
      throw error;
    }
  },







}