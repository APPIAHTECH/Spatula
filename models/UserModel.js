var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var path = require('path');
var service = require(path.resolve('./helper/service'));
var env = require(path.resolve('./.env'));
var connection = require(path.resolve('./db/connection'));

var UserSchema = new Schema({

    providerID : String,
    profile_img : String,
    validationToken : String,
    email : {type : String , require : true},
    username : {type : String , require : true},
    password : {type : String , require : true},
    description : {type : String , default : " "},
    registrationType : {type : String , default : "spatula"},
    validatedAccount : Boolean,
    following :  [{userID : String}],
    followers : [{userID : String}],
    recipies : [{
      recipieID : String,
      name : String,
      previewImg : String,
      description : String,
      comments : [{userID : String , comment : String , postAt : Date}],
      puntuation : Number,
      ingredients : [{name : String , quantity : Number}]
    }],
    createdAt : {type : Date , default : Date.now()},
    updatedAt : Date
} , {collection : 'UsersData'});

UserSchema.pre('save', function (next) {
  var user = this;
  var link = null;
  service.hasPassword(user.password , 10 , function(err , hashedPassword){
    if(err) console.error(err);
    user.password = hashedPassword;
    user.validationToken = service.createToken(user);
    user.validatedAccount = false;
    link = `${env.SERVER.FULLPATH}api/auth/confirmation/${user.validationToken}`;
    if(user.validationToken)
      service.sendMail(user.email , 'Spatula confirmation pendient', "<h1>Hello and welcome to Spatula. Please confirm your email <a href='"+link+"'>confirmation link </a>");
    next();
  });
});

module.exports = connection.model('UsersData', UserSchema);
