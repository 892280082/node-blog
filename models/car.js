var crypto = require('crypto');
var mongoose = require('mongoose');
var merges = require('../merges/merges.js');
mongoose.connect('mongodb://localhost/blog');


function car(){
	this.name=String;
	this.password=String;
	this.email=String;
	this.head=String;
	this.time=Date;
}

var car_Schema = new mongoose.Schema(new car(),{collection:'cars'}) ;
var car_Model = mongoose.model('cars',car_Schema);
var export_car = merges.create(car,car_Model);
module.exports = export_car;


var req = {
	query:{
		head:'http://www.baidu.com'
	},
	param:{
		password:'passw0rd'
	},	
	body:{
		
		email:'892323@qq.com',
		name:'shitailong',
		time:'2014-12-1'
	}
}

var car = merges.copy(req,export_car);
console.log(car);
export_car.find(null,function(err,docs){
	console.log(docs);
});

//car.save();

//add
// car.save(function(err){
// 	if(err){
// 		console.log("save",err);
// 	}
// });
//update
// var query = {
// 	name:'shitailong'
// }
// car.constructor.update(query,function(err,docs){
// 	console.log(docs);
// });
//remove
// var query = {
// 	name:'shitailong'
// }
// car.constructor.remove(query,function(err,docs){
// 	console.log(docs);
// })
// //seach
// car.constructor.find(null,function(err,docs){
// 	console.log(docs);
// });




