var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.send("Hey welcome this is git version!");
});

module.exports = router;
