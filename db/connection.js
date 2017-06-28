var mongoose = require('mongoose');
var path = require('path');
var env = require(path.resolve('./.env'));

var url = `mongodb://${env.DBSettings.HOST}/${env.DBSettings.DB}`;
var connection = mongoose.connect(url);


module.exports = connection;
