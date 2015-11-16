var crypto = require('crypto');
User = require('../models/user.js');
Post = require('../models/post.js');
Comment = require('../models/comment.js');

function checkIsLogin(req,res,next){
	if(!req.session.user){
		req.flash('error','not login');
		res.redirect('/login');
	}
	next();
}

function checkIsNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','already login!');
		res.redirect('back');
	}
	next();
}


module.exports = function(app){


	app.get('/',checkIsLogin)
	app.get('/',function(req,res){
		var page = req.query.p ? parseInt(req.query.p) :1;
		Post.getTen(null,page,function(err,posts,total){
			if(err){
				posts = [];
			}
			var user = req.session.user,
				success = req.flash('success').toString(),
				error = req.flash('error').toString();
			res.render('index',{
				title:'主页',
				user:user,
				posts:posts,
				success:success,
				page:page,
				isFirstPage:(page -1) == 0,
				isLastPage:(page -1)*10 + posts.length == total,
				error:error
			});
		});	
	});

	app.get('/reg',checkIsNotLogin);
	app.get('/reg',function(req,res){
		res.render('reg',{
			title:'注册',
			user:req.session.user,
			success:req.flash('success').toString(),
			error:req.flash('error').toString()
		});
	});

	app.post('/reg',checkIsNotLogin);
	app.post('/reg',function(req,res){
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'],
			email = req.body.email;

			//检查用户两次输入的密码是否一致
			if(password_re != password){
				req.flash('error','两次输入的密码不一致');
				return res.redirect('/reg');
			}

			var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
			var newUser = new User({
				name:name,
				password:password,
				email:email
			})
			User.get(newUser.name,function(err,user){
				if(err){
					req.flash('error',err);
					return res.redirect('/');
				}
				if(user){
					req.flash('error','用户已经存在');
					return res.redirect('/reg');
				}
				newUser.save(function(err,user){
					console.log(err,user);
					if(err){
						req.flash('error',err);
						return res.redirect('/reg');
					}
					req.session.user = user;
					req.flash('success','注册成功');
					res.redirect('/');
				})
			})
	});

	app.get('/login',checkIsNotLogin);
	app.get('/login',function(req,res){
		res.render('login',{
			title:'主页',
			user:req.session.user,
			success:req.flash('error').toString(),
			error:req.flash('success').toString()
		});
	});
	
	app.post('/login',checkIsNotLogin);
	app.post('/login',function(req,res){
		var md5 = crypto.createHash('md5'),
		       password = md5.update(req.body.password).digest('hex');
		       //check user
		       User.get(req.body.name,function(err,user){
		       	if(err){
		       		req.flash('error','system error!');
		       		return res.redirect('/login');
		       	}
		       	if(!user){
		       		req.flash('error','user not exists!');
		       		return res.redirect('/login');
		       	}
		       	if(user.password != password){
		       		req.flash('error','password is not right!');
		       		return res.redirect('/login');
		       	}
		       	req.session.user = user;
		       	req.flash('success','login success!');
		       	res.redirect('/');
		       })
	});

	app.get('/post',checkIsLogin);
	app.get('/post',function(req,res){
		Post.getAll(null,function(err,posts){
			if(err){
				posts = [];
			}
			var user = req.session.user,
				success = req.flash('success').toString(),
				error = req.flash('error').toString();
			res.render('post',{
				title:'主页',
				user:user,
				posts:posts,
				success:success,
				error:error
			})
		})
	});

	app.post('/post',checkIsLogin);
	app.post('/post',function(req,res){
		var currentUser = req.session.user,
			tags = [req.body.tag1,req.body.tag2,req.body.tag3],
			post = new Post(currentUser.name,currentUser.head,req.body.title,tags,req.body.post);
		post.save(function(err){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			req.flash('success','发布成功!');
			res.redirect('/');//发布成功跳转到主页
		});
	});

	app.get('/logout',checkIsLogin);
	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','logout success!');
		res.redirect('/');
	});

	app.get('/upload',checkIsLogin);
	app.get('/upload',function(req,res){
		var user = req.session.user,
			success = req.flash('success').toString(),
			error = req.flash('error').toString();
		res.render('upload',{
			title:"文件上传",
			user:user,
			success:success,
			error:error
		});
	});

	app.post('/upload',checkIsLogin);
	app.post('/upload',function(req,res){
		req.flash('success','文件上传成功！');
		res.redirect('/upload');
	});

	app.get('/u/:name',function(req,res){
		User.get(req.params.name,function(err,user){
			var page = req.query.p ? parseInt(req.query.p) :1;
			if(!user){
				req.flash('error','用户不存在');
				return res.redirect('/');
			}
			Post.getTen(user.name,page,function(err,posts,total){
				if(err){
					req.flash('error',err);
					return res.redirect('/');
				}
				var success = req.flash('success').toString(),
					error = req.flash('error').toString();
					sessionUser = req.session.user;
				res.render('user',{
					title:user.name,
					posts:posts,
					user:sessionUser,
					success:success,
					error:error,
					page:page,
					isFirstPage:(page -1) == 0,
					isLastPage:(page -1)*10 + posts.length == total
				});
			});
		});
	});

	app.get('/u/:name/:day/:title',function(req,res){
		Post.getOne(req.params.name,req.params.day,req.params.title,function(err,post){
			if(err){
				req.flash('error',err);
				console.log("indexJs 227  course error!",err);
				return res.redirect('/');
			}
			var success = req.flash('success').toString(),
				error = req.flash('error').toString();
			res.render('article',{
				title:req.params.title,
				post:post,
				user:req.session.user,
				success:success,
				error:error
			});

		});
	});

	app.post('/u/:name/:day/:title',function(req,res){
		var date = new Date(),
			time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();

		var md5 = crypto.createHash('md5'),
			email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
			head = "http://www.gravatar.com/avatar"+email_MD5+"?s=48";

		var comment = {
			name:req.body.name,
			head:head,
			email:req.body.email,
			website:req.body.website,
			time:time,
			content:req.body.content
		};
		//console.log('indexJs 242',comment);
		var newComment = new Comment(req.params.name,req.params.day,req.params.title,comment);
		newComment.save(function(err){
			if(err){
				req.flash('error','sorry save comment course error!');
				return res.redirect('back');
			}
			req.flash('success','save comment success!');
			res.redirect('back');
		});

	});

	app.get('/edit/:name/:day/:title',checkIsLogin);
	app.get('/edit/:name/:day/:title',function(req,res){
		var currentUser = req.session.user;
		Post.edit(currentUser.name,req.params.day,req.params.title,function(err,post){
			if(err){
				req.flash('error',err);
				return res.redirect('back');
			}
			var success = req.flash('success').toString(),
				error = req.flash('error').toString();
			res.render('edit',{
				title:'edit',
				post:post,
				user:req.session.user,
				success:success,
				error:error
			})
		})
	});

	app.post('/edit/:name/:day/:title',checkIsLogin);
	app.post('/edit/:name/:day/:title',function(req,res){
		var user = req.session.user;
		Post.update(user.name,req.params.day,req.params.title,req.body.post,function(err){
			var url = encodeURI('/u'+'/'+req.params.name+'/'+req.params.day+'/'+req.params.title);
			if(err){
				req.falsh('error','sorry ,edit court error!');
				return res.redirect(url);
			}
			req.flash('success','edit ok!');
			res.redirect(url);
		});
	});

	app.get('/remove/:name/:day/:title',checkIsLogin);
	app.get('/remove/:name/:day/:title',function(req,res){
		var user = req.session.user;
		Post.remove(user.name,req.params.day,req.params.title,function(err){
			if(err){
				req.flash('error','sorry remove article coure error!');
				res.redirect('/');
			}
			req.flash('success','remove success!');
			res.redirect('/');
		});
	});

	app.get('/reprint/:name/:day/:title',checkIsLogin);
	app.get('/reprint/:name/:day/:title',function(req,res){
		console.log("indexJs 322  run to this");
		Post.edit(req.params.name,req.params.day,req.params.title,function(err,post){
			if(err){
				req.flash('error',err);
				return res.redirect('back');
			};
			var currentUser = req.session.user,
				reprint_from = {name:post.name,day:post.time.day,title:post.title},
				reprint_to   = { name:currentUser.name,head:currentUser.head};
			Post.reprint(reprint_from,reprint_to,function(err,post){
				if(err){
					req.flash('error',err);
					return res.redirect('back');
				}
				req.flash('success','转载成功!');
				var url = encodeURI('/u/'+post.name+'/'+post.time.day+'/'+post.title);
				res.redirect(url);
			});
		});

	});



	app.get('/archive',checkIsLogin);
	app.get('/archive',function(req,res){
		Post.getArchive(function(err,posts){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			//console.log("indexJS 323",posts);
			var success = req.flash('success').toString(),
				error = req.flash('error').toString();
			res.render('archive',{
				title:'save cord',
				posts:posts,
				user:req.session.user,
				success:success,
				error:error
			})
		});

	});

	app.get('/tags',checkIsLogin);
	app.get('/tags',function(req,res){
		Post.getTags(function(err,posts){
			if(err){
				req.flash('error','get tags course error!');
				return res.redirect('/');
			}
			var success = req.flash('success').toString(),
				error = req.flash('error').toString();
				console.log('indexJs 342',posts);
			res.render('tags',{
				title:'标签',
				posts:posts,
				user:req.session.user,
				success:success,
				error:error
			});
		});
	});

	app.get('/tags/:tag',checkIsLogin);
	app.get('/tags/:tag',function(req,res){
		Post.getTag(req.params.tag,function(err,posts){
			if(err){
				req.flash('error',err);
				return res.redirect('/');
			}
			var success = req.flash('success').toString(),
				error   = req.flash('error').toString();
			res.render('tag',{
				title:'TAG:' + req.params.tag,
				posts:posts,
				user:req.session.user,
				success:success,
				error:error
			});
		});
	});

	app.get('/search',function(req,res){
		Post.search(req.query.keyword,function(err,posts){
			if(err){
				req.flash('error','sorry,search course error!');
				console.log('indexJS 377',err);
			}
			var success = req.flash('success').toString(),
				error   = req.flash('error').toString();
				console.log('indexJS 381',posts);
				res.render('search',{
					title:"SEARCH"+req.query.keyword,
					posts:posts,
					user:req.session.user,
					success:success,
					error:error
				});
		});
	});

	app.get('/links',function(req,res){
		var success = req.flash('success').toString(),
			error   = req.flash('error').toString();
		res.render('links',{
			title:'友情链接',
			user:req.session.user,
			success:success,
			error:error
		});
	});


}