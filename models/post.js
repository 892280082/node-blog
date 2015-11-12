var mongodb = require('./db'),
	markdown = require('markdown').markdown;

function Post(name,title,post){
	this.name = name;
	this.title = title;
	this.post = post;
}

module.exports = Post;

Post.prototype.save = function(callback){
	var date = new Date();

	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+'-'+(date.getMonth()+1),
		day:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
	}

	var post = {
		name:this.name,
		time:time,
		title:this.title,
		post:this.post
	}

	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(post,{safe:true},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
		})
	})
}

Post.getAll = function(name,callbak){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			//根据query对象查询文章
			collection.find(query).sort({
				time:-1
				}).toArray(function(err,docs){
					mongodb.close();
					if(err){
						return callbak(err);
					}
					docs.forEach(function(doc){
						doc.post = markdown.toHTML(doc.post);
					})
					callbak(null,docs);
				});
		})
	});
}

Post.getOne = function(name,day,title,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection("post",function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {
				'name':name,
				'time.day':day,
				'title':title
			}
			console.log('query',query);
			collection.findOne(query
				,function(err,doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				doc.post = markdown.toHTML(doc.post);
				callback(null,doc);
			})
		})
	})


}



