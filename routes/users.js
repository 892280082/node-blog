var merges = require('../merges/merges.js'),
	Home = require('../models/home.js');
module.exports = function(app){
	var name_space = "/merges";
	app.get(name_space+'/index',function(req,res){
		res.render('merges');
	});

	app.post(name_space+'/index',function(req,res){
		var home = merges.copy(req,Home);
		home.save(home,function(err,doc){
			if(err){
				res.redirect('back');
			}
			Home.getAll(function(err,homes){
				if(err){
					res.redirect('back');
				}
				console.log(homes);
				res.render('merges',{
					homes:homes
				});
			});
		});
	});
}

