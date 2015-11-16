var mongodb = require('./db'),
	markdown = require('markdown').markdown;

function Post(name,head,title,tags,post){
	this.name = name;
	this.head = head;
	this.title = title;
	this.tags = tags;
	this.post = post;
	comments = []
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
		head:this.head,
		time:time,
		title:this.title,
		tags:this.tags,
		post:this.post,
		comments : [],
		reprint_info:{},
		pv:0
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
			});
		});
	});
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
	console.log('PostJs',name,day,title);
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
			collection.findOne(query
				,function(err,doc){
				if(err){
					return callback(err);
				}
				console.log("postJS 109",doc);
				if(doc){
					collection.update(query,{
							$inc:{"pv":1}
					},function(err){
						mongodb.close();
						if(err){
							return callback(err);
						}
						doc.post = markdown.toHTML(doc.post);
						doc.comments.forEach(function(comment){
							comment.content = markdown.toHTML(comment.content);
						});
						callback(null,doc);
					});
				}else{
					mongodb.close();
					return callback(null,null);
				}
			});
		});
	});
}

Post.edit = function(name,day,title,callback){
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
			collection.findOne(query
				,function(err,doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,doc);
			})
		})
	})
}

Post.update = function(name,day,title,post,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {
				'name':name,
				'time.day':day,
			}
			collection.update(query,{
					$set:{
						post:post
					}
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});

	});
}

Post.remove = function(name,day,title,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {
				'name':name,
				'time.day':day,
				'title':title
			}
			collection.remove(query,{w:1},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		});
	});
}

Post.getTen = function(name,page,callback){
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
			collection.count(query,function(err,total){
				collection.find(query,{
					skip:(page -1)*2,
					limit:2
				}).sort({
					time:-1
				}).toArray(function(err,docs){
					mongodb.close();
					if(err){
						return callback(err);
					}
					//console.log("postjs 228",docs,total);
					docs.forEach(function(doc){
						doc.post = markdown.toHTML(doc.post);
					});
					callback(null,docs,total);
				});
			});
		});
	});
}

Post.getArchive = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.find({},{
				"name":1,
				"time":1,
				'title':1
			}).sort({
				time:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
};

Post.getTags = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.distinct('tags',function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
}

Post.getTag = function(tag,callback){
	mongodb.open(function(err,db){
		if(err){
			callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {
				"tags":tag
			}
			var include ={
				"name":1,
				"time":1,
				"title":1
			}
			collection.find(query,include).sort({
				"time":-1
			}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
}

Post.search = function(keyWord,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var pattern = new RegExp(keyWord,'i');
			var query = {
				'title':pattern
			}
			var include = {
				'name':1,
				'time':1,
				'title':1
			}
			collection.find(query,include).sort({
				time:-1
			}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
};

Post.reprint = function(reprint_from,reprint_to,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {
				'name':reprint_from.name,
				'time.day':reprint_from.day,
				'title':reprint_from.title
			}
			collection.findOne(query,function(err,doc){
				if(err){
					mongodb.close();
					return callback(err);
				}
				var date = new Date();
				var time = {
					date:date,
					year:date.getFullYear(),
					month:date.getFullYear()+'-'+(date.getMonth()+1),
					day:date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
				}
				delete doc._id;
				doc.name = reprint_to.name;
				doc.head = reprint_to.head;
				doc.time = time;
				doc.title = (doc.title.search(/[转载]/) > -1) ? doc.title : "[转载]" +doc.title;
				doc.comments = [];
				doc.reprint_info = {reprint_from:reprint_from};
				doc.pv = 0;

				collection.update(query,{
					$push:{
						"reprint_info.reprint_to":{
							'name':doc.name,
							'day':time.day,
							'title':doc.title							
						}
					}
				},function(err){
					if(err){
						mongodb.close();
						return callback(err);
					}
					collection.insert(doc,{
						safe:true
					},function(err,doc){
						if(err){
							mongodb.close();
							return callback(err);
						}
						callback(null,doc[0]);
					});
				});
			});
		});
	});
};


















