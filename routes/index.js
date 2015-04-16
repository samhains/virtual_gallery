var router = require('express').Router();
var models = require('../models');
var Message = models.Message;

router.get('/', function(req,res,next){
	//console.log("HEY");
	var messages = Message.find(function(err,messages){
		
     	res.render('index',{messages:messages});
  });

});

module.exports = router;