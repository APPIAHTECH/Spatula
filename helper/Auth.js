var Helper = require('./service');
var moment = require('moment');

class Auth {
  constructor() {}

  static isAuth(req, res , next){

    if(!req.headers.authorization)
      return res.status(403).send({message : "Permision Deniend"});

    var token = req.headers.authorization.split(' ')[1];
    Helper.unDecodeToken(token , function(err , payload){

      if(err) return res.status(500).send({message : "Invalid Token"});

      if(payload.expires <= moment().unix())
        return res.status(401).send({message : "Token has expires"});

        req.user = payload.sub;
        next();
    });
  }
}


module.exports = Auth;
