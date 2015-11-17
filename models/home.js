var mongodb = require('./db'),
	merges = require('../merges/merges.js');

function Home(){
	this.title = merges.String;
	this.number = merges.Number;
	this.type = merges.Number;
	this.address = merges.String;
}

module.exports = Home;

Home.prototype.save = function(pojo,callback){
	var home = {
		'title':pojo.title,
		'address':pojo.address,
		'type':pojo.type
	}
	mongodb.open(function(err,db){
		if(err){
			return 	callback(err);
		}
		db.collection('homes',function(err,collection){
			if(err){
				mongodb.close();
				return  callback(err);
			}
			collection.insert(home,{safe:true},function(err,doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,doc);
			});
		});
	});
}

Home.getAll = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('homes',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			collection.find(query).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,docs);
			});
		});
	});
}

// Home.getAll(function(err,docs){
// 	console.log(docs);
// });

