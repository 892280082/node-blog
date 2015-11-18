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
		name:"sdfsdf",
		head:'http://www.baidu.com'
	},
	param:{
		name:'luoli',
		password:'passw0rd'
	},	
	body:{
		name:'shitailong',
		email:'892323@qq.com',
		time:'2014-12-1'
	}
}

var car = merges.copy(req,export_car);
car.save();
console.log(car);



