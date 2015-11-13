var mongodb = require('./db');

function Comment(name,day,title,comment){
	this.name = name;
	this.day = day;
	this.title = title;
	this.comment = comment;
}

module.exports = Comment;

Comment.prototype.save = function(callback){
	var name = this.name,
		day=this.day,
		title=this.title,
		comment=this.comment;
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		var query = {
			'name':name,
			'time.day':day,
			'title':title
		}
		db.collection('post',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.update(query,{
				$push:{'comments':comment}
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			});
		})
	});

}