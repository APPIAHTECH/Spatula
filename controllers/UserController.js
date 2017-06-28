var path = require('path');
var UserModel = require(path.resolve('./models/UserModel'));
var Helper =  require(path.resolve('./helper/service'));
var moment = require('moment');

class UserController{
  constructor() {}

  static login(req , res , next){
    res.send("welcome!"+req.user);
  }

  static singup(req , res , next){

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
      res.json({validatedAccount : false , confirmationPendient : true});
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
          res.json({validatedAccount : true});
        });
        
    });
  }

  static viewProfile(req , res , next){}

  static getAllRecipies(req , res , next){}
}

module.exports = UserController;
