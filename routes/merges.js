var router = require('express').Router();
var Home = require('../models/home.js');
var merges = require('../merges/merges.js');

//validate
function checkUser(req,res,next){
	console.log("merges 11 ,run to this");
	next();
}

function getHome(req,res,next){
	res.locals.home = merges.copy(req,Home);
	next();
}

function getCount(){
	var sum = 0;
	return function(req,res,next){
		sum++;
		res.locals.accessNum = sum;
		next();
	}
}


router.get('/index',checkUser,getCount(),function(req,res){
	console.log("merges 28",req.locals);
	res.render('merges');
});

router.post('/index',checkUser,getHome,function(req,res){
	var home = res.locals.home;
	home.save(home,function(err,doc){
		if(err){
			res.redirect('back');
		}
		Home.getAll(function(err,homes){
			if(err){
				res.redirect('back');
			}
			res.render('merges',{
				homes:homes
			});
		});
	});
});

module.exports = router;