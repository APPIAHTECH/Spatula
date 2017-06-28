var jwt = require('jwt-simple');
var moment = require('moment');
var bcrypt = require('bcrypt');
var path = require('path');
const url = require('url');
var nodemailer = require('nodemailer');
var env = require(path.resolve('./.env'));

class Service {
  constructor() {}

  static createToken(user){

    var payload = {
      sub : user._id, //Generate a public id for client
      createdAt : moment().unix(),
      expires : moment().add(14 , 'days').unix(),
      mail : user.email
    }

    return jwt.encode(payload , env.JWT.SECREET_TOKEN);
  }

  static unDecodeToken(token , callback){

    try {
      var payload = jwt.decode(token , env.JWT.SECREET_TOKEN);
      callback(false , payload);
    } catch (err) {
      callback(err , null);
    }
  }

  static hasPassword(password , saltRounds , callback){

    bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        callback(err , hash);
      });
    });

  }

  static sendMail(usermail , subject  , msg){

    var transporter = Service.mailConfig();
    var mailOptions = {
        from: `'<${env.MAILSettings.AUTH.USER}>'`,
        to: usermail,
        subject: subject,
        html: msg
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error)return console.log(error);
      console.log('Message %s sent: %s', info.messageId, info.response);

      return;
    });

  }

  static mailConfig(){
    var transporter = nodemailer.createTransport({
        service: env.MAILSettings.SERVICE,
        auth: {
            user: env.MAILSettings.AUTH.USER,
            pass: env.MAILSettings.AUTH.PASSWORD
        }
    });

    return transporter;
  }
  static location(req) {
    return url.format({
        protocol: req.protocol,
        host: req.get('host')
    });
  }

  static comparePassword(){}
}

module.exports = Service;
