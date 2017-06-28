var express = require('express');
var router = express.Router();
var path = require('path');
var UserController = require(path.resolve('./controllers/UserController'));
var Auth =  require(path.resolve('./helper/Auth'));

router.post('/auth/login', Auth.isAuth , UserController.login);

router.post('/auth/singup', UserController.singup);

router.get('/auth/confirmation/:token', UserController.confirmation);

router.get('/profile/:userID', UserController.viewProfile);

router.get('/recipies/:category/:sortedBy', UserController.getAllRecipies);

module.exports = router;
