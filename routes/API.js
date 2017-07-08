var express = require('express');
var router = express.Router();
var path = require('path');
var UserController = require(path.resolve('./controllers/UserController'));
var Auth =  require(path.resolve('./helper/Auth'));

router.post('/auth/login', UserController.login);

router.post('/auth/singup', UserController.singup);

router.post('/auth/resetPassword' , UserController.resetPassword);

router.post('/auth/restorPassword' , UserController.restorPassword);

router.get('/auth/confirmation/:token', UserController.confirmation);

router.get('/profile/:userID', UserController.viewProfile);

router.get('/user/data', Auth.isAuth , UserController.getUser);

router.get('/recipies/:category/:sortedBy', UserController.getAllRecipies);

module.exports = router;
