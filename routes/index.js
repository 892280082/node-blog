module.exports = function(app){
	app.get('/',function(req,res){
		res.render('index',{title:'index'});
	});

	app.get('/reg',function(req,res){
		res.render('index',{title:'reg'});
	});

	app.post('/reg',function(req,res){
		
	});

	app.get('/login',function(req,res){
		res.render('index',{title:'login'});
	});
	app.post('/login',function(req,res){
	});

	app.get('/post',function(req,res){
		res.render('index',{title:'post'});
	});

	app.post('/post',function(req,res){
	});

	app.get('/logout',function(req,res){
	});
}