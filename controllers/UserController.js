var path = require('path');
var UserModel = require(path.resolve('./models/UserModel'));
var Helper =  require(path.resolve('./helper/service'));
var moment = require('moment');

class UserController{
  constructor() {}

  static login(req , res , next){
    var email = req.body.email;
    var password = req.body.password;

    UserModel.findOne({ 'email': email }, '_id email username password',function (err, user){
      if (err) return console.error(err);
      if(user){
        Helper.comparePassword(password , user.password ,function (err ,passwordMathed){
          if (err) return console.error(err);

          if(passwordMathed){
            return res.json({
              find : true ,
              passwordMathed,
              tokenAcces : Helper.createToken(user)
            });
          }
          else
            return res.json({passwordNotMathed : passwordMathed});

        });
      }
      else
        return res.json({find : false})
    });


  }

  static singup(req , res , next){
    var email = req.body.email;

    UserModel.findOne({ 'email': email }, '_id',function (err, user){
      if (err) return console.error(err);
      if(user)
        return res.json({userExist : true});
      else{

        var user = null , token = null;
        user = new UserModel({
          username : req.body.username,
          email : req.body.email,
          password : req.body.password
        });

        user.save(function(err){
          if(err){
            console.error(err);
            return;
          }
          return res.json({confirmAccount : true});
        });

      }
    });
  }

  static resetPassword(req , res , next){
    var email = req.body.email;
    UserModel.findOne({ 'email': email }, '_id',function (err, user){
      if (err) return console.error(err);
      var token = Helper.createToken(user , moment().add(60 , 'second').unix());
      Helper.sendMail(email , 'Restor Password' , `Hello , to restor password please <h2><a href="http://localhost:4200/restorpassword/${token}"> Password Reset Verification Key</a></h2>`);
      return res.json({toVerifyPasswordRestor : true});
    });
  }

  static restorPassword(req , res , next){
    var token = req.body.restorPasswordToken;
    var  newPassword = req.body.password;

    Helper.unDecodeToken(token , function(err , payload){

      if(err) return res.json({invalidToken : "Invalid token"});

      if(payload.expires <= moment().unix())
        return res.json({tokenExpire : "Token has expires"});

      Helper.hasPassword(newPassword , 12 , function(err , passwordHashed){
        if (err){
          console.error(err);
          return res.json({passwordChanged : false});
        }

        UserModel.update({_id : payload.sub}, { password : passwordHashed } , {updatedAt : Date.now()}, function(error ,raw){
          if (error){
            console.error(error);
            return res.json({passwordChanged : false});
          }
          return res.json({passwordChanged : true});
        });

      });
    });

  }

  static confirmation(req , res , next){
    var token = (req.params.token).toString().trim();

    Helper.unDecodeToken(token , function(err , payload){

      if(err) return res.status(500).send({message : "Invalid Token"});

      if(payload.expires <= moment().unix())
        return res.status(401).send({message : "Token has expires"});

        UserModel.update({_id : payload.sub}, { validatedAccount: true }, null, function(err ,raw){
          if (err) return console.error(err);
          return res.json({validatedAccount : true});
        });

    });
  }

  static viewProfile(req , res , next){}

  static getUser(req, res , next){
    UserModel.findById(req.user,function (err, user){
      if (err) return console.error(err);
      if(user){
        user.password = "undefined";
        return res.json({find : true , userData : user});
      }
      else
        return res.json({find : false})
    });

  }

  static getAllRecipies(req , res , next){}
}

module.exports = UserController;
