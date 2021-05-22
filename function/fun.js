const db = require('../models');
const sequelize = require('sequelize');
const database = require('../db/db');
const helper = require('../config/helper');
const jsonData = require('../config/jsonData');
const contant = require('../constant');
const crypto = require('crypto');
/* console.log(jsonData,"jsonData========================"); */
const Op = sequelize.Op;
const accountSid = 'ACb33722fac283ef6988201031b94573df';
const authToken = '71d16c76acd6a71004b106aa98c8c0a3';
const client = require('twilio')(accountSid, authToken)
var android_server_key ='AAAAMlcERXA:APA91bFmmnd16wyXF7GEdF87kLUfdSh879T0k-H9UgzlYH3vV1oleT40DvPblpOyA6o7Cw_vK9HsNyA3AyqHbOxoXNBKsUXeoeDefxlnypFq5g4keQ5dstX7t45qbtC2yOgejOuWFK9c';
var nodemailer = require('nodemailer');
var path = require('path');
var uuid = require('uuid');
var moment = require('moment');
var FCM = require('fcm-node');
var apn = require('apn'); 
const user = db.user
const category = db.category
const subCategory = db.subCategory
const content = db.content
const order = db.order
const bids = db.bids
const availability =db.availability;
const provider = db.provider
const orderImages = db.orderImages
const favourite = db.favourite
const rating = db.rating
const orderCategory =db.orderCategory;
const orderSubcategory =db.orderSubcategory;
const portfolio =db.providerPortfolio;
const provider_language =db.providerLanguage;
const certificate =db.certificates;
const dispute =db.dispute
const favJobs =db.favJobs;

const providerIdentity=db.providerIdentity

const providerSubCategories = db.providerSubCategories
const providerCategory = db.providerCategory
const notification = db.notification
const additionalWork = db.additionalWork
const tip = db.tip
const setting = db.setting
const invoice = db.invoice
const userCards = db.userCards
const faqs =  db.faqs;
const language =db.languages

provider.hasMany(providerCategory, {
   foreignKey: 'providerId'
});

category.hasMany(providerSubCategories, {
  foreignKey: 'categoryId'
});

providerCategory.belongsTo(category, {
  foreignKey: 'categoryId'
});

category.hasMany(subCategory, {
  // foreignKey: 'categoryId'
});
order.hasMany(orderCategory, {
   foreignKey: 'orderId'
});
subCategory.belongsTo(category, {
  foreignKey: 'categoryId'
});

orderCategory.belongsTo(category, {
  foreignKey: 'categoryId'
});


orderSubcategory.belongsTo(subCategory, {
  foreignKey: 'subcategoryId'
});
order.hasMany(orderSubcategory, {
  foreignKey: 'orderId'

});
order.belongsTo(category, {
  foreignKey: 'categoryId'
});
order.belongsTo(user, {
  foreignKey: 'userId'
});
order.belongsTo(subCategory, {
  foreignKey: 'subCategoryId'
});
bids.belongsTo(provider, {
  foreignKey: 'providerId'
});
favourite.belongsTo(provider, {
  foreignKey: 'providerId'
});
favourite.belongsTo(user, {
  foreignKey: 'userId'
});
bids.belongsTo(rating, {
  foreignKey: 'providerId'
});
order.hasMany(orderImages, {
  foreignKey: 'orderId'
});
order.belongsTo(bids, {
  foreignKey: 'orderId'
});
provider.belongsTo(category, {
  foreignKey: 'categoryId'
});
providerSubCategories.belongsTo(subCategory, {
  foreignKey: 'subCategoryId'
});
providerSubCategories.hasMany(subCategory, {
  foreignKey: 'subCategoryId'
});
providerSubCategories.hasMany(category, {
  foreignKey: 'categoryId'
});
rating.belongsTo(user, {
  foreignKey: 'userBy'
});
notification.belongsTo(user, {
  foreignKey: 'userId'
});
notification.belongsTo(provider, {
  foreignKey: 'userId'
});
order.hasMany(additionalWork, {
  foreignKey: 'orderId'
});
provider.hasMany(portfolio, {
  foreignKey: 'providerId'
});
provider.hasMany(provider_language, {
  foreignKey: 'providerId'
});
provider.hasMany(certificate, {
  foreignKey: 'providerId'
});
provider.hasMany(availability, {
  as:'business_hours',
  foreignKey: 'providerId'
});
favJobs.belongsTo(order,{
  foreignKey:'jobId'
})
// var options = {
//   // token: {
//   //   key: __dirname + "/AuthKey_768HC567HA.p8",
//   //   keyId: "768HC567HA",
//   //   teamId: "UL6P4CWL4N"
//   // },
//   cert: __dirname + "/CertificatesHoneyDoProvider.pem",
//    key: __dirname + "/CertificatesHoneyDoProvider.pem",
//     passphrase:"",
//    // production: true /
//   production: false
// };
//  //console.log(options,"options") 

// //let bundel_id = 'com.honeyDo.user';
// var apnProvider = new apn.Provider(options);

module.exports = {

  create_time_stamp: async function () {

    let current_time = Math.round(new Date().getTime() / 1000)

    return current_time;
  },

  single_image_upload: function (data, folder) {
    let image = data;
    image.mv(process.cwd() + '/public/' + folder + '/' + image.name, function (err) {
      if (err) {
        return res.status(500).send(err);
      }

    });
    return image.name;

  },

  unlink_file: function(img_path,folder){
    fs.unlink(process.cwd() + '/public/' + folder + '/' + img_path,function(err){
      if(err) return false;
      console.log('file deleted successfully');
      return true;
 });

  },

  // send_push_notification_normal: function (message, device_token, device_type, type, order_id,push_type) {
  //   if (type == 0) {
  //     bundel_id = 'com.honeydo.provider';
  //   } else {
  //     bundel_id = 'com.honeyDo.user';
  //   }
  //   if (device_token != '') {
  //     var new_message = {
  //       to: '1d9d3d5c273aaef0d595d892a45dfc7a2034aa809dbecbde6de0673b85243683',

  //       notification: {
  //         title: 'Honey Do',
  //         body: message,
  //         sound: "default",

  //       },
  //       data: {
  //         body: message,
  //         tag: order_id,
  //         type: push_type,
  //         my_another_key: 'my another value'
  //       }
  //     };
  //     if (device_type == 1) {
  //       //console.log("if androei")
  //       var serverKey = 'AAAAr_0cBpM:APA91bEgUVR-oU-hioSYvxHZN99ghvS5S0TT3hQqE9vPvA67GYiamFPbyMZckDKoHQGcMkgSQyooNiY3B_0t84NA7JQttCQdf4pfUzVDul4nEugKpVprIUFbrpNVkvolzv6MSoent7g3';
  //       var fcm = new FCM(serverKey);

  //       fcm.send(new_message, function (err, response) {
  //         if (err) {
  //           console.log("Something has gone wrong!");
  //           console.log(new_message, "new_message");
  //         } else {
  //           console.log(new_message, "new_message");
  //           console.log("Successfully sent with response: ", response);
  //         }
  //       });
  //     } else {

  //       console.log("else aple")
  //       var note = new apn.Notification();
  //       // note.badge = check_count_data;
  //       note.sound = "ping.aiff";
  //       note.alert = message;
  //       note.payload = new_message;
  //       note.topic = bundel_id;
  //       apnProvider.send(note, '1d9d3d5c273aaef0d595d892a45dfc7a2034aa809dbecbde6de0673b85243683').then((result) => {
  //         console.log(result, "new_message")
  //       });
  //     }
  //   }

  // },
  send_push_notification_normal: function (message, device_token, device_type, type, order_id,push_type) {
   // console.log(message,device_token,device_type,type,order_id,push_type);return;
    if (type == 0) {
      var options = {
        
        cert: __dirname + "/CertificatesHoneyDoProvider.pem",
         key: __dirname + "/CertificatesHoneyDoProvider.pem",
          passphrase:"",
        production: false
      };
      
      bundel_id = 'com.honeydo.provider';
    } else {
      var options = {
        
        cert: __dirname + "/CertificatesHoneyDoUser.pem",
         key: __dirname + "/CertificatesHoneyDoUser.pem",
          passphrase:"",
        production: false
      };
      bundel_id = 'com.honeyDo.user';
    }
    var apnProvider = new apn.Provider(options);
    if (device_token != '') {
      var new_message = {
        to: device_token,

        notification: {
          title: 'Honey Do',
          body: message,
          sound: "default",

        },
        data: {
          body: message,
          tag: order_id,
          type: push_type,
          my_another_key: 'my another value'
        }
      };
      if (device_type == 1) {
        //console.log("if androei")
        var serverKey = 'AAAAr_0cBpM:APA91bEgUVR-oU-hioSYvxHZN99ghvS5S0TT3hQqE9vPvA67GYiamFPbyMZckDKoHQGcMkgSQyooNiY3B_0t84NA7JQttCQdf4pfUzVDul4nEugKpVprIUFbrpNVkvolzv6MSoent7g3';
        var fcm = new FCM(serverKey);

        fcm.send(new_message, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!");
            console.log(new_message, "new_message");
          } else {
            console.log(new_message, "new_message");
            console.log("Successfully sent with response: ", response);
          }
        });
      } else {

        console.log("else aple")
        var note = new apn.Notification();
        // note.badge = check_count_data;
        note.sound = "ping.aiff";
        note.alert = message;
        note.payload = new_message;
        note.topic = bundel_id;
        apnProvider.send(note,device_token).then((result) => {
          console.log(result, "new_message")
        });
      }
    }

  },
  send_push_notification: function (_functions) {
   // console.log(_functions.body.user_name,"_functigggggggggggggggggons");
    if (_functions.body.type == 0) {
      var options = {
        
         cert: __dirname + "/CertificatesHoneyDoProvider.pem",
         key: __dirname + "/CertificatesHoneyDoProvider.pem",
         passphrase:"",
        production: false
      };
      bundel_id = 'com.honeydo.provider';
    } else {
      //console.log("in user")
      var options = {
        
        cert: __dirname + "/CertificatesHoneyDoUser.pem",
         key: __dirname + "/CertificatesHoneyDoUser.pem",
        passphrase:"",
        production: false
      };
      bundel_id = 'com.honeyDo.user';
    }
    var apnProvider = new apn.Provider(options);
    if (_functions.token != '') {
      var new_message = {
        to: _functions.token,

        // notification: {
        //   title: 'Omniserve',
        //   body: _functions.body.user_name + ' Sent You a Message',
        //   sound: "default",
        //   subtitle:'hello' 

        // },

        data: {
          body: _functions.body.user_name + ' Sent You a Message',
          tag: _functions,
          type: 1,
          my_another_key: 'my another value'
        }
      };
      if (_functions.deviceType == 1) {
        console.log("if androei")
        var serverKey = 'AAAAr_0cBpM:APA91bEgUVR-oU-hioSYvxHZN99ghvS5S0TT3hQqE9vPvA67GYiamFPbyMZckDKoHQGcMkgSQyooNiY3B_0t84NA7JQttCQdf4pfUzVDul4nEugKpVprIUFbrpNVkvolzv6MSoent7g3';
        var fcm = new FCM(serverKey);

        fcm.send(new_message, function (err, response) {
          if (err) {
            console.log("Something has gone wrong!");
            console.log(new_message, "new_message");
          } else {
            console.log(new_message, "new_message");
            console.log("Successfully sent with response: ", response);
          }
        });
      } else {

        console.log("else aple")
        var note = new apn.Notification();
        // note.badge = check_count_data;
        note.sound = "ping.aiff";
        // note.alert = _functions.body.user_name + ' Sent You a Message';
        note.title = _functions.body.user_name + ' Sent You a Message'
        note.body = _functions.body.message
        note.payload = new_message;
        note.topic = bundel_id;
        apnProvider.send(note, _functions.token).then((result) => {
          console.log(result, "new_message")
        });
      }
    }
  },


  convert_password_to_sha1: async function (reqdata) {

    /* console.log(reqdata,"reqdata") */
    const converted_password = crypto.createHash('sha1').update(reqdata.password).digest('hex');

    /* console.log(converted_password,"converted_password");return; */

    return converted_password;
  },
  check_auth_key: async function (auth_data) {
    check_auth_data = await user.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'image', 'latitude', 'longitude', 'countryCode', 'location'],
      where: {
        authKey: auth_data.auth_key
      }

    });
    /* console.log(check_auth_data,"check_auth_data") */
    return check_auth_data;

  },

  get_user_by_id: async function (auth_data) {
    check_auth_data = await user.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'image', 'latitude', 'longitude', 'countryCode', 'location'],
      where: {
        id: auth_data.userId
      }

    });
    /* console.log(check_auth_data,"check_auth_data") */
    return check_auth_data;

  },


  twillio_send_otp: async function (twillio_data, get_data_otp, type_data) {

    if (type_data == 1) {

      check_phone = await provider.findOne({
        attributes: ['id', 'phone'],
        where: {
          phone: twillio_data.phone,

        }
      });
      /*  console.log(check_phone,"check_phone") */
    } else {
      check_phone = await user.findOne({
        attributes: ['id', 'phone'],
        where: {
          phone: twillio_data.phone,

        }
      });
    }
    /* console.log(check_phone,"check_phone") */
    if (check_phone) {

      return;
    } else {

      var data_twl = await client.messages
        .create({

          body: 'Your One time password is ' + get_data_otp,
          from: '+12567334806',
          to: twillio_data.phone
        })
        .then(message => console.log(message.sid));

      /* console.log(data_twl, "data_twl"); */

      return data_twl;
    }

  },
  generate_one_time_password: async function (get_otp_data) {

    var generate_otp = Math.floor(1000 + Math.random() * 9000);
    /* console.log(generate_otp,"generate_otp"); */
    return generate_otp

  },
  generate_auth_key: async function (get_auth_key) {

    let auth_create = crypto.randomBytes(25).toString('hex');

    return auth_create;
  },
  signup_user: async function (data, password_details, req, res) {

    /* console.log(data.email,"data"); */
    var get_email = await user.findOne({
      attributes: ['id', 'email'],
      where: {
        email: data.email,

      }

    });
    if (get_email) {
      let msg = 'Email Already Exist ';
      jsonData.already_exist(res, msg)
      return false;
    }

    get_phone = await user.findOne({
      attributes: ['id', 'phone', 'countryCode'],
      where: {
        phone: data.phone,
        countryCode: data.country_code
      }
    })
    if (get_phone) {
      let msg = 'Phone No. Already Exist ';
      jsonData.already_exist(res, msg)
      return false;
    }

    //  console.log(get_email,"get_email");return;

    create_signup_user = await user.create({

      email: data.email,
      phone: data.phone,
      password: password_details,
      name:data.first_name + ' ' + data.last_name,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      countryCode: data.country_code,
      ngo:data.ngo,
      /* gender: data.gender,
      age: data.age, */
      location: data.address,
      description: data.description,
      // otp: get_data_otp,
      latitude: data.latitude,
      longitude: data.longitude,
      deviceType: data.device_type,
      deviceToken: data.device_token,
      socialId:data.social_id,
      socialType:data.social_type,

      authKey: await this.generate_auth_key(),
      // isVerified: 0,

    });
    /*   console.log(create_signup_user,"create_signup_user"); */

    get_signup_data = await user.findOne({
      attributes: ['id', 'firstName', 'lastName', 'image', 'phone', 'countryCode', 'authKey', 'description', 'email'],
      where: {
        id: create_signup_user.dataValues.id
      }
    });

    return get_signup_data;

  },
  user_login: async function (data, convert_data, req, res) {
    /* console.log(convert_data,"==========convert_data");return false; */

    const update_details = await user.update({
      authKey: await this.generate_auth_key(),
      deviceType: data.device_type,
      deviceToken: data.device_token,
      latitude: data.latitude,
      longitude: data.longitude,
      socialId:data.social_id
    },
      {
        where: {

          email: data.email,
          password: convert_data

        }
      }
    );
    /* console.log(update_details,"update_details");return; */
    check_email_password = await user.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'image', 'authKey', 'phone', 'countryCode', 'description'],
      where: {
        email: data.email,
        password: convert_data
      }

    });
    /* console.log(check_email_password, "check_email_password");return; */

    return check_email_password;
  },
  all_content: async function (get_content) {
    if (get_content.type == 1) {
      get_content = await content.findOne({
        attributes: ['id', 'term']

      });
    } else if (get_content.type == 2) {
      get_content = await content.findOne({
        attributes: ['id', 'privacy']

      });
    } else {
      get_content = await content.findOne({
        attributes: ['id', 'about']

      });
    }

    return get_content;
  },

  logout_user: async function (get_logout_data) {

    const update_auth = await user.update({
      authKey: '',

    },
      {
        where: {
          id: get_logout_data.user_id

        }
      }
    );

    return update_auth;
  },
  change_password: async function (get_change_password, req, res, check_auth) {

    check_password = await user.findOne({
      attributes: ['id', 'password'],
      where: {
        id: check_auth.dataValues.id
      }
    })

    const converted_password = crypto.createHash('sha1').update(get_change_password.old_password).digest('hex');

    if (converted_password == check_password.dataValues.password) {

      const new_password = crypto.createHash('sha1').update(get_change_password.new_password).digest('hex');

      const update_details = await user.update({
        password: new_password,

      },
        {
          where: {

            id: check_auth.dataValues.id

          }
        }
      );
      return update_details;

    } else {

      let msg = 'Old Password Does Not Matches';
      jsonData.wrong_status(res, msg)

    }
  },
  verify_phone_number: async function (get_data_no, check_auth, req, res) {
    /* console.log("innnnnnnnnnnnnnnnnnnnnnnnnnnnnn") */
    get_phone_data = await user.findOne({
      attributes: ['id', 'otp'],
      where: {
        otp: get_data_no.otp,
        id: check_auth.dataValues.id
      }
    });

    /* console.log(get_phone_data,"get_phone_data"); */
    // if (get_phone_data) {
    if (get_data_no.otp == 1111) {

      const update_details = await user.update({
        isVerified: 1,

      },
        {
          where: {

            otp: get_data_no.otp,
            id: check_auth.dataValues.id

          }
        }
      );
      return update_details;

    } else {
      let msg = 'Otp Does Not Matched';
      jsonData.wrong_status(res, msg)
    }
  },
  social_login: async function (get_social_data) {
    /*  console.log(get_social_data,"get_social_data") */
    get_social_id = await user.findOne({
      attributes: ['id', 'socialId'],
      where: {
        socialId: get_social_data.social_id
      }
    });

    if (get_social_id) {

      const update_social_details = await user.update({
        deviceToken: get_social_data.device_token,
        deviceType: get_social_data.device_type,
        authKey: await this.generate_auth_key()

      },
        {
          where: {

            socialId: get_social_data.social_id

          }
        }
      );
      get_user_details = await user.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'image', 'authKey', 'socialId'],
      where: {
        socialId: get_social_data.social_id
      }

    });
     return get_user_details

    }else{
      get_social_id
    }

    return get_social_id;
  },
  notification_status: async function (get_data, check_auth) {
    const update_notification_status = await user.update({
      notificationStatus: get_data.status

    },
      {
        where: {

          id: check_auth.dataValues.id
        }
      }
    );

    return update_notification_status;
  },

  get_categories: async function (requestdata) {
    var condition={}
    condition.status=1
    if(requestdata.type){
      condition.type=requestdata.type
    }
    if(requestdata.search){
      var ab ={
        [Op.like]:'%'+requestdata.search+'%'
      }
      condition.name=ab
    }
    get_category = await category.findAll({
      attributes: ['id', 'name', 'image', 'description'],
      where:condition,
      order: [
        ['name', 'asc']
      ],
      include:[
        {
          model:subCategory,
          attributes:['id','categoryId','name','image'],
          required:false
        }
      ]
    });
    if (get_category) {
      get_category = get_category.map(value => {
        return value.toJSON();
      });
    }
    /*  console.log(get_category,"get_category") */
    return get_category;
  },

  /***************  FAQs *********************/ 

  get_faqs: async function () {
    var get_faqs = await faqs.findAll({
      attributes: ['id', 'question', 'answer'],
      order: [
        ['id', 'desc']
      ]
    });
    if (get_faqs) {
      get_faqs = get_faqs.map(value => {
        return value.toJSON();
      });
    }
    /*  console.log(get_category,"get_category") */
    return get_faqs;
  },
  get_card:async function(check_auth){
    var get_card_details=await userCards.findAll({
      //attributes: ['id', 'name', 'image', 'description'],
      order:[
        ['id','desc']
      ],
      where:{
        userId:check_auth.dataValues.id
      }
    });
    return get_card_details;

  },
  get_sub_categories_data: async function (get_data) {
    try {

      get_subcate = await subCategory.findAll({
        attributes: ['id', 'categoryId', 'name', 'description', 'image'],
        include: [{
          attributes: ['id', 'name', 'description', 'image'],
          model: category,
          required: false
        }],
        where: {
          categoryId: get_data.category_id
        }
      });

      if (get_subcate) {
        get_subcate = get_subcate.map(value => {
          return value.toJSON();
        });
      }

      for (var i in get_subcate) {
        delete get_subcate[i].category
      }

      return get_subcate;

    } catch (error) {
      throw error
    }
  },
  logout: async function (logout_data) {

    const update_auth_key = await user.update({
      authKey: '',
      deviceToken: ''

    },
      {
        where: {

          id: logout_data.user_id
        }
      }
    );

    return update_auth_key;

  },

  get_user_profile: async function (get_profile_data) {
  var   get_user_data = await user.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email', 'image', 'phone','countryCode','description','location','latitude','longitude','authKey','age','dob','city','state'],
      where: {
        id: get_profile_data.user_id
      }
    });

    return get_user_data;
  },

  your_bookings: async function (get_order_data, check_auth) {

    get_booking_data = await order.findAll({

      include: [{
        attributes: ['id', 'name', 'image'],
        model: user,
        require: false
      }],
      order: [
        ['id', 'desc'],
      ],
      where: {
        userId: check_auth.dataValues.id,
        status: {
          [Op.ne]: 2,
        },
      }
    });

    if (get_booking_data) {
      get_booking_data = get_booking_data.map(value => {
        return value.toJSON();
      });
    }


    /* console.log(get_booking_data, "get_booking_data"); return; */
    return get_booking_data;

  },

  current_orders: async function (get_data, check_auth) {

    get_current_data = await order.findAll({
      include: [{
        attributes: ['id', 'name', 'image'],
        model: user,
        require: false
      }],
      order: [
        ['id', 'desc'],
      ],
      where: {
        userId: check_auth.dataValues.id,
        status: 3
      }
    });

    if (get_current_data) {
      get_current_data = get_current_data.map(value => {
        return value.toJSON();
      });
    }

    return get_current_data;
  },
  get_near_users: async function (get_data, check_auth) {

    get_nearby_user = await database.query("SELECT provider.id  as provider_id, provider.name,provider.image,provider.description,provider.latitude,provider.longitude, (select count(id) from favourite where user_id='" + check_auth.dataValues.id + "' and provider_id=provider.id) as like_status, (select round(ifnull(avg(ratings),0),0) from ratings where user2_id=provider.id and type=1) as average_rating, ifnull(ROUND((3959 * acos( cos( radians('" + check_auth.dataValues.latitude + "') ) * cos( radians( provider.latitude ) ) * cos( radians( provider.longitude ) - radians('" + check_auth.dataValues.longitude + "') ) + sin( radians('" + check_auth.dataValues.latitude + "') ) * sin( radians( provider.latitude ) ) ) )),0) as distance  FROM `provider` left join provider_subCategories on provider_subCategories.provider_id=provider.id  where provider_subCategories.sub_category_id IN (" + get_data.sub_category_id + ") group by provider.id having distance <=50  order by provider.id desc", {

      model: order,
      model: provider,
      mapToModel: true,
      type: database.QueryTypes.SELECT
    });
    if (get_nearby_user) {
      get_nearby_user = get_nearby_user.map(value => {
        return value.toJSON();
      });
    }

    return get_nearby_user;

  },

  add_to_favourite_provider: async function (get_data, check_auth) {

    if (get_data.status == 1) {
      var check_already_fav = await favourite.findOne({
        where:{
          userId: check_auth.dataValues.id,
          providerId: get_data.provider_id,
          status: 1,
          type:0
        },
        row:true
      });
      var add_to_favourite =check_already_fav;
      if(check_already_fav ==null){
      add_to_favourite = await favourite.create({
        userId: check_auth.dataValues.id,
        providerId: get_data.provider_id,
        status: 1,
        type:0
      });
    }

      return add_to_favourite;
    } else {

      delete_favourite = await favourite.destroy({
        where: {

          userId: check_auth.dataValues.id,
          providerId: get_data.provider_id,
          status: 1,
          type:0

        }
      })
      return delete_favourite;
    }

  },

  
  add_to_favourite_user: async function (get_data, check_auth) {

    if (get_data.status == 1) {
      var check_already_fav = await favJobs.findOne({
        where:{
          jobId: get_data.job_id,
          providerId: check_auth.dataValues.id,
         
        },
        row:true
      });
      var add_to_favourite =check_already_fav;
      if(check_already_fav ==null){
      add_to_favourite = await favJobs.create({
        jobId: get_data.job_id,
        providerId: check_auth.dataValues.id,
        status: 1,
        type:1
      });
    }

      return add_to_favourite;
    } else {

      delete_favourite = await favJobs.destroy({
        where: {
          jobId: get_data.job_id,
          providerId: check_auth.dataValues.id

        }
      })
      return delete_favourite;
    }

  },

  apply_booking: async function (get_data, check_auth) {

    add_time = await order.create({
      userId: check_auth.dataValues.id,
      providerId: get_data.provider_id,
      date: get_data.date,
      timeSlotId: get_data.slot_id,
      status: 0,

    });

    add_notification = await notification.create({
      userType: 2,
      senderId: check_auth.dataValues.id,
      recieverId: get_data.provider_id,
      status: 1,
      message: check_auth.dataValues.name + ' sent You a Request',
      createdAt: await this.create_time_stamp(),
      updatedAt: await this.create_time_stamp(),
    });

    return add_time;

  },
  get_slots_user: async function (get_data, check_auth) {

    get_slots = await availability.findAll({
      where: {
        providerId: get_data.provider_id
      }

    });

    if (get_slots) {
      get_slots = get_slots.map(value => {
        return value.toJSON();
      });
    }
    return get_slots;

  },

  get_notification_list: async function (get_data, check_auth) {

    get_data = await notification.findAll({
      attributes: ['id', 'senderId', 'recieverId', 'message', 'createdAt'],
      include: [{

        attributes: ['id', 'name', 'image', 'description'],
        model: provider,
        required: false
      }],
      where: {
        recieverId: check_auth.dataValues.id,
        userType: 1
      }
    });

    if (get_data) {
      get_data = get_data.map(value => {
        return value.toJSON();
      });
    }
    return get_data;
    /*  console.log(get_data,"get_data");return; */

  },

  make_user_payment: async function (get_payment_data, check_auth) {


  },
  add_new_card: async function (cardNumber, check_auth) {

    add_card = await user_cards.create({
      cardNumber: cardNumber.card_number,
      userId: check_auth.dataValues.id,
      expYear: cardNumber.expiry_date

    });

    return add_card;

  },

  add_ratings: async function (get_data, check_auth) {

    add_ratings_data = await ratings.create({
      userId: check_auth.dataValues.id,
      user2Id: get_data.user_id,
      ratings: get_data.rating,
      comment: get_data.comment,
      type: 1

    });
    return add_ratings_data;

  },
  card_listings: async function (get_card_data, check_auth) {
    get_card = await user_cards.findAll({

      where: {
        userId: check_auth.dataValues.id
      }
    });
    get_card = get_card.map(value => {
      return value.toJSON();
    });

    return get_card;
  },
  card_default: async function (get_data, check_auth) {

    const update_previous_card = await user_cards.update({
      status: 0

    },
      {
        where: {

          userId: check_auth.dataValues.id,

        }
      }
    );

    const update_next_card = await user_cards.update({
      status: 1

    },
      {
        where: {

          userId: check_auth.dataValues.id,
          id: get_data.card_id

        }
      }
    );
    return update_next_card;
  },

  email_password_for_gmail: async function () {

    let data_email = {

      email_data: 'chandansmtp@gmail.com',
      password_data: 'Chandan@smtp$(&*'
    }
    return data_email;

  },

  url_path: async function () {

    let url_path = 'http://3.17.254.50:4999'

    return url_path;
  },

  send_email: async function (get_param, req, res, user_type) {
    if (user_type == 1) {
      /* console.log(get_param,"get_param") */
      data = await provider.findOne({
        where: {

          email: get_param.email,

        }
      });
      /*  console.log(data) */
    } else {
      // console.log("else innnnnnnn")
      data = await user.findOne({
        where: {

          email: get_param.email,

        }
      });
      // console.log(data,"data");return;
    }
    if (data) {

      var email_password_get = await this.email_password_for_gmail();

      var url_data = await this.url_path();

      let auth_data = await this.generate_auth_key();
      /* console.log(auth_data,"auth_data"); */
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email_password_get.email_data,
          pass: email_password_get.password_data
        }
      });
      if (user_type == 1) {
        var mailOptions = {

          from: email_password_get.email_data,
          to: get_param.email,
          subject: 'Valeyou Forgot Password',
          html: 'Click here for change password <a href="' +
            url_data +
            "/apis/url_idd/" +
            auth_data +
            '"> Click</a>'
        };
      } else {
        //  console.log(email_password_get.email_data);
        var mailOptions = {

          from: email_password_get.email_data,
          to: get_param.email,
          subject: 'Valeyou Forgot Password',
          text: 'Click here for change password <a href="' +
            url_data +
            "/apis/url_id/" +
            auth_data +
            '"> Click</a>'
        };
        // console.log(mailOptions.text,"text");
      }

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      if (user_type == 1) {

        save = await provider.update({
          forgotPassword: auth_data,
        },
          {
            where: {

              id: data.dataValues.id

            }
          }
        );
      } else {
        save = await user.update({
          forgotPassword: auth_data,
        },
          {
            where: {

              id: data.dataValues.id

            }
          }
        );
      }

      return transporter;
    } else {

      let msg = 'Email Not Registered';
      jsonData.wrong_status(res, msg)

    }

  },
  url_id_data: async function (req, res) {

    let get_password_data = await user.findOne({

      where: {
        forgotPassword: req.params.id
      }

    });
    // console.log(get_password_data,"get_password_data");return;

    if (get_password_data) {

      res.render('reset_password_user',
        {
          msg: req.flash('msg'),
          response: get_password_data,
        });

    } else {
      res.status(403).send("Link has been expired!");
    }
    return get_password_data;
  },
  url_id_provider_data: async function (req, res) {

    let get_password_data = await provider.findOne({

      where: {
        forgotPassword: req.params.id
      }

    });

    if (get_password_data) {

      res.render('provider_reset_password',
        {
          msg: req.flash('msg'),
          response: get_password_data,
        });

    } else {
      res.status(403).send("Link has been expired!");
    }
    return get_password_data;
  },

  reset_password_data: async function (req, res, new_data, update_password) {
    //  console.log(update_password,"update_password");
    const save = await user.update({
      password: update_password,
      forgotPassword:''
    },
      {
        where: {

          id: new_data.hash
        }
      }
    );
    console.log(save, "save");
    if (save) {
      res.render("success_page", { msg: "Password Changed successfully" });
    } else {
      res.render("success_page", { msg: "Invalid user" });
    }
  },
  reset_password_provider_data: async function (req, res, new_data, update_password) {

    const save = await provider.update({
      password: update_password,
      forgotPassword:''
    },
      {
        where: {

          id: new_data.hash
        }
      }
    );
    if (save) {
      res.render("success_page", { msg: "Password Changed successfully" });
    } else {
      res.render("success_page", { msg: "Invalid user" });
    }
  },


  transaction_id: async function () {

    let transaction_number = Math.floor(Math.random() * 24747826746737873767)

    return transaction_number;

  },
  file_upload: async function (get_image_data) {

    let image = get_image_data
    //  console.log(image,"image")
    if (Array.isArray(image) === true) {
      temp_array = [];
      await Promise.all(image.map(async c => {
        var extension = path.extname(c.name);
        var fileimage = uuid() + extension;
        c.mv(process.cwd() + '/public/upload/' + fileimage, function (err) {
          if (err)
            console.log(err);
        });
        temp_array.push(fileimage)
      }));
      return temp_array
    } else {
      var extension = path.extname(image.name);
      var fileimage = uuid() + extension;
      image.mv(process.cwd() + '/public/upload/' + fileimage, function (err) {
        if (err)
          console.log(err);
      });
      return fileimage;

    }
  },
  fullurl:function(req){
    return url.format({
       // protocol: req.protocol,
        host: req.get('host'),
      //  pathname: req.originalUrl
      });
},
  image_url: async function () {

    let url_image = 'http://localhost:4111/upload'
    // fullurl()

  },
  user_accept_reject_request: async function (get_data, check_auth) {
    try {

      const update_bid = await bids.update({
        status: get_data.type

      },
        {
          where: {

            orderId: get_data.order_id,
            providerId: get_data.provider_id

          }
        }
      );
      if (get_data.type == 1) {

        const update_order_id = await order.update({
          status: 1,
          providerId:get_data.provider_id

        },
          {
            where: {

              id: get_data.order_id,
              userId: check_auth.dataValues.id

            }
          }
        );
      }

      return update_bid

    } catch (error) {
      throw error
    }
  },
  user_invoice: async function (get_data, check_auth) {
    try {
      get_invoice = await bids.findOne({
        attributes: ['id', 'providerId', 'orderId', 'price'],

        where: {
          orderId: get_data.order_id,
          providerId: get_data.provider_id
        }
      })

      get_setting = await setting.findOne({
        attributes: ['id', 'comission', 'tax']
      })

      get_job_data = await order.findOne({
        attributes: ['id', 'date','providerId','userId', 'description', 'location', 'status','date','time','type'],
        include: [
          {
            model: orderCategory,
            attributes:['id','categoryId'],
            required: false,
            include:[{
              model:category,
              attributes:['id','name','image'],
              required:false
            }]
          },
          {
            model: orderImages,
            required: false
          },
        ],
        where: {
          id: get_data.order_id
        }
      });

      if(get_job_data){
        get_job_data =get_job_data.toJSON();
      }

      // console.log(get_job_data,"================get_job_data")
    
        for( var i in get_job_data.orderCategories){
          var get_subcategory = await orderSubcategory.findAll({
            attributes:['id','categoryId'],
            where:{
              categoryId:get_job_data.orderCategories[i].categoryId
            },
            include:[{
              model:subCategory,
              attributes:['id','name','image'],
              required:false
            }],
           
          });
    
          get_job_data.orderCategories[i].subCategory = get_subcategory;
    
        }
        var comission = (Number(get_invoice.dataValues.price) * Number(get_setting.dataValues.comission)/100).toFixed() ;
      let total = Number(get_invoice.dataValues.price) + Number(comission)+Number(get_setting.dataValues.tax)
      get_invoice.dataValues.serviceFee = Number(comission);
      get_invoice.dataValues.tax = Number(get_setting.dataValues.tax);
      get_invoice.dataValues.totalAmount = total
      get_invoice.dataValues.totalAmount = total
      get_invoice.dataValues.order_detail =get_job_data;
      
      return get_invoice
    } catch (error) {
      throw error
    }
  },
  // ========= provider apis start==================


  check_provider_auth_key: async function (auth_data) {
    check_auth_data = await provider.findOne({
      attributes: ['id', 'email', 'firstName', 'lastName', 'image', 'businessLicence', 'insurance', 'resume','address','latitude','longitude'],
      where: {
        authKey: auth_data.auth_key
      }

    });
    /* console.log(check_auth_data,"check_auth_data") */
    return check_auth_data;
  },

  upload_document: async function (business_licence, upload_insurance, upload_resume, check_provider_auth) {

    const update_document = await provider.update({
      businessLicence: business_licence,
      insurance: upload_insurance,
      resume: upload_resume,

    },
      {
        where: {

          id: check_provider_auth.dataValues.id,

        }
      }
    );
    return update_document;

  },

  signup_provider: async function (data,file_data,get_auth_key, password_details,file_dataa, req, res) {

    var get_email = await provider.findOne({
      attributes: ['id', 'email'],
      where: {
        email: data.email,
      },
      raw:true

    });
    if (get_email !=null) {
      let msg = 'Email Already Exist ';
      jsonData.already_exist(res, msg)
      return false;
    }

    get_phone = await provider.findOne({
      attributes: ['id', 'phone'],
      where: {
        phone: data.phone,

      }
    })
    if (get_phone) {
      let msg = 'Phone No. Already Exist ';
      jsonData.already_exist(res, msg)
      return false;
    }

    //  console.log(get_email,"get_email");return;
      autyh=await this.generate_auth_key()
//console.log(autyh,"autyh")
    create_signup_user = await provider.create({
      authKey:autyh,
      email: data.email,
      phone: data.phone,
      password: password_details,
      firstName: data.first_name,
      lastName: data.last_name,
      countryCode: data.country_code,
      phone: data.phone,
      /* categoryId: data.category_id, */
      state: data.state,
      city: data.city,
      street: data.street,
      houseNumber: data.houseNumber,
      appartment: data.appartment,
      zipCode: data.zipCode,
      address: data.address,
      image: file_dataa,
      age: data.age,
      dob: data.dob,
      price: data.price,
      location: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      deviceType: data.device_type,
      deviceToken: data.device_token,
      //authKey: get_auth_key,
      driverLicence: file_data,
      socialSecurityNo: data.social_security_no,
      description:data.description,
      socialId:data.social_id,
      socialType:data.social_type,

      paypalId:data.paypal_id
      /* isVerified: 0, */

    });
// [{"category_id" : "18","subcategory" : [{"id": "2","price":"20"},{"id": "3","price":"30"}]}]
    var get_selected_data = data.selected_data;

    if (Array.isArray(get_selected_data)) {
      var category_array = [];
      var subcategory_array = [];
      for (var i in get_selected_data) {
        for(var j in  get_selected_data[i].subcategory){
          let subcat = {
            providerId: create_signup_user.dataValues.id,
            categoryId: get_selected_data[i].category_id,
            subCategoryId: get_selected_data[i].subcategory[j].id,
            price:get_selected_data[i].subcategory[j].price
          }
          subcategory_array.push(subcat);
        }
        let temp_obj = {
          providerId: create_signup_user.dataValues.id,
          categoryId: get_selected_data[i].category_id
        }
        category_array.push(temp_obj);
      }
      add_sub_cat = await providerSubCategories.bulkCreate(subcategory_array);
      add_sub_cat = await providerCategory.bulkCreate(category_array);

    }

    // get_signup_data = await provider.findOne({
    //   attributes: ['id', 'firstName','email','description', 'lastName', 'image', 'countryCode', 'phone', 'driverLicence', 'socialSecurityNo', 'authKey', 'state', 'city', 'address','age','dob','paypalId','online'],
    //   where: {
    //     id: create_signup_user.dataValues.id
    //   }
    // });
    // get_provider_cate_subcat = await providerSubCategories.findAll({
    //   attributes: ['id', 'providerId', 'subCategoryId','categoryId', [sequelize.literal('`subCategory`.`name`'), 'subCategoryName'], [sequelize.literal('`subCategory`.`description`'), 'subCategoryDescription'], [sequelize.literal('`subCategory`.`image`'), 'subCategoryImage'], [sequelize.literal('`categories`.`name`'), 'categoryName'], [sequelize.literal('`categories`.`description`'), 'categoryDescription'], [sequelize.literal('`categories`.`image`'), 'categoryImage']],
    //   include: [{
    //     model: subCategory,
    //     required: false,
    //     attributes: [],
    //     on: {
    //       col1: sequelize.where(sequelize.col('subCategory.id'), '=', sequelize.col('providerSubCategories.sub_category_id')),
    //     },
    //   },{
    //     model: category,
    //     required: false,
    //     attributes: [],
    //     on: {
    //       col1: sequelize.where(sequelize.col('categories.id'), '=', sequelize.col('providerSubCategories.category_id')),
    //     },
    //   }],
    //   where: {
    //     providerId: get_signup_data.dataValues.id
    //   }
    // })
    // if (get_provider_cate_subcat) {
    //   get_provider_cate_subcat = get_provider_cate_subcat.map(value => {
    //     return value.toJSON();
    //   });
    // }
  
  //  get_signup_data.dataValues.subCategories = get_provider_cate_subcat
  
    data.provider_id=create_signup_user.dataValues.id
    var check_auth =create_signup_user;
    let get_provider_profile = await this.get_provider_profile(data, check_auth)

    // get_signup_data.dataValues.categories = get_provider_cat
    return get_provider_profile;
  },
  provider_login: async function (data, convert_data, get_auth_key, req, res) {
    /* console.log(convert_data,"==========convert_data");return false; */

    const update_details = await provider.update({
      authKey: get_auth_key,
      deviceType: data.device_type,
      deviceToken: data.device_token,
      latitude: data.latitude,
      longitude: data.longitude,
      socialId:data.social_id
    },
      {
        where: {

          email: data.email,
          password: convert_data

        }
      }
    );
    /* console.log(update_details,"update_details");return; */
    check_email_password = await provider.findOne({
      attributes:
      ['id', 'firstName','email','description', 'lastName', 'image', 'countryCode', 'phone', 'driverLicence', 'socialSecurityNo', 'authKey', 'state', 'city', 'address','age','dob','paypalId','online'],
      where: {
        email: data.email,
        password: convert_data
      }

    });
    /*  console.log(check_email_password,"check_email_password");return; */
    if (check_email_password) {

      // get_provider_cate_subcat = await providerSubCategories.findAll({
      //   attributes: ['id', 'providerId', 'subCategoryId','categoryId', [sequelize.literal('`subCategory`.`name`'), 'subCategoryName'], [sequelize.literal('`subCategory`.`description`'), 'subCategoryDescription'], [sequelize.literal('`subCategory`.`image`'), 'subCategoryImage'], [sequelize.literal('`categories`.`name`'), 'categoryName'], [sequelize.literal('`categories`.`description`'), 'categoryDescription'], [sequelize.literal('`categories`.`image`'), 'categoryImage']],
      //   include: [{
      //     model: subCategory,
      //     required: false,
      //     attributes: [],
      //     on: {
      //       col1: sequelize.where(sequelize.col('subCategory.id'), '=', sequelize.col('providerSubCategories.sub_category_id')),
      //     },
      //   },{
      //     model: category,
      //     required: false,
      //     attributes: [],
      //     on: {
      //       col1: sequelize.where(sequelize.col('categories.id'), '=', sequelize.col('providerSubCategories.category_id')),
      //     },
      //   }],
      //   where: {
      //     providerId: check_email_password.dataValues.id
      //   }
      // })
      // if (get_provider_cate_subcat) {
      //   get_provider_cate_subcat = get_provider_cate_subcat.map(value => {
      //     return value.toJSON();
      //   });
      // }


      /* console.log(get_provider_cat,"get_provider_cat");return; */
      //check_email_password.dataValues.subCategories = get_provider_cate_subcat
      /* console.log(get_provider_cate_subcat,"get_provider_cate_subcat");return; */
      /* console.log(check_email_password, "check_email_password");return; */

      data.provider_id=check_email_password.dataValues.id
      var check_auth =check_email_password;
      let get_provider_profile = await this.get_provider_profile(data, check_auth)

      return get_provider_profile;
    }
  },
  get_current_job: async function (get_data, check_auth) {

    get_booking_data = await order.findAll({
      attributes: ['id', 'userId', 'providerId', 'categoryId', 'timeSlotId', 'status'],
      include: [
        {
          attributes: ['id', 'firstName', 'lastName', 'image'],
          model: user,
          require: false
        },
        {
          attributes: ['id', 'fromDate', 'toDate', 'fromTime', 'toTime', 'type', 'date'],
          model: availability,
          require: false
        }
      ],
      order: [
        ['id', 'desc'],
      ],
      where: {
        providerId: check_auth.dataValues.id,
        status: {
          [Op.ne]: 2,
        },
      }
    });

    if (get_booking_data) {
      get_booking_data = get_booking_data.map(value => {
        return value.toJSON();
      });
    }
    /* console.log(get_booking_data[0].user,"get_booking_data");return; */
    return get_booking_data;
  },
  complete_job: async function (get_complete_data, check_auth) {

    const update_order_details = await order.update({
      status: 4,

    },
      {
        where: {

          id: get_complete_data.order_id

        }
      }
    );

    return update_order_details;
  },
  get_provider_notification: async function (check_auth) {

    get_data = await notification.findAll({
      attributes: ['id', 'senderId', 'recieverId', 'message', 'createdAt'],
      include: [{

        attributes: ['id', 'firstName', 'lastName', 'image',],
        model: user,
        required: false
      }],
      where: {
        recieverId: check_auth.dataValues.id,
        userType: 2
      }
    });

    if (get_data) {
      get_data = get_data.map(value => {
        return value.toJSON();
      });
    }
    return get_data;

  },
  handle_notification: async function (get_data, check_auth) {


    const update_notification_status = await provider.update({
      notificationStatus: get_data.type,

    },
      {
        where: {

          id: check_auth.dataValues.id

        }
      }
    );
    return update_notification_status;
  },
  provider_social_login: async function (get_data_login) {

    check_social_id = await provider.findOne({
      where: {
        socialId: get_data_login.social_id
      }
    });
    //console.log(check_social_id,"check_social_id");return;

     if (check_social_id) {

      create_social_login = await provider.update({
        deviceToken: get_data_login.device_token,
        deviceType: get_data_login.device_type,
        authKey: await this.generate_auth_key(),
        latitude: get_data_login.latitude,
       longitude: get_data_login.longitude,

      },
        {
          where: {

            socialId: get_data_login.social_id,

          }
        }
      );
      get_social_data = await provider.findOne({
        attributes:  ['id', 'firstName','email','description', 'lastName', 'image', 'countryCode', 'phone', 'driverLicence', 'socialSecurityNo', 'authKey', 'state', 'city', 'address','age','dob','paypalId','online', 'socialId'],
        where: {
          socialId: get_data_login.social_id,
        },
        raw:true
  
      });
      if(get_social_data){
      get_provider_cate_subcat = await providerSubCategories.findAll({
        attributes: ['id', 'providerId', 'subCategoryId','categoryId', [sequelize.literal('`subCategories`.`name`'), 'subCategoryName'], [sequelize.literal('`subCategories`.`description`'), 'subCategoryDescription'], [sequelize.literal('`subCategories`.`image`'), 'subCategoryImage'], [sequelize.literal('`categories`.`name`'), 'categoryName'], [sequelize.literal('`categories`.`description`'), 'categoryDescription'], [sequelize.literal('`categories`.`image`'), 'categoryImage']],
        include: [{
          model: subCategory,
          required: false,
          attributes: [],
          on: {
            col1: sequelize.where(sequelize.col('subCategories.id'), '=', sequelize.col('providerSubCategories.sub_category_id')),
          },
        },{
          model: category,
          required: false,
          attributes: [],
          on: {
            col1: sequelize.where(sequelize.col('categories.id'), '=', sequelize.col('providerSubCategories.category_id')),
          },
        }],
        where: {
          providerId: get_social_data.id
        }
      })
      if (get_provider_cate_subcat) {
        get_provider_cate_subcat = get_provider_cate_subcat.map(value => {
          return value.toJSON();
        });
      }
      /* console.log(get_provider_cat,"get_provider_cat");return; */
      get_social_data.subCategories = get_provider_cate_subcat
    }
      return get_social_data

     }else{
        return check_social_id
     }

    // } else {

    //   create_social_login = await provider.create({

    //     socialId: get_data_login.social_id,
    //     socialType: get_data_login.social_type,
    //     firstName: get_data_login.first_name,
    //     lastName: get_data_login.last_name,
    //     email: get_data_login.email,
    //     device_type: get_data_login.device_type,
    //     device_token: get_data_login.device_token,
    //     latitude: get_data_login.latitude,
    //     longitude: get_data_login.longitude,
    //     address: get_data_login.address,
    //     authKey: await this.generate_auth_key()

    //   });

    // }
  
    return check_social_id;
  },
  provider_change_password: async function (get_change_password, req, res, check_auth) {

    check_password = await provider.findOne({
      attributes: ['id', 'password'],
      where: {
        id: check_auth.dataValues.id
      }
    })

    const converted_password = crypto.createHash('sha1').update(get_change_password.old_password).digest('hex');

    if (converted_password == check_password.dataValues.password) {

      const new_password = crypto.createHash('sha1').update(get_change_password.new_password).digest('hex');

      const update_details = await provider.update({
        password: new_password,

      },
        {
          where: {

            id: check_auth.dataValues.id

          }
        }
      );
      return update_details;

    } else {

      let msg = 'Old password is incorrect';
      jsonData.wrong_status(res, msg)

    }
  },
  edit_provider_profile: async function (req, res, get_edit_details, check_auth, file_data, file_businessLicence, file_insurance, file_resume,file_licence) {
   

    const update_profile = await provider.update({
      firstName: get_edit_details.first_name,
      lastName: get_edit_details.last_name,
      email: get_edit_details.email,
      phone: get_edit_details.phone,
      age: get_edit_details.age,
      dob: get_edit_details.dob,
      description: get_edit_details.description,
      address: get_edit_details.address,
      latitude: get_edit_details.latitude,
      longitude: get_edit_details.longitude,
      image: file_data,
      insurance: file_insurance,
      resume: file_resume,
      businessLicence: file_businessLicence,
      driverLicence: file_licence,
      paypalId:get_edit_details.paypal_id,
      state: get_edit_details.state,
      city: get_edit_details.city,
      street: get_edit_details.street,
      houseNumber:get_edit_details.houseNumber,
      appartment: get_edit_details.appartment,
      zipCode: get_edit_details.zipCode
    },
      {
        where: {

          id: check_auth.dataValues.id
        }
      }
    );



    if(get_edit_details.selected_data){
    var get_selected_data = JSON.parse(get_edit_details.selected_data);

    if (Array.isArray(get_selected_data)) {
     var delete_category_data = await providerCategory.destroy({
        where: {
          providerId: check_auth.dataValues.id,
        }
      });
  
    var  delete_sub_category_data = await providerSubCategories.destroy({
        where: {
          providerId: check_auth.dataValues.id,
        }
      });
  
      var category_array = [];
      var subcategory_array = [];
      for (var i in get_selected_data) {
        for(var j in  get_selected_data[i].subcategory){
          let subcat = {
            providerId: check_auth.dataValues.id,
            categoryId: get_selected_data[i].category_id,
            subCategoryId: get_selected_data[i].subcategory[j].id,
            price:get_selected_data[i].subcategory[j].price
          }
          subcategory_array.push(subcat);
        }
        let temp_obj = {
          providerId: check_auth.dataValues.id,
          categoryId: get_selected_data[i].category_id
        }
        category_array.push(temp_obj);
      }
      add_sub_cat = await providerSubCategories.bulkCreate(subcategory_array);
      add_sub_cat = await providerCategory.bulkCreate(category_array);

    }
   
  }

  get_signup_data = await provider.findOne({
    // attributes: ['id', 'firstName','email','description', 'lastName', 'image', 'countryCode', 'phone', 'driverLicence', 'socialSecurityNo', 'authKey', 'state', 'city', 'address','age','dob','paypalId','online','resume','insurance','businessLicence'],
    where: {
      id: check_auth.dataValues.id
    }
  });
  get_provider_cate_subcat = await providerSubCategories.findAll({
    attributes: ['id', 'providerId', 'subCategoryId','categoryId', [sequelize.literal('`subCategory`.`name`'), 'subCategoryName'], [sequelize.literal('`subCategory`.`description`'), 'subCategoryDescription'], [sequelize.literal('`subCategory`.`image`'), 'subCategoryImage'], [sequelize.literal('`categories`.`name`'), 'categoryName'], [sequelize.literal('`categories`.`description`'), 'categoryDescription'], [sequelize.literal('`categories`.`image`'), 'categoryImage']],
    include: [{
      model: subCategory,
      required: false,
      attributes: [],
      on: {
        col1: sequelize.where(sequelize.col('subCategory.id'), '=', sequelize.col('providerSubCategories.sub_category_id')),
      },
    },{
      model: category,
      required: false,
      attributes: [],
      on: {
        col1: sequelize.where(sequelize.col('categories.id'), '=', sequelize.col('providerSubCategories.category_id')),
      },
    }],
    where: {
      providerId: check_auth.dataValues.id
    }
  })
  if (get_provider_cate_subcat) {
    get_provider_cate_subcat = get_provider_cate_subcat.map(value => {
      return value.toJSON();
    });
  }

  get_signup_data.dataValues.subCategories = get_provider_cate_subcat
  delete get_signup_data.dataValues.password
  // get_signup_data.dataValues.categories = get_provider_cat
  return get_signup_data;
  },
  all_provider_content: async function (get_content) {
    if (get_content.type == 1) {
      get_content = await content.findOne({
        attributes: ['id', 'term']

      });
    } else {
      get_content = await content.findOne({
        attributes: ['id', 'privacy']

      });
    }

    return get_content;
  },
  logout_provider: async function (get_logout_data) {

    const update_auth = await provider.update({
      authKey: '',

    },
      {
        where: {

          id: get_logout_data.provider_id

        }
      }
    );

    return update_auth;
  },
  get_open_request: async function (check_auth) {

    get_open_request = await order.findAll({
      attributes: ['id', 'userId', 'providerId', 'categoryId', 'status', 'timeSlotId'],
      include: [
        {
          attributes: ['id', 'firstName', 'lastName', 'email', 'image', 'location', 'latitude', 'longitude'],
          model: user,
          required: false
        },
        {
          attributes: ['id', 'fromDate', 'toDate', 'fromTime', 'toTime', 'type', 'date'],
          model: availability,
          require: false
        }

      ],
      order: [
        ['id', 'desc']
      ],
      where: {
        providerId: check_auth.dataValues.id,
        status: 0
      }
    });

    if (get_open_request) {
      get_open_request = get_open_request.map(value => {
        return value.toJSON();
      });
    }
    return get_open_request;
  },
  get_close_request: async function (check_auth) {
    get_close_request = await order.findAll({
      attributes: ['id', 'userId', 'providerId', 'categoryId', 'status', 'timeSlotId'],
      include: [
        {
          attributes: ['id', 'firstName', 'lastName', 'email', 'image', 'location', 'latitude', 'longitude'],
          model: user,
          required: false
        },
        {
          attributes: ['id', 'fromDate', 'toDate', 'fromTime', 'toTime', 'type', 'date'],
          model: availability,
          require: false
        }
      ],
      order: [
        ['id', 'desc']
      ],
      where: {
        providerId: check_auth.dataValues.id,
        status: 4
      }
    });

    if (get_close_request) {
      get_close_request = get_close_request.map(value => {
        return value.toJSON();
      });
    }
    return get_close_request;
  },
  accept_order_provider: async function (get_data, check_auth) {

    update_order_status = await order.update({

      status: 1
    },
      {
        where: {

          id: get_data.order_id

        }
      }
    );
    return update_order_status;
  },
  add_provider_availability: async function (res, data) {
   var check_data =  JSON.parse(data.data);
    if (data.type == 1) {
      var delete_data = await availability.destroy({where:{providerId:data.providerId}});
    }
    // [{"day" : "Monday","fromTime" :"10am","toTime":"7px"},{"day" : "Tuesday","fromTime" :"10am","toTime":"7px"}]
    if(Array.isArray(check_data)){
      for(var i in check_data){
        check_data[i].providerId=data.providerId;
      }
      // console.log(check_data,"=================")
      await availability.bulkCreate(check_data);
    }
    return true;
  },
  edit_provider_availability: async function (get_data, check_auth) {

    if (get_data.type == 0) {


      var update_availability = await availability.create({

        fromDate: get_data.from_date,
        toDate: get_data.to_date,
        fromTime: get_data.from_time,
        toTime: get_data.to_time,
        type: get_data.type
      },
        {
          where: {

            id: get_data.availability_id

          }
        }
      );

    } else {


      // var update_time = moment.unix(get_data.date_list).format("YYYY-MM-DD");

      delete_previous = await availability.destroy({

        // where: database.Sequelize.literal((`date(FROM_UNIXTIME(date)) = '${update_time}'`))
        where: {

          id: get_data.availability_id

        }

      });

      create_date = await availability.create({
        date: get_data.date,
        providerId: check_auth.dataValues.id,
        type: get_data.type
      });

      var from_time = get_data.from_time.split(",");
      var to_time = get_data.to_time.split(",");

      if (Array.isArray(from_time && to_time)) {
        for (var i in from_time)
          create_time_slots = await slots.create({
            fromTime: from_time[i],
            toTime: to_time[i],
            availabilityId: create_date.dataValues.id
          });

      } else {
        create_time_slots = await slots.create({
          date: get_data.date,
          fromTime: get_data.from_time,
          toTime: get_data.to_time,
          availabilityId: create_date.dataValues.id
        });
      }
    }

    return create_time_slots;

  },
  get_provider_availability: async function (get_avialble_data, check_auth) {

    get_avialble_data = await availability.findAll({
      attributes: ['id', 'providerId', 'type', 'fromDate', 'toDate', 'fromTime', 'toTime', 'date'],
      where: {
        providerId: check_auth.dataValues.id
      }

    });
    if (get_avialble_data) {
      get_avialble_data = get_avialble_data.map(value => {
        return value.toJSON();
      });
    }

    /* console.log(get_avialble_data,"get_avialble_data");return; */

    return get_avialble_data;
  },
  delete_availability: async function (get_data, check_auth) {


    // if (get_data.type == 0) {

    delete_availability = await availability.destroy({
      where: {
        id: get_data.availability_id
      }
    });

    // } else {
    //   // var update_time = moment.unix(get_data.date).format("YYYY-MM-DD");

    //   delete_availability = await availability.destroy({

    //     // where: database.Sequelize.literal((`date(FROM_UNIXTIME(date)) = '${update_time}'`))
    //     where: {
    //       id: get_data.availability_id
    //     }

    //   });
    // }
    return delete_availability;
  },
  get_provider_details: async function (get_data, check_auth) {
    try {

      get_provider_data = await database.query("SELECT id ,first_name,last_name,name,country_code,phone,image,description,address,email, (select count(id) from favourite where user_id='" + check_auth.dataValues.id + "' and provider_id='" + get_data.provider_id + "') as like_status, (select round(ifnull(avg(ratings),0),1) from rating where userTo='" + get_data.provider_id + "' and type=1) as average_rating,(select count(id) from rating where userTo='" + get_data.provider_id + "' and type=1) as total_ratings ,(select count(id) from `order` where provider_id=14 and status=4) as totalprovidedservices FROM `provider` where id='" + get_data.provider_id + "' group by  id limit 1", {

        model: order,
        model: provider,
        mapToModel: true,
        type: database.QueryTypes.SELECT
      });
      if (get_provider_data) {
        get_provider_data = get_provider_data.map(value => {
          return value.toJSON();
        });
      }
      var final={};
      if(get_provider_data){
        final = get_provider_data[0];
        var get_category = await providerCategory.findAll(
          {
          attributes:['id','categoryId','providerId'],
          where:
            {
              providerId:get_data.provider_id
            },
          include:[{
            model:category,
            attributes:['id','name','image'],
            required:false
          }],
          raw:true,
          nest:true
        });

        if(get_category){
          for(var i in get_category){
              var get_sub_categories_data = await providerSubCategories.findAll({
                attributes:['id','categoryId','providerId'],
                where:{
                  categoryId:get_category[i].categoryId,
                  providerId:get_data.provider_id
                },
                include:[{
                  model:subCategory,
                  attributes:['id','name','image'],
                  required:false
                }],
                raw:true,
                nest:true
              });
              get_category[i].subCategories=get_sub_categories_data;
          }

        }
        final.providerCategories=get_category,
        final.providerLanguage = await this.get_provider_PCTL(get_data.provider_id,1);
        final.providerPortfolio = await this.get_provider_PCTL(get_data.provider_id,0);
        final.providerCertificate=await this.get_provider_PCTL(get_data.provider_id,2)
        final.providerBusinessHours=await this.get_provider_PCTL(get_data.provider_id,3)

      }
      


      return final

    } catch (error) {
      throw error
    }
  },
  edit_user_profile: async function (get_data, check_auth, file_upload_data, req, res) {
    try {

      get_email_data = await user.findOne({
        attributes: ['id', 'email'],
        where: {
          email: get_data.email
        }
      })
    
  
      // console.log(get_email_data);return;
      if (check_auth.dataValues.email == get_data.email || get_email_data == null) {

        var update_user_profile = await user.update({

          firstName: get_data.first_name,
          lastName: get_data.last_name,
          name: get_data.first_name + ' ' + get_data.last_name,
          email: get_data.email,
          image: file_upload_data,
          description: get_data.description,
          city: get_data.city,
          state: get_data.state,
          location: get_data.location,
          latitude: get_data.latitude,
          longitude: get_data.longitude,
          countryCode:get_data.countryCode,
          phone:get_data.phone,
          age:get_data.age,
          dob:get_data.dob


        },
          {
            where: {

              id: check_auth.dataValues.id

            }
          }
        );

      var  get_edited_profile = await user.findOne({
          attributes: ['id', 'firstName', 'lastName', 'email', 'image', 'phone', 'description','countryCode','phone','location','latitude','longitude','city','state','age', 'authKey'],
          where: {
            id: check_auth.dataValues.id
          }
        })
      } else {
        let msg = 'Email Already Taken'
        jsonData.already_exist(res, msg)
      }
      return get_edited_profile;
      // }
    } catch (error) {
      throw error
    }
  },
  change_user_country: async function (get_data, check_auth) {
    try {

      var update_country = await user.update({

        countryCode: get_data.country_code,
        countryName: get_data.country_name,

      },
        {
          where: {

            id: check_auth.dataValues.id

          }
        }
      );
      return update_country;
    } catch (error) {
      throw error
    }
  },
  update_user_location: async function (get_data, check_auth) {
    try {

      var update_location = await user.update({

        latitude: get_data.latitude,
        longitude: get_data.longitude,
        location: get_data.location

      },
        {
          where: {

            id: check_auth.dataValues.id

          }
        }
      );
      return update_location;

    } catch (error) {
      throw error
    }
  },
  let_submit_user_support: async function (get_data) {
    try {

      let create_submit_support = await support.create({
        name: get_data.name,
        phone: get_data.phone,
        email: get_data.email,
        description: get_data.description,
      });

      return create_submit_support;

    } catch (error) {
      throw error
    }
  },
  get_booking_by_date: async function (get_data, check_auth) {
    try {

      var update_time = moment.unix(get_data.date).format("YYYY-MM-DD");

      get_orders = await order.findAll({
        attributes: ['id', 'userId', 'providerId', 'categoryId', 'date', 'timeSlotId', 'status'],
        include: [
          {
            attributes: ['id', 'name', 'email', 'description'],
            model: provider,
            required: false
          },
          {
            attributes: ['id', 'providerId', 'type', 'fromDate', 'toDate', 'fromTime', 'toTime', 'date'],
            model: availability,
            required: false,
            // on: {
            //   col1: sequelize.where(sequelize.col('order.provider_id'), '=', sequelize.col('availability.providerId')),
            // },
          }
        ],
        where: database.Sequelize.literal((`date(FROM_UNIXTIME(order.date)) = '${update_time}'`))

      });

      if (get_orders) {
        get_orders = get_orders.map(value => {
          return value.toJSON();
        });
      }
      return get_orders;

    } catch (error) {
      throw error
    }
  },
  get_fav_list: async function (requestdata, check_auth) {
    try {
      let get_fav_data = await favourite.findAll({
        attributes: ['id', 'userId', 'providerId', 'status', [sequelize.literal('`provider`.`first_name`'), 'providerfirstName'], [sequelize.literal('`provider`.`last_name`'), 'providerlastName'], [sequelize.literal('`provider`.`image`'), 'providerImage'], [sequelize.literal('`provider`.`description`'), 'description'],[sequelize.literal('(select ifnull(round(avg(ratings),1),0) as rat from rating where userTo = `favourite`.`provider_id` and type =1)'),'avg_rating']],
        include: [{
          model: provider,
          attributes: []
        }],
        where: {
          userId: check_auth.dataValues.id,
          type:0
        }
      });

      if (get_fav_data) {
        get_fav_data = get_fav_data.map(value => {
          return value.toJSON();
        });
      }
      /*  console.log(get_fav_data, "get_fav_data"); return; */


      return get_fav_data

    } catch (error) {
      throw error
    }
  },
  get_fav_list_order: async function (requestdata, check_auth) {
    try {
      let get_fav_data = await favJobs.findAll({
        attributes: ['id', 'jobId', 'providerId'],
        include: [{
          model: order,
          attributes: ['id', 'userId','title', 'description', 'location','jobType','latitude','longitude',[sequelize.fn('Round', sequelize.literal("3959 * acos(cos(radians('" + check_auth.dataValues.latitude + "')) * cos(radians(order.latitude)) * cos(radians('" + check_auth.dataValues.longitude + "') - radians(order.longitude)) + sin(radians('" + check_auth.dataValues.latitude + "')) * sin(radians(order.latitude)))"), 2), 'distance']],
          required:false,
          include:[{
            model:orderImages,
            attributes:['id','images'],
            required:false
          }],
        }],
        where: {
          providerId: check_auth.dataValues.id,
        }
      });


      if (get_fav_data) {
        get_fav_data = get_fav_data.map(value => {
          return value.toJSON();
        });
      }
      /*  console.log(get_fav_data, "get_fav_data"); return; */


      return get_fav_data

    } catch (error) {
      throw error
    }
  },
  add_user_card: async function (get_data, check_auth) {
    try {

      var check_card = await user_cards.findOne({
        where:{
          cardNumber: get_data.card_number,
          userId: check_auth.dataValues.id
        },
        raw:true
      });

      if(check_card ==null){

        let insert_card_details = await user_cards.create({
          userId: check_auth.dataValues.id,
          name: get_data.card_name,
          cardNumber: get_data.card_number,
          expYear: get_data.card_expiry_year,
          expMonth: get_data.card_expiry_month,
          type: get_data.card_type
        });
    }
      
      let get_card_data = await user_cards.findOne({
        attributes: ['id', 'userId', 'cardNumber', 'expYear', 'expMonth', 'type'],
        where: {
          id: insert_card_details.dataValues.id
        }
      });

      return get_card_data;

    } catch (error) {
      throw error
    }
  },
  get_provider_profile1: async function (get_data) {
    try {

      let get_user_details = await provider.findOne({
        attributes: ['id', 'firstName', 'lastName', 'email', 'image', 'phone', 'description'],
        where: {
          id: get_data.user_id
        }
      });

      return get_user_details;

    } catch (error) {
      throw error
    }
  },
  add_job_description: async function (get_data, check_auth, file_data) {
    try {
       if(get_data.hasOwnProperty('provider_id')){
        get_data.provider_id = get_data.provider_id;
       }else{
        get_data.provider_id = 0;
       }
       get_data.providerId = get_data.provider_id
       get_data.userId = check_auth.dataValues.id

      let add_jobs = await order.create(get_data);

      if (Array.isArray(file_data)) {
        final_array = [];
        for (var k in file_data) {
          let temp_obj = {
            orderId: add_jobs.dataValues.id,
            images: file_data[k],
          }
          final_array.push(temp_obj)
        }
        add_images_data = await orderImages.bulkCreate(final_array);
      } else if(file_data != '') {
        add_images_data = await orderImages.create({
          orderId: add_jobs.dataValues.id,
          images: file_data
        });
      }
//   insert category subcategory selected by user 
//  fromat  [{"category_id" : "18","subcategory" : [{"id": "1","price":"20"},{"id": "2","price":"30"}]}]
//console.log(JSON.stringify(get_data.selected_data),"===================get_data.selected_data")
      if(get_data.is_api ==0){
          var get_selected_data = JSON.parse(get_data.selected_data);
      }else{
          var get_selected_data = get_data.selected_data;
      }

      if (Array.isArray(get_selected_data)) {
        var category_array = [];
        var subcategory_array = [];
        for (var i in get_selected_data) {
          for(var j in  get_selected_data[i].subcategory){
            let subcat = {
              orderId: add_jobs.dataValues.id,
              categoryId: get_selected_data[i].category_id,
              subcategoryId: get_selected_data[i].subcategory[j].id
            }
            subcategory_array.push(subcat);
          }
          let temp_obj = {
            orderId: add_jobs.dataValues.id,
            categoryId: get_selected_data[i].category_id
          }
          category_array.push(temp_obj);
        }
        await orderSubcategory.bulkCreate(subcategory_array);
        await orderCategory.bulkCreate(category_array);
  
      }

      let job_data = await order.findOne({
        attributes: ['id', 'userId','providerId', 'description','state','title', 'latitude', 'longitude', 'type', 'date', 'status'],
        where: {
          id: add_jobs.dataValues.id
        },
        raw:true
      });
      // send push notification
      if(get_data.provider_id !=0){
            // push notification provider --------------------
            var push_data ={}
            var get_provider_data = await this.get_provider_details_for_push(get_data);
            push_data.token = get_provider_data.deviceToken;
            push_data.title = check_auth.dataValues.firstName + ' '+ check_auth.dataValues.lastName +  " create new project";
            push_data.code = 3;
            push_data.body = job_data;
            if(get_provider_data.deviceType ==1){
              var send_push = await this.AndroidPushNotification(push_data);
            }else{
              var send_push = await this.IosPushNotification(push_data);
            }
      }else{
        var get_provider_online =  await this.online_provider_get(job_data.id);
        if(get_provider_online){
          var android_token =[];
          var ios_token =[]
          for(var i in get_provider_online){
             if(get_provider_online[i].deviceType ==1){
              android_token.push(get_provider_online[i].deviceToken);
             }else{
              ios_token.push(get_provider_online[i].deviceToken);
             }
          }
           // push notification provider --------------------
           var push_data ={}
           push_data.title = check_auth.dataValues.firstName + ' '+ check_auth.dataValues.lastName +  " create new project";
           push_data.code = 3;
           push_data.body = job_data;
           if(android_token.length > 0){
            push_data.token  = android_token;
             var send_push = await this.AndroidPushNotificationMultiple(push_data);
           }
           if(ios_token.length > 0){
            push_data.token  = ios_token;
             var send_push = await this.IosPushNotification(push_data);
           }





      }

      }


      return job_data

    } catch (error) {
      throw error
    }
  },
  get_job_details: async function (get_data, check_auth) {
    try {

      get_job_data = await order.findOne({
        attributes: ['id', 'date','providerId','userId','title','startTime','endTime','startPrice','endPrice','state', 'description', 'location', 'status','date','time','type'],
        include: [
          {
            model: orderCategory,
            attributes:['id','categoryId'],
            required: false,
            include:[{
              model:category,
              attributes:['id','name','image'],
              required:false
            }]
          },
          {
            model: orderImages,
            required: false
          },
        ],
        where: {
          id: get_data.post_id
        },
        
      });
      if(get_job_data){
        get_job_data =get_job_data.toJSON();
      }
    
        for( var i in get_job_data.orderCategories){
          var get_subcategory = await orderSubcategory.findAll({
            attributes:['id','categoryId'],
            where:{
              categoryId:get_job_data.orderCategories[i].categoryId
            },
            include:[{
              model:subCategory,
              attributes:['id','name','image'],
              required:false
            }],
           
          });

          get_job_data.orderCategories[i].subCategory = get_subcategory;

        }
    

      // console.log(get_job_data,"get_job_data");return false;
      get_jobs_bid = await bids.findAll({
        attributes: ['id', 'orderId', 'price', 'created','status',[sequelize.literal('`provider`.`first_name`'), 'providerFirstName'], [sequelize.literal('`provider`.`last_name`'), 'providerLastName'], [sequelize.literal('`provider`.`id`'), 'providerId'], [sequelize.literal('`provider`.`image`'), 'providerImage'], [sequelize.literal('`provider`.`description`'), 'providerDescription'], /* [sequelize.fn('Round', sequelize.fn('AVG', sequelize.col('`rating`.`ratings`'))), 'ratingAvg'], */
          [sequelize.literal('(SELECT ifnull(avg(ratings),0) FROM rating WHERE userTo = bids.provider_id)'), 'avgrating'],[sequelize.fn('Round', sequelize.literal("3959 * acos(cos(radians('" + check_auth.dataValues.latitude + "')) * cos(radians(provider.latitude)) * cos(radians('" + check_auth.dataValues.longitude + "') - radians(provider.longitude)) + sin(radians('" + check_auth.dataValues.latitude + "')) * sin(radians(provider.latitude)))"), 2), 'distance']],
        include: [
          {
            attributes: [],
            model: provider,
            required: false
          },
        ],
        where: {
          orderId: get_data.post_id,
          status: {
            [Op.ne]: 2,
          },
        },
        order: [
          ['id', 'desc']
        ]

      });

      get_job_data.bids = get_jobs_bid
  
      return get_job_data;

    } catch (error) {
      throw error
    }
  },
  my_job_details: async function (get_data, check_auth) {
    try {
      var limit =20;
      if(get_data.limit){
       limit =  Number(get_data.limit);
      }
      var page =1;
      if(get_data.page){
         page = (get_data.page > 0) ?  get_data.page : 1;
      }
      var offset = (page-1) * Number(limit);
      offset =Number(offset);

      var condition ={}
      condition.userId=check_auth.dataValues.id
      if(get_data.type){
        if(get_data.type==0){
          
        }else if(get_data.type ==1){
          condition.type=3
        }else{
          condition.status =get_data.type
          condition.type=['1','2']
        }
    }


      final_array = [];
      get_current_jobs_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId','title', 'description', 'location', 'date', 'status', 'type','jobType', 'state','startTime','endTime','startPrice','endPrice'],
          include: [
          //   {
          //     model: orderCategory,
          //     attributes:['id','categoryId'],
          //     required: false,
          //     include:[{
          //       model:category,
          //       attributes:['id','name','image'],
          //       required:false
          //     }]
          //   },
            {
              model: orderImages,
              required: false
            },
          
          ],
        where:condition,
        limit,
        offset,
        order:[[
          'id','desc'
        ]]
      });

      if (get_current_jobs_data) {
        get_current_jobs_data = get_current_jobs_data.map(value => {
          return value.toJSON();
        });
      }
      for( var j in get_current_jobs_data){
         for(var i in get_current_jobs_data[j].orderCategories){
              var get_subcategory = await orderSubcategory.findAll({
                attributes:['id','categoryId'],
                where:{
                  categoryId:get_current_jobs_data[j].orderCategories[i].categoryId
                },
                include:[{
                  model:subCategory,
                  attributes:['id','name','image'],
                  required:false
                }],
              
              });
              get_current_jobs_data[j].orderCategories[i].subCategory = get_subcategory;
      }

      }

   

      final_array =  get_current_jobs_data

      return final_array;

    } catch (error) {
      throw error
    }
  },
  add_additional_work: async function (get_data, check_auth, file_data,req,res) {
    try {

      get_add_data= await additionalWork.findOne({
        where:{
          orderId: get_data.order_id,
        userId: check_auth.dataValues.id,
        },
        raw:true
      })
      if(get_add_data==null){
      let create_additional_work = await additionalWork.create({
        orderId: get_data.order_id,
        userId: check_auth.dataValues.id,
        providerId: get_data.provider_id,
        title: get_data.title,
        price: get_data.price,
        image: file_data
      })
      let update_additional_work = await order.update({
        additionalWork: 1
      },
        {
          where: {
            id: get_data.order_id,
          }
        })
      return create_additional_work;
      }else{
        let msg = 'You Already Added a additional work to this job';
        jsonData.wrong_status(res, msg)
        return;
      }
    } catch (error) {
      throw error
    }
  },
  get_all_tips: async function (get_data) {
    let get_all_tips = await tip.findAll({
      attributes: ['id', 'price'],
      order: [
        ['id', 'desc']
      ]
    });
    if (get_all_tips) {
      get_all_tips = get_all_tips.map(value => {
        return value.toJSON();
      });
    }

    return get_all_tips;

  },
  get_notification_list_user: async function (get_data, check_auth) {
    try {

      // const update_seen = await notification.update({
      //   isSeen: 1
      // },
      //   {
      //     where: {
      //       user2Id: check_auth.dataValues.id,
      //       userType: 2,
      //     }
      //   })
      let get_time_data = await this.create_time_stamp()
      var update_time = moment.unix(get_time_data).format("YYYY-MM-DD");
      let final_array = [];
      let get_note_data_current = await notification.findAll({
        attributes: ['id', 'userId',['order_id','id'],'type', 'user2Id','isSeen', 'message', 'createdAt', [sequelize.literal('`provider`.`image`'), 'providerImage'],[sequelize.literal('`provider`.`first_name`'), 'firstName'],[sequelize.literal('`provider`.`last_name`'), 'lastName']],
        include: [{
          model: provider,
          required: false,
          attributes: []
        }],
        where: {
          user2Id: check_auth.dataValues.id
          // userType: 2,
          // where: database.Sequelize.literal((`date(FROM_UNIXTIME(createdAt)) = '${update_time}'`)),
        },
        order: [[
          'id', 'desc'
        ]]
      })
      if (get_note_data_current) {
        get_note_data_current = get_note_data_current.map(value => {
          return value.toJSON();
        });
      }
      // console.log(get_note_data_current,"get_note_data_current");return;

      let get_note_data_past = await notification.findAll({
        attributes: ['id', 'userId', 'user2Id','orderId','type', 'message', 'createdAt', [sequelize.literal('`user`.`image`'), 'userImage']],
        include: [{
          model: user,
          required: false,
          attributes: []
        }],
        where: {
          user2Id: check_auth.dataValues.id,
          userType: 2,
          where: database.Sequelize.literal((`date(FROM_UNIXTIME(createdAt)) != '${update_time}'`)),
        },
        order: [[
          'id', 'desc'
        ]]
      })
      if (get_note_data_past) {
        get_note_data_past = get_note_data_past.map(value => {
          return value.toJSON();
        });
      }

      // final_array = {
      //   'currentNotifications': get_note_data_current,
      //   'pastNotifications': get_note_data_past
      // }

      final_array=get_note_data_current;
      // console.log(final_array,"final_array");return;

      return final_array;
    } catch (error) {
      throw error
    }
  },
  // honey do provider api start
  get_notifications_data: async function (get_data, check_auth) {
    try {
      // const update_seen = await notification.update({
      //   isSeen: 1
      // },
      //   {
      //     where: {
      //       user2Id: check_auth.dataValues.id,
      //       userType: 1,
      //     }
      //   })
      //console.log(update_seen,"update_seen=============================================");

      let get_time_data = await this.create_time_stamp()
      var update_time = moment.unix(get_time_data).format("YYYY-MM-DD");
      let final_array = [];
      let get_note_data_current = await notification.findAll({
        attributes: ['id', 'userId','orderId','type', 'user2Id','isSeen', 'message', 'createdAt', [sequelize.literal('`user`.`image`'), 'userImage']],
        include: [{
          model: user,
          required: false,
          attributes: []
        }],
        where: {
          user2Id: check_auth.dataValues.id,
          userType: 1,
         // where: database.Sequelize.literal((`date(FROM_UNIXTIME(createdAt)) = '${update_time}'`)),
        },
        order: [[
          'id', 'desc'
        ]]
      })
      if (get_note_data_current) {
        get_note_data_current = get_note_data_current.map(value => {
          return value.toJSON();
        });
      }
      // let get_note_data_past = await notification.findAll({
      //   attributes: ['id', 'userId','orderId','type', 'user2Id', 'message', 'createdAt', [sequelize.literal('`user`.`image`'), 'userImage']],
      //   include: [{
      //     model: user,
      //     required: false,
      //     attributes: []
      //   }],
      //   where: {
      //     user2Id: check_auth.dataValues.id,
      //     userType: 1,
      //     where: database.Sequelize.literal((`date(FROM_UNIXTIME(createdAt)) != '${update_time}'`)),
      //   },
      //   order: [[
      //     'id', 'desc'
      //   ]]
      // })
      // if (get_note_data_past) {
      //   get_note_data_past = get_note_data_past.map(value => {
      //     return value.toJSON();
      //   });
      // }
      // final_array = {
      //   'currentNotifications': get_note_data_current,
      //   'pastNotifications': get_note_data_past,
      // }

      final_array = get_note_data_current
      return final_array;
    } catch (error) {
      throw error
    }
  },

  near_me_provider: async function(requestdata){
    try{
      var get_setting_data = await setting.findOne({
        raw:true
      });
      var limit =20;
      if(requestdata.limit){
       limit =  requestdata.limit;
      }
      var page =1;
      if(requestdata.page){
         page = requestdata.page;
      }
      const offset = (page-1) * Number(limit);
      limit =Number(limit);
     
     var  condition ={};
     condition.status = 1
     if(requestdata.search){
      var ab ={
        [Op.like]:'%'+requestdata.search+'%'
      }
      var or ={
        [Op.or]: [
          {firstName:ab},
          {lastName:ab},
          {description:ab}
          ]
      }

      condition=or
     }

    //  console.log(condition,"==================condition")

       var get_provider = await provider.findAll({
        attributes: ['id', 'firstName','lastName', 'description','image','address','latitude','longitude','profession','online','state' ,[sequelize.fn('Round',sequelize.literal("6371 * acos(cos(radians(" + requestdata.latitude + ")) * cos(radians(latitude)) * cos(radians(" + requestdata.longitude + ") - radians(longitude)) + sin(radians(" + requestdata.latitude + ")) * sin(radians(latitude)))"),2), 'distance'],[sequelize.literal('(select ifnull(round(avg(ratings),1),0) as rat from rating where userTo = provider.id and type =1)'),'avg_rating'],[sequelize.literal('(select count(id) as tt from favourite where provider_id = provider.id and user_id ='+ requestdata.user_id +')'),'fav'],[sequelize.literal('(select count(*)  as total from `order` where provider_id=provider.id and status !=2)'),'total_jobs']],
        where:condition,
        raw:true,
        limit,
        offset,
        order: sequelize.col('distance'),
        having: { 'distance': { [sequelize.Op.lte]: get_setting_data.searchDistance } }
      });
     
        return get_provider
   

    }catch(error){
      throw error
    }

  },

  /***************  filter search *************************/ 

  filter_search: async function(requestdata){
    try{
      var my_query ='';
      my_query ='select id,first_name as firstName, last_name as lastName,description,image,latitude,longitude,address,profession,state,online,round((3959 * acos (cos ( radians('+requestdata.latitude+') )* cos( radians( latitude ) )* cos( radians( longitude ) - radians('+requestdata.longitude+') )+ sin ( radians('+requestdata.latitude+') )* sin( radians( latitude ) ) )),2) AS distance ,(select ifnull(round(avg(ratings),1),0) as rat from rating where userTo = p.id and type =1) as rating,(select count(*)  as total from `order` where provider_id=p.id and status !=2) as total_jobs,(select count(id) as tt from favourite where provider_id = p.id and user_id ='+ requestdata.user_id +') as fav from provider as p where p.online =1';
      
      if(requestdata.category_id){
        my_query+=' and  id in (select group_concat(provider_id) from provider_category where category_id in("'+ requestdata.category_id +'" ))';
      }
      if(requestdata.total_jobs){
        my_query+=' and (select count(*)  as total from `order` where provider_id=p.id and status !=2) ='+requestdata.total_jobs;
      }
      if(requestdata.state){
        my_query+=' and state like "%'+requestdata.state + '%"' ;
      }
      if(requestdata.rating){
        my_query+=' and (select ifnull(round(avg(ratings),0),0) as rat from rating where userTo = p.id and type =1) =' + requestdata.rating;
     }
      if(requestdata.distance){
        my_query+=' HAVING distance < ' + requestdata.distance ;
      }

     var get_provider = await provider.sequelize.query(my_query,{
      type: sequelize.QueryTypes.SELECT

     });

        return get_provider
   

    }catch(error){
      throw error
    }

  },

  /********************** Filter Search Provider   **************************/ 

  filter_search_provider: async function(requestdata){
    try{
      var my_query ='';
      my_query ='select id,user_id as userId, provider_id as providerId,description,title,latitude,longitude,location,state,status,date,round((3959 * acos (cos ( radians('+requestdata.latitude+') )* cos( radians( latitude ) )* cos( radians( longitude ) - radians('+requestdata.longitude+') )+ sin ( radians('+requestdata.latitude+') )* sin( radians( latitude ) ) )),2) AS distance ,(SELECT ifnull(price,0) as bid_price from bids where provider_id='+requestdata.user_id+' and order_id=p.id) as bid_price from `order` as p where p.status =0';
      
      if(requestdata.category_id){
        my_query+=' and  id in (select group_concat(order_id) from order_category where category_id in("'+ requestdata.category_id +'" ))';
      }
    
      if(requestdata.state){
        my_query+=' and state like "%'+requestdata.state + '%"' ;
      }
     
      if(requestdata.distance){
        my_query+=' HAVING distance < ' + requestdata.distance ;
      }

     var get_order = await order.sequelize.query(my_query,{
      type: sequelize.QueryTypes.SELECT

     });

        return get_order
   

    }catch(error){
      throw error
    }

  },

  read_notification:async function(data){
    if(data.type==0){
      await notification.update(
        {
          isSeen:1
        },{
          where:{
          user2Id:data.user_id
          }
        }
      );
    }else{
      await notification.update(
        {
          isSeen:1
        },{
          where:{
          id:data.notification_id
          }
        }
      );
    }

    return true;

  },
  online_offline : async function(data,check_auth){
    try{
   

      const update_details = await provider.update({
        online: Number(data.type),

      },
        {
          where: {

            id: check_auth.dataValues.id

          }
        }
      );
      
      if(update_details){
        return 1;
      }

    }catch(error){
      throw error;
    }

  },
  get_my_jobs: async function (get_data, check_auth) {
    try {
//  pagination---------------------

    var limit =20;
    if(get_data.limit){
     limit =  Number(get_data.limit);
    }
    var page =1;
    if(get_data.page){
       page = (get_data.page > 0) ?  get_data.page : 1;
    }

    var offset = (page-1) * Number(limit);
    offset =Number(offset);

    var condition ={}
    condition.providerId=check_auth.dataValues.id
    if(get_data.status ==0){
    }else if(get_data.status ==5){
      condition.type = 3;
    }else{
      condition.status = get_data.status;
      condition.type = ['1','2']
    }

    // console.log(order_ids,"====================order_ids");return;
      get_data_home_current = await order.findAll({
        attributes: ['id', 'userId', 'providerId','title', 'description', 'location', 'date', 'status','jobType','type',[sequelize.literal(`ifnull((SELECT price FROM bids WHERE order_id = order.id and provider_id=${check_auth.dataValues.id}),0)`), 'bid_price']],
        where: condition,
        order: [
          ['id', 'DESC'],
        ],
        include:[{
          model:orderImages,
          attributes:['id','orderId','images'],
          required:false
        }],
        limit,
        offset
      });
      if (get_data_home_current) {
        get_data_home_current = get_data_home_current.map(value => {
          return value.toJSON();
        });
      }

      final_array = get_data_home_current;
      return final_array;
      /* console.log(final_array, "get_data_home"); return */

    } catch (error) {
      throw error
    }
  },

  map_list: async function (get_data, check_auth) {
    try {

      get_provider_sub_cat_data = await providerSubCategories.findAll({
        attributes: ['id', 'providerId', 'subCategoryId'],
        where: {
          providerId: check_auth.dataValues.id
        }
      });

      if (get_provider_sub_cat_data) {
        get_provider_sub_cat_data = get_provider_sub_cat_data.map(value => {
          return value.toJSON();
        });
      }
      //console.log(get_provider_sub_cat_data,"get_provider_sub_cat_data");return;
      final_array = [];
      for (var i in get_provider_sub_cat_data) {
        subCategoryId = get_provider_sub_cat_data[i].subCategoryId

        final_array.push(subCategoryId)
      }
    //  get order ids

    var get_order_subcategoy = await orderSubcategory.findAll({
      attributes:['id','orderId','subcategoryId'],
      where:{
        subcategoryId:final_array
      },
      group:['orderId'],
      order: [['id', 'DESC']],

      raw:true
    });

   // console.log(get_order_subcategoy,"===============")

 var order_ids =[];
    if(get_order_subcategoy){
      for(var i in get_order_subcategoy){
        order_ids.push(get_order_subcategoy[i].orderId);
      }
    }
//  pagination---------------------

    var limit =20;
    if(get_data.limit){
     limit =  Number(get_data.limit);
    }
    var page =1;
    if(get_data.page){
       page = (get_data.page > 0) ?  get_data.page : 1;
    }
    var offset = (page-1) * Number(limit);
    offset =Number(offset);

    // console.log(order_ids,"====================order_ids");return;
      get_data_home_current = await order.findAll({
        attributes: ['id', 'userId','title', 'description', 'location','jobType','latitude','longitude',[sequelize.literal(`ifnull((SELECT price FROM bids WHERE order_id = order.id and provider_id=${check_auth.dataValues.id}),0)`), 'bid_price'],[sequelize.fn('Round', sequelize.literal("3959 * acos(cos(radians('" + check_auth.dataValues.latitude + "')) * cos(radians(order.latitude)) * cos(radians('" + check_auth.dataValues.longitude + "') - radians(order.longitude)) + sin(radians('" + check_auth.dataValues.latitude + "')) * sin(radians(order.latitude)))"), 2), 'distance']],
        where: {
           status: 0,
          id:order_ids
        },
        include:[{
          model:orderImages,
          attributes:['id','images'],
          required:false
        }],
        order: [
          ['id', 'DESC'],
        ],
        limit,
        offset
      });
      if (get_data_home_current) {
        get_data_home_current = get_data_home_current.map(value => {
          return value.toJSON();
        });
      }

  
      final_array = get_data_home_current
      return final_array;
     
    } catch (error) {
      throw error
    }
  },
  get_provider_job_details: async function (get_data, check_auth) {
    try {

      get_provider_job_details_data = await order.findOne({
        attributes: ['id', 'date','title','startTime','endTime','startPrice','endPrice', 'description', 'location', 'status','date','time','jobType','type',[sequelize.literal(`ifnull((SELECT price FROM bids WHERE order_id = order.id and provider_id=${check_auth.dataValues.id}),0)`), 'bid_price'],[sequelize.literal('(select count(id) as tt from fav_jobs where provider_id = '+ check_auth.dataValues.id +' and job_id=order.id)'),'fav']],
            include: [
              {
                model: orderCategory,
                attributes:['id','categoryId'],
                required: false,
                include:[{
                  model:category,
                  attributes:['id','name','image'],
                  required:false
                }]
              },
              {
                model: orderImages,
                required: false
              },
            ],
        where: {
          id: get_data.post_id
        }
      });

      if(get_provider_job_details_data){
        get_provider_job_details_data =get_provider_job_details_data.toJSON();
      }
      get_provider_job_details_data.fav = (get_provider_job_details_data.fav ==0) ? 2:get_provider_job_details_data.fav;
    
        for( var i in get_provider_job_details_data.orderCategories){
          var get_subcategory = await orderSubcategory.findAll({
            attributes:['id','categoryId'],
            where:{
              categoryId:get_provider_job_details_data.orderCategories[i].categoryId,
              orderId:get_data.post_id

            },
            include:[{
              model:subCategory,
              attributes:['id','name','image'],
              required:false
            }],
           
          });
    
          get_provider_job_details_data.orderCategories[i].subCategory = get_subcategory;
    
        }

      return get_provider_job_details_data;

    } catch (error) {
      throw error
    }
  },
  place_bid_provider: async function (get_data, check_auth, req, res) {
    try {

      get_bid_data = await bids.findOne({
        where: {
          orderId: get_data.post_id,
          providerId: check_auth.dataValues.id
        }
      });
      /* console.log(get_bid_data,"get_bid_data");return; */
      if (get_bid_data == null) {
        order_details = await order.findOne({
          attributes: ['userId'],
          where: {
            id: get_data.post_id
          }
        })
        create_bid = await bids.create({
          orderId: get_data.post_id,
          providerId: check_auth.dataValues.id,
          price: get_data.price,
          status: 0,
          type:1,
          created: await this.create_time_stamp(),
          updated: await this.create_time_stamp()
        });
        return create_bid
      } else {
        let msg = 'You Already Bid on this project';
        jsonData.wrong_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },

  update_bid_provider: async function (get_data, check_auth, req, res) {
    try {

      get_bid_data = await bids.findOne({
        where: {
          orderId: get_data.post_id,
          providerId: check_auth.dataValues.id
        }
      });
      /* console.log(get_bid_data,"get_bid_data");return; */
      if (get_bid_data) {
        create_bid = await bids.update({
          price: get_data.price,
          updated: await this.create_time_stamp()
        },{
          where:{
            orderId: get_data.post_id,
            providerId: check_auth.dataValues.id
          }
        });
        return 1
      } else {
        let msg = 'Bid not found';
        jsonData.wrong_status(res, msg)
      }
    } catch (error) {
      throw error
    }
  },
  get_provider_profile: async function (get_data, check_auth) {
    try {

      get_profile_data = await provider.findOne({
        // attributes: ['id', 'firstName', 'lastName', 'email', 'countryCode', 'phone', 'address', 'insurance', 'resume', 'businessLicence', 'driverLicence', 'socialSecurityNo', 'description','paypalId','image'],

        where: {
          id: get_data.provider_id
        },
        include:[
          {
            model:portfolio,
            required:false
          },{
            model:provider_language,
            required:false
          },{
            model:certificate,
            required:false
          },{
            model:availability,
            as:'business_hours',
            required:false
          },{
            model:providerCategory,
            attributes:['id','providerId','categoryId'],
            required:false,
            include:[{
              model:category,
              attributes:['id','name','image'],
              required:false,
            }]
          }
        ]
      });

      if (get_profile_data) {
        get_profile_data = get_profile_data.toJSON();
        delete get_profile_data.password
        }
        
        // console.log(get_profile_data,"================get_profile_data")

        if(get_profile_data.providerCategories !=null){
          for(var i in get_profile_data.providerCategories){
             var get_sub_categories_data = await providerSubCategories.findAll({
               attributes:['id','providerId','subCategoryId','price'],
               where:{
                 providerId:get_data.provider_id
               },include:[
                 {
                   model:subCategory,
                   attributes:['id','name','image'],
                   required:false
                 }
               ]
             });
             get_profile_data.providerCategories[i].providerSubCategories =get_sub_categories_data;
          }
        }
      
      if(get_profile_data ==null){
        get_profile_data={}
      }
      return get_profile_data;

    } catch (error) {
      throw error
    }
  },
  change_password_provider: async function (get_change_password, req, res, check_auth) {

    check_password = await provider.findOne({
      attributes: ['id', 'password'],
      where: {
        id: check_auth.dataValues.id
      }
    })

    const converted_password = crypto.createHash('sha1').update(get_change_password.old_password).digest('hex');

    if (converted_password == check_password.dataValues.password) {

      const new_password = crypto.createHash('sha1').update(get_change_password.new_password).digest('hex');

      const update_details = await provider.update({
        password: new_password,

      },
        {
          where: {

            id: check_auth.dataValues.id

          }
        }
      );
      return update_details;

    } else {

      let msg = 'Old Password Does Not Matches';
      jsonData.wrong_status(res, msg)

    }
  },
  get_my_reviews: async function (check_auth) {
    try {

      get_rating_data = await rating.findAll({
        attributes: ['id', 'userBy', 'userTo', 'ratings', 'description', 'type','createdAt', [sequelize.literal('`user`.`first_name`'), 'userFirstName'], [sequelize.literal('`user`.`last_name`'), 'userLastName'], [sequelize.literal('`user`.`image`'), 'userImage'],[sequelize.fn('AVG', sequelize.col('ratings')), 'ratings']],
        include: [{
          model: user,
          required: false,
          attributes: [],
        }],
        where: {
          userTo: check_auth.dataValues.id,
          //type: 1
        },
        order: [
          ['id', 'desc'],
          
        ],
        group: ['userBy']
      });
      if (get_rating_data) {
        get_rating_data = get_rating_data.map(value => {
          return value.toJSON();
        });
      }
      // console.log(get_rating_data, "get_rating_data"); return;
      return get_rating_data;

    } catch (error) {
      throw error
    }
  },
  get_my_notifications: async function (check_auth) {
    try {

      /* let current_time_data= await this.create_time_stamp()
      console.log(current_time_data,"current_time_data");return; */
      get_notification_data = await notification.findAll({

        where: {
          user2Id: check_auth.dataValues.id,
          userType: 2

        }
      });
      if (get_notification_data) {
        get_notification_data = get_notification_data.map(value => {
          return value.toJSON();
        });
      }
      /* console.log(get_notification_data,"get_notification_data");return; */

      return get_notification_data;

    } catch (error) {
      throw error
    }
  },
  get_categories_provider: async function (type) {
    condition ={}
    condition.status=1
    if(type){
      condition.type=type
    }
    get_category = await category.findAll({
      attributes: ['id', 'name', 'image', 'description','type'],
      where:condition,
      include: [{
        model: subCategory,
        attributes: ['id', 'name', 'image', 'categoryId', 'description'],
        required: false

      }],
      order: [
        ['name', 'asc']
      ]
    });
    if (get_category) {
      get_category = get_category.map(value => {
        return value.toJSON();
      });
    }
    /*  console.log(get_category,"get_category") */
    return get_category;
  },
  get_provider_job_history: async function (get_data, check_auth) {
    try {

      var limit =20;
      if(get_data.limit){
       limit =  Number(get_data.limit);
      }
      var page =1;
      if(get_data.page){
         page = (get_data.page > 0) ?  get_data.page : 1;
      }

      var offset = (page-1) * Number(limit);
      offset =Number(offset);
      let final_array = [];
      get_current_jobs_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId','title','startTime','endTime','startPrice','endPrice', 'description', 'location', 'date', 'status','jobType', 'type',[sequelize.literal(`ifnull((SELECT price FROM bids WHERE order_id = order.id and provider_id=${check_auth.dataValues.id}),0)`), 'bid_price']],
      include: [
        {
          model: orderCategory,
          attributes:['id','categoryId'],
          required: false,
          include:[{
            model:category,
            attributes:['id','name','image'],
            required:false
          }]
        },
        {
          model: orderImages,
          attributes:['id','images'],
          required: false
        },
        {
          model: user,
          attributes:['id','firstName','lastName','image'],
          required: false
        },
        {
          model: bids,
          required: false,
          attributes:['id','providerId','orderId','price','status'],

          on: {
            col1: sequelize.where(sequelize.col('order.id'), '=', sequelize.col('bid.order_id')),
          },
          where: {
            providerId: check_auth.dataValues.id
          }
        },
      ],
        where: {
          providerId: check_auth.dataValues.id,
          [Op.or]: [
            { status: 0 },
            { status: 1 },
            { status: 3 }]
        },
        limit,
        offset
      })
    
    if (get_current_jobs_data) {
      get_current_jobs_data = get_current_jobs_data.map(value => {
        return value.toJSON();
      });
    }
    for( var j in get_current_jobs_data){
      for(var i in get_current_jobs_data[j].orderCategories){
            var get_subcategory = await orderSubcategory.findAll({
              attributes:['id','categoryId'],
              where:{
                categoryId:get_current_jobs_data[j].orderCategories[i].categoryId
              },
              include:[{
                model:subCategory,
                attributes:['id','name','image'],
                required:false
              }],
            
            });
            get_current_jobs_data[j].orderCategories[i].subCategory = get_subcategory;
      }

    }

  //  get past job data -------------------
  get_past_jobs_data = await order.findAll({
        attributes: ['id', 'userId', 'providerId', 'description', 'location', 'date', 'status','jobType', 'type', 'title','startTime','endTime','startPrice','endPrice',[sequelize.literal(`ifnull((SELECT price FROM bids WHERE order_id = order.id and provider_id=${check_auth.dataValues.id}),0)`), 'bid_price']],
      include: [
        {
          model: orderCategory,
          attributes:['id','categoryId'],
          required: false,
          include:[{
            model:category,
            attributes:['id','name','image'],
            required:false
          }]
        },
        {
          model: orderImages,
          attributes:['id','images'],
          required: false
        },
        {
          model: user,
          attributes:['id','firstName','lastName','image'],
          required: false
        },
        {
          model: bids,
          required: false,
          attributes:['id','providerId','orderId','price','status'],
          on: {
            col1: sequelize.where(sequelize.col('order.id'), '=', sequelize.col('bid.order_id')),
          },
          where: {
            providerId: check_auth.dataValues.id
          }
        },
      ],
        where: {
          providerId: check_auth.dataValues.id,
          [Op.or]: [
            { status: 4 },
            { status: 2 },
            { status: 6 }]
            
        }
      })
      if (get_past_jobs_data) {
        get_past_jobs_data = get_past_jobs_data.map(value => {
          return value.toJSON();
        });
      }
      for( var j in get_past_jobs_data){
        for( var i in get_past_jobs_data[j].orderCategories){
            var get_subcategory = await orderSubcategory.findAll({
              attributes:['id','categoryId'],
              where:{
                categoryId:get_past_jobs_data[j].orderCategories[i].categoryId
              },
              include:[{
                model:subCategory,
                attributes:['id','name','image'],
                required:false
              }],
            
            });
    
            get_past_jobs_data[j].orderCategories[i].subCategory = get_subcategory;
    
      }
    }
      //console.log(get_provider_past_jobs,"get_provider_past_jobs");return;

      final_array = {
        'currentJobs': get_current_jobs_data,
        'pastJobs': get_past_jobs_data,
        // 'additionalwork':get_provider_additionalwork
      }
      return final_array
      /*  console.log(get_provider_past_jobs,"get_provider_past_jobs");return; */

    } catch (error) {
      throw error
    }
  },
  user_payment: async function (get_data, check_auth, file_data,req,res) {
    try {
      if (get_data.type == 1) {
        let find_user=await order.findOne({
          attributes: ['id', 'userId'],
          where:{
            id:get_data.order_id
          }
        })
        update_details = await order.update({
          status: 1,
          providerId: get_data.provider_id
        },
          {
            where: {

              id: get_data.order_id,
              //providerId: get_data.provider_id

            }
          }
        );
        update_details = await bids.update({
          status: 1,

        },
          {
            where: {

              providerId: get_data.provider_id,
              order_id: get_data.order_id,
              providerId: get_data.provider_id

            }
          }
        );
        get_provider=await provider.findOne({
        where:{
          id:get_data.provider_id

            }

        });
      var create_invoice=await invoice.create({
        orderId:get_data.order_id,
        userId:find_user.userId,
        providerId:get_data.provider_id,
        cardId:get_data.cardid,
        type:get_data.type,
        amount:get_data.amount,
       // tip:get_data.tip,
        adminFees:get_data.adminfees,
        transectionId:get_data.transaction_id,    

      })
        var update_notificaion = await notification.create({
          orderId:get_data.order_id,
          userType:1,
          userId:check_auth.dataValues.id,
          user2Id:get_provider.dataValues.id,
          message:check_auth.dataValues.firstName  + " accepted your bid ",
          isSeen:0,
          createdAt: await this.create_time_stamp(),
          updatedAt: await this.create_time_stamp()
        });

      } else if(get_data.type == 2) {
        let find_user_add=await additionalWork.findOne({
          attributes: ['id', 'userId'],
          where:{
            orderId: get_data.order_id,
            userId: check_auth.dataValues.id
          }
        })
        if(find_user_add==null){
        update_details = await order.update({
          additionalWork: 1,
          providerId: get_data.provider_id

        },
          {
            where: {

              id: get_data.order_id,


            }
          }
        );
        var create_invoices=await invoice.create({
          orderId:get_data.order_id,
          userId:get_data.userId,
          providerId:get_data.provider_id,
          cardId:get_data.cardid,
          type:get_data.type,
          amount:get_data.amount,
          //tip:get_data.tip,
          adminFees:get_data.adminfees,
          transectionId:get_data.transaction_id,    
  
        })
        let create_additional_work = await additionalWork.create({
          orderId: get_data.order_id,
          userId: check_auth.dataValues.id,
          providerId: get_data.provider_id,
          title: get_data.title,
          price: get_data.price,
          image: file_data
        })
        get_provider_data=await provider.findOne({
          where:{
            id:get_data.provider_id
  
              }
  
          });
        var update_notificaion_work = await notification.create({
          orderId:get_data.order_id,
          userType:1,
          userId:check_auth.dataValues.id,
          user2Id:get_provider_data.dataValues.id,
          message:check_auth.dataValues.firstName  + " added a additional work ",
          isSeen:0,
          createdAt: await this.create_time_stamp(),
          updatedAt: await this.create_time_stamp()
        });
      }else{
        let msg = 'You Already added this job to additional work';
        jsonData.false_status(res, msg)
        return 
      }

      }else if(get_data.type == 3) {
        update_details=await order.update({
          status:4
        },
        {
          where: {
            id: get_data.order_id,
          }
        }
        );
        get_data_invoice= await invoice.findOne({
          where:{
            order_id:get_data.order_id,
          }
        });
        // console.log(get_data_invoice.dataValues.amount,"get_data_invoice");return;
       let total_amount=  Number(get_data_invoice.dataValues.amount)+Number(get_data.tip)
      // console.log(total_amount,"total_amount");return;
                    
        update_invoice=await invoice.update({
         //userId:find_user.userId,
         // providerId:get_data.provider_id,
          cardId:get_data.cardid,
          type:get_data.type,
          amount:total_amount,
          tip:get_data.tip,
          transectionId: get_data.transaction_id
        },
        {
          where: {
            orderId: get_data.order_id,
          }
        }
        );
        get_provider=await provider.findOne({
          where:{
            id:get_data.provider_id
              }
          });
        var creates_notificaion = await notification.create({
          orderId:get_data.order_id,
          userType:1,
          userId:check_auth.dataValues.id,
          user2Id:get_provider.dataValues.id,
          message:check_auth.dataValues.firstName  + " gives you a tip ",
          isSeen:0,
          createdAt: await this.create_time_stamp(),
          updatedAt: await this.create_time_stamp()
        });


      }
      return update_details

    } catch (error) {
      throw error
    }
  },
  get_not_started_jobs: async function (getdata, check_auth) {
    try {

      let get_order_details = await order.findOne({
        attributes: ['id', 'userId', 'providerId', 'categoryId', 'subCategoryId', 'description', 'image', 'location', 'date', 'status', [sequelize.literal('`category`.`name`'), 'categoryName'], [sequelize.literal('`category`.`image`'), 'categoryImage'], [sequelize.literal('`subCategory`.`name`'), 'subCategoryName'], [sequelize.literal('`subCategory`.`image`'), 'subCategoryImage'],[sequelize.literal(`ifnull((SELECT title FROM additional_work WHERE order_id = ${getdata.job_id}),'')`), 'additionalWorkTitle'],[sequelize.literal(`ifnull((SELECT price FROM additional_work WHERE order_id = ${getdata.job_id}),'')`), 'additionalWorkPrice'],[sequelize.literal(`ifnull((SELECT image FROM additional_work WHERE order_id = ${getdata.job_id}),'')`), 'additionalWorkImage']],
        include: [
          {
            model: category,
            required: false,
            attributes: []
          },
          {
            model: subCategory,
            required: false,
            attributes: []
          }
        ],
        where: {
          id: getdata.job_id
        }
      })

      get_bid_detail = await bids.findAll({
        attributes: ['id', 'providerId', 'orderId', 'price', [sequelize.literal('`provider`.`first_name`'), 'firstName'], [sequelize.literal('`provider`.`last_name`'), 'lastName'], [sequelize.literal('`provider`.`image`'), 'image'], [sequelize.literal('`provider`.`description`'), 'providerDescription'],[sequelize.literal('`provider`.`country_code`'), 'countryCode'],
        [sequelize.literal('`provider`.`phone`'), 'phone'],[sequelize.literal('(SELECT ifnull(avg(ratings),0) FROM rating WHERE userTo = bids.provider_id)'), 'avgrating'], [sequelize.fn('Round', sequelize.literal("3959 * acos(cos(radians('" + check_auth.dataValues.latitude + "')) * cos(radians(provider.latitude)) * cos(radians('" + check_auth.dataValues.longitude + "') - radians(provider.longitude)) + sin(radians('" + check_auth.dataValues.latitude + "')) * sin(radians(provider.latitude)))"), 2), 'distance']],
        include: [{
          model: provider,
          required: false,
          attributes: []
        }],
        where: {
          orderId: getdata.job_id,
         // providerId: get_order_details.dataValues.providerId,
          status: 1
        }
      });
      get_order_details.dataValues.bids = get_bid_detail
      // console.log(get_bid_detail,"get_bid_detail");return;
      // console.log(get_order_details,"get_order_details");return;
      return get_order_details

    } catch (error) {
      throw error
    }
  },
  get_note_count: async function (get_data, check_auth) {
    try {
      get_note_count_data = await notification.count({
        where: {
          user2Id: check_auth.dataValues.id,
          userType: 1,
          isSeen: 0
        }
      });
      //console.log(get_note_count_data,"get_note_count_data");return;
      return get_note_count_data

    } catch (error) {
      throw error
    }
  },
  note_user_count: async function (get_data, check_auth) {
    try {
      get_note_count_data = await notification.count({
        where: {
          user2Id: check_auth.dataValues.id,
          userType: 2,
          isSeen: 0
        }
      });
      return get_note_count_data

    } catch (error) {
      throw error
    }
  },
  add_user_card: async function (get_data, check_auth) {
    try {
      let insert_card_details = await userCards.create({
        userId: check_auth.dataValues.id,
        name: get_data.name,
        cardNumber: get_data.card_number,
        expYear: get_data.expiry_year,
        expMonth: get_data.expiry_month

      });
      return insert_card_details


    } catch (error) {
      throw error
    }
  },
  rating_provider: async function (data, check_auth) {
    try {
      let give_rating = await rating.create({
        userby: check_auth.dataValues.id,
        userTo: data.userTo,
        ratings: data.ratings,
        description: data.description,
        type: 2,
        createdAt:await this.create_time_stamp(),
      })
      return give_rating
    }
    catch (error) {
      throw error
    }

  },
  rating_user: async function (data, check_auth,req,res) {
    try {

      get_rate_data= await rating.findOne({
        where:{
          userby: check_auth.dataValues.id,
          userTo: data.userTo,
        }
      });
      // if(get_rate_data==null){
      let give_ratings = await rating.create({
        userby: check_auth.dataValues.id,
        userTo: data.userTo,
        ratings: data.ratings,
        description: data.description,
        type: 1,
        createdAt:await this.create_time_stamp(),
      })
      return give_ratings
    // }else{
    //   let msg = 'You Already Rate this Provider';
    //   jsonData.false_status(res, msg)
    //   return;
    // }
    }
    catch (error) {
      throw error
    }

  },
  get_history_details: async function (get_data, check_auth) {
    try {

      get_invoice = await bids.findOne({
        attributes: ['id', 'providerId', 'orderId', 'price'],

        where: {
          orderId: get_data.job_id,
         // providerId: check_auth.dataValues.id
        }
      })
     // console.log(get_invoice,"get_invoice");return;

      get_setting = await setting.findOne({
        attributes: ['id', 'comission', 'tax']
      })

      get_order_details = await order.findOne({
        attributes: ['id', 'categoryId', 'subCategoryId', 'date', 'location', 'description', 'startjobDate', [sequelize.literal('`category`.`name`'), 'categoryName'], [sequelize.literal('`category`.`image`'), 'categoryImage'], [sequelize.literal('`subCategory`.`name`'), 'subCategoryName'], [sequelize.literal('`subCategory`.`image`'), 'subCategoryImage'],[sequelize.literal(`ifnull((SELECT title FROM additional_work WHERE order_id = order.id),'')`), 'additionalWorkTitle'],[sequelize.literal(`ifnull((SELECT price FROM additional_work WHERE order_id = order.id),'0')`), 'additionalWorkPrice'],[sequelize.literal(`ifnull((SELECT image FROM additional_work WHERE order_id = order.id),'')`), 'additionalWorkImage']],
        include: [
          {
            model: category,
            attributes: [],
            required: false
          }, {
            model: subCategory,
            required: false,
            attributes: [],
            on: {
              col1: sequelize.where(sequelize.col('subCategory.id'), '=', sequelize.col('order.sub_category_id')),
            },
          }
        ],
        where: {
          id: get_data.job_id
        }
      })

      let get_add_data= await additionalWork.findAll({
        where:{
          orderId:get_data.job_id
        },
        raw:true
      })
       //console.log(get_add_data, "get_order_details"); return;



      let total = Number(get_invoice.dataValues.price) + Number(get_setting.dataValues.comission)+Number(get_order_details.dataValues.additionalWorkPrice)+ Number(get_setting.dataValues.tax)
      //  console.log(total,"total");return;
      get_invoice.dataValues.serviceFee = get_setting.dataValues.comission
      get_invoice.dataValues.totalAmount = total
      get_invoice.dataValues.subcategoryName = get_order_details.dataValues.subCategoryName
      get_invoice.dataValues.subCategoryImage = get_order_details.dataValues.subCategoryImage
      get_invoice.dataValues.date = get_order_details.dataValues.date
      get_invoice.dataValues.totalAmount = total
      get_invoice.dataValues.location = get_order_details.dataValues.location
      get_invoice.dataValues.description = get_order_details.dataValues.description
      get_invoice.dataValues.startjobDate = get_order_details.dataValues.startjobDate
      get_invoice.dataValues.additionalWorkTitle = get_order_details.dataValues.additionalWorkTitle
      get_invoice.dataValues.additionalWorkPrice = get_order_details.dataValues.additionalWorkPrice
      get_invoice.dataValues.additionalWorkImage = get_order_details.dataValues.additionalWorkImage
      // console.log(get_invoice,"get_invoice");return;

      return get_invoice

    } catch (error) {
      throw error
    }
  },
  startjob_provider: async function (data, check_auth) {
    try {

      const update_data = await order.update({
        status: data.status,
        startjobDate: data.start_job_date

      },
        {
          where: {
            id: data.job_id
          }
        }
      );
      // if (data.status == 6) {
        let get_cname = await order.findOne({
          attributes: ['id', 'userId','providerId'],
          where: {
            id: data.job_id
          },raw:true
        })
        

        let get_name = await provider.findOne({
          where: {
            id: get_cname.providerId
          }
        })
       
      return get_cname

    }
    catch (error) {
      throw error
    }
  },
  opdertip_user:async function(data, check_auth)
  {
    try{
      
    }
    catch(error){
      throw error
    }
  },
  get_provider_details_for_push:async function(get_data){
    try{
      get_provider_data= await provider.findOne({
        where:{
          id:get_data.provider_id
        },
        raw:true
      });

      return get_provider_data

    }catch(error){
      throw error
    }
  },
  get_user_details_for_push:async function(get_data){
    try{
       get_order_user= await order.findOne({
         attributes:['id','userId','providerId'],
         where:{
           id:get_data.post_id
         }
       });
       get_user_details= await user.findOne({
         where:{
           id:get_order_user.dataValues.userId
         },
         raw:true
       })
       //console.log(get_user_details,"get_user_details");return;
       return get_user_details

    }catch(error){
      throw error
    }
  },
  add_paypal_provider:async function(get_data,check_auth){
    try{
      const update_paypal = await provider.update({
       paypalId:get_data.paypal_id

      },
        {
          where: {
            id: check_auth.dataValues.id
          }
        }
      );

      return update_paypal


    }catch(error){
      throw error
    }
  },

  online_provider_get:async function(data){
    var get_order_category = await orderSubcategory.findAll({
      attributes:['id','subcategoryId'],
      where:{
        orderId:data
      },
      raw:true
    });
    var subcateId =[];
    if(get_order_category){
      for(var i in get_order_category){
        subcateId.push(get_order_category[i].subcategoryId);
      }
      console.log(subcateId,"===============order sub subcateId")
      var get_provider = await this.get_providerby_subcat(subcateId);
      return get_provider;

    }
  },
  
  get_providerby_subcat:async function(data){
    var get_provider = await providerSubCategories.findAll({
      attributes:['id','providerId'],
      where:{
        subCategoryId:data
      },
      group:['providerId'],
      raw:true
    });
    var providerId =[];
    if(get_provider){
      for(var i in get_provider){
        providerId.push(get_provider[i].providerId);
      }
      // console.log(providerId,"=============== providerId");

      var get_available_provider = await this.get_online_provider_(providerId);
      return get_available_provider;

    }
  },
  get_online_provider_:async function(data){
    var get_provider = await provider.findAll({
      attributes:['id','deviceType','deviceToken'],
      where:{
        online:1,
        id:data
      },
      raw:true
    });
    if(get_provider){
      // console.log(get_provider,"=============== get_provider");

       return get_provider;
    }
  },
  /****************  portfolio  ********************/ 
  add_portfolio_provider: async function(data){
    if(data){
      var insert_data = await portfolio.create(data);
      if(insert_data){
        return insert_data;
      }
    }
  },
  edit_portfolio_provider: async function(data){
    if(data){
      var update_data = await portfolio.update(data,{where:{id:data.portfolio_id}});
      if(update_data){
        return update_data;
      }
    }
  },
  delete_portfolio_provider: async function(data){
    if(data){
      var delete_data = await portfolio.destroy({where:{id:data.portfolio_id}});
      if(delete_data){
        return delete_data;
      }
    }
  },

  /*****************  Identity  ********************/
   /****************  portfolio  ********************/ 
   add_identity_provider: async function(data){
    if(data){
      var insert_data = await providerIdentity.create(data);
      if(insert_data){
        return insert_data;
      }
    }
  },
  edit_identity_provider: async function(data){
    if(data){
      var update_data = await providerIdentity.update(data,{where:{id:data.identity_id}});
      if(update_data){
        return update_data;
      }
    }
  },
  delete_identity_provider: async function(data){
    if(data){
      var delete_data = await providerIdentity.destroy({where:{id:data.identity_id}});
      if(delete_data){
        return delete_data;
      }
    }
  }, 

  get_identity_provider: async function(data){
    if(data){
      var get_data = await providerIdentity.findAll({
        attributes:['id','providerId','image'],
        where:
        {
          providerId:data
        },
        raw:true
      });
      if(get_data){
        return get_data;
      }
    }
  },
   /****************  language  ********************/ 
  add_lang_provider: async function(res,data){
    if(data){
      var check_lang = await provider_language.findOne({where:{name:data.name,providerId:data.providerId}});
      if(check_lang){
        var msg ="This language already exist";
        jsonData.already_exist(res, msg)
        return false;
      }
      var insert_data = await provider_language.create(data);
      if(insert_data){
        return insert_data;
      }
    }
  },
  edit_lang_provider: async function(res,data){
    if(data){
      var check_lang = await provider_language.findOne(
        {
          where:
          {
            name:{
              [Op.like] : '%'+data.name+'%'
            },
            providerId:data.providerId,
            id:{
              [Op.ne]:data.lang_id
            }
          }
        });
      if(check_lang){
        var msg ="This language already exist";
        jsonData.already_exist(res, msg)
        return false;
      }
      var update_data = await provider_language.update(data,{where:{id:data.lang_id}});
      if(update_data){
        return update_data;
      }
    }
  },
  delete_lang_provider: async function(data){
    if(data){
      var delete_data = await provider_language.destroy({where:{id:data.lang_id}});
      if(delete_data){
        return delete_data;
      }
    }
  },

  /****************  Certificate  ********************/ 
  add_certificate_provider: async function(data){
    if(data){
      var insert_data = await certificate.create(data);
      if(insert_data){
        return insert_data;
      }
    }
  },
  edit_certificate_provider: async function(data){
    if(data){
      var update_data = await certificate.update(data,{where:{id:data.certificate_id}});
      if(update_data){
        return update_data;
      }
    }
  },
  delete_certificate_provider: async function(data){
    if(data){
      var delete_data = await certificate.destroy({where:{id:data.certificate_id}});
      if(delete_data){
        return delete_data;
      }
    }
  },

  get_provider_PCTL: async function(id,type){
    var get_data =[];
    if(type==0){
       get_data= await portfolio.findAll({where:{providerId:id},raw:true})
    }
    if(type==1){
       get_data= await provider_language.findAll({where:{providerId:id},raw:true})
    }
    if(type==2){
       get_data= await certificate.findAll({where:{providerId:id},raw:true})
    }
    if(type==3){
       get_data= await availability.findAll({where:{providerId:id},raw:true})
    }
    return get_data;
  },

  account_active_deactive: async function(data){
    if(data.type==0){
      var update  = await user.update(
        {
          authKey:'',
          deviceToken:''
        },
        {
          where:{
            id:data.id
          }
        }
      );
    }else{
      var delete_data = await  user.destroy({
        where:{
          id:data.id
        }
      });
    }
    return data.type ;
  },
  account_active_deactive_provider: async function(data){
    if(data.type==0){
      var update  = await provider.update(
        {
          authKey:'',
          deviceToken:''
        },
        {
          where:{
            id:data.id
          }
        }
      );
    }else{
      var delete_data = await  provider.destroy({
        where:{
          id:data.id
        }
      });
    }
    return true;
  },
  user_dispute:async function(data){
    if(data){
      var insert_data = await dispute.create(data);
      if(insert_data){
        return insert_data;
      }
    }
  },
  get_all_language: async function(){
    var get_language = await language.findAll({
      order:[['name','asc']],
      raw:true
    });

    return get_language;
  },
  AndroidPushNotification: async function(data){
    var fcm = new FCM(android_server_key);
    var token = data.token;
      var message = {
      to : token,
      collapse_key: 'BadBoy',
      content_available: true,
      data: {    //This is only optional, you can send any data
        soundname: "default"  ,
        notification_code : data.code,
        body:{
          data:data.body,
          title:'Valeyou',
          message:data.title
        }
          }
    };
    console.log(JSON.stringify(message),"======================= android push");
    fcm.send(message, function(err, response) {
      if(err){
        console.log('error found', err);
      }else {
        console.log('response here', response);
      }
    })
  },
  AndroidPushNotificationMultiple: async function(data){
    var fcm = new FCM(android_server_key);
    var token = data.token;
      var message = {
      registration_ids : token,
      collapse_key: 'BadBoy',
      content_available: true,
      data: {    //This is only optional, you can send any data
        soundname: "default"  ,
        notification_code : data.code,
        body:{
          data:data.body,
          title:'Valeyou',
          message:data.title
        }
          }
    };
    console.log(JSON.stringify(message),"======================= android push");
    fcm.send(message, function(err, response) {
      if(err){
        console.log('error found', err);
      }else {
        console.log('response here', response);
      }
    })
  },
  IosPushNotification: function (data) {
   // console.log(data,"==========")
       var options = {
         cert: __dirname + "/CertificatesHoneyDoProvider.pem",
          key: __dirname + "/CertificatesHoneyDoProvider.pem",
           passphrase:"",
         production: false
       };
     var  bundel_id = 'com.honeydo.provider';
     var apnProvider = new apn.Provider(options);
     if (data.token != '') {
       var new_message = {
         to: data.token,
         code:data.code,
         notification: {
           title: 'Valeyou',
           message:data.title,
           body: data.body,
           sound: "ping.aiff",
 
         },
        //  data: {
        //    body: data.body,
        //    type: data.code,
        //    my_another_key: 'my another value'
        //  }
       };
         var note = new apn.Notification();
         // note.badge = check_count_data;
         note.sound = "ping.aiff";
         note.alert = data.title;
         note.payload = new_message;
         note.topic = bundel_id;

        console.log(note,"========================ios push");
         apnProvider.send(note,data.token).then((result) => {
           console.log(result, "new_message")
         });
       
     }
 
   },

   create_notification : async function(data){
     var create = await notification.create(data);
     return create;
   }
  
}