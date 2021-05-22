const db= require('../models');
var dateFormat = require('dateformat');
const sequelize=require('sequelize');
const nodemailer = require('nodemailer');
const Op = sequelize.Op;
var crypto = require('crypto');
const user =db.user;
var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');

module.exports= {

	// base url

  	baseUrl: async function () {
    	let path = 'http://localhost:3002'
    	return path;
  	},

  	commafy: async function ( num ) {
	    var str = num.toString().split('.');
	    if (str[0].length >= 5) {
	        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
	    }
	    if (str[1] && str[1].length >= 5) {
	        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
	    }
	    return str.join('.');
	},

	// App base url

  	appBaseUrl: async function () {
    	let path = 'http://localhost:3000'
    	return path;
  	},

	// cleanString

	cleanString: async function(string){
		string = string.replace(/'/g, "\\'");
		string = string.trim();
		return string;
	},

	// getOtp

	getOtp: async function(){
		var op = Math.floor(100000 + Math.random() * 99999);
		return op;
	},

	// random string

	randomString: async function(length){
	   	var result           = '';
	   	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   	var charactersLength = characters.length;
	   	for ( var i = 0; i < length; i++ ) {
	    	result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   	}
   		return result;
	},

	// image upload

	uploadFile: async function(data,folder) {
	 	let image = data;

	 	var dir = process.cwd()+'/server/public/'+folder;

		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir,'0777');
		}

		var ext = path.extname(image.name);

		var new_name = 'riparo_'+ await this.randomString(20) + ext;

		image.mv(process.cwd()+'/server/public/'+folder+'/'+new_name, function(err) {    
			if (err) {     
		        return err;   
		    }else{

		    }
		});

		return folder+'/'+new_name;
	},

	// get date

	getDate: function(type=0){
		var now = new Date();
		if(type === 1){
			return dateFormat(now, "dd-mm-yyyy");
		}else{
			return dateFormat(now, "yyyy-mm-dd H:MM:ss");
		}
	},

	// get Time

	Time: function(){
		var time = Date.now();
		var n = time / 1000;
		return time = Math.floor(n);

	},


	// check required

	checkRequired : function(data){
		var  _final =[];
		for(var i in data){
			_final.push(data[i].msg);
		}
	    var msg =_final.toString();
		var final ={},
		final={
			 'message' : msg,
			 'code':'400'
		 } 
		 return final;

	},

	// return response

	returnResponse:  function(res,success,code,message,data={},_metadata={}){
		res.status(code).json({
			'success':success,
			'code':code,
			'message':message,
			'data':data,
			'_metadata':_metadata
		});
		return false;
	},

  	// read html file

  	readHTMLFile: async function(path, callback) {
	    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
	        if (err) {
	            throw err;
	            callback(err);
	        }
	        else {
	            callback(null, html);
	        }
	    });
	},

	// send email

	sendEmail: async function (req, res, data, template) {

      	var smtpTransport = nodemailer.createTransport({
        	service: 'gmail',
	        auth: {
	          user: process.env.SMTP_USERNAME,
	          pass: process.env.SMTP_PASSWORD
	        }
      	});

      	this.readHTMLFile('server/views/email_templates/' + template, function(err, html) {

		    var template = handlebars.compile(html);

		    data.logo = this.baseUrl + 'images/logo-black.png';

		    var replacements = data;

		    var htmlToSend = template(replacements);

		    const mailOptions = {
		    	from: 'Riparo <'+ process.env.SMTP_USERNAME +'>',
		        to : data.to,
		        subject : data.subject,
		        html : htmlToSend
		    };

		    smtpTransport.sendMail(mailOptions, function (error, response) {
		        if (error) {
		            console.log(error);
		            //callback(error);
		        }
		        return response;
		    });
		});
  	},

  	arrayGroupBy: async function (objectArray, property) {
	  return objectArray.reduce(function (acc, obj) {
	    var key = obj[property];
	    if (!acc[key]) {
	      acc[key] = [];
	    }
	    acc[key].push(obj);
	    return acc;
	  }, {});
	},
}