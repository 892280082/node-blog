var crypto = require('crypto');
var mongoose = require('mongoose');
var merges = require('../merges/merges.js');
mongoose.connect('mongodb://localhost/blog');

var carSchema = new mongoose.Schema({
	name:String,
	password:String,
	email:String,
	head:String
},{
	collection:'cars'
}) ;
var carModel = mongoose.model('cars',carSchema);



function Car(){
	this.name = merges.String;
	this.password = merges.String;
	this.email = merges.String;
	this.head = merges.String;
	this._mongoose = carModel;
}

module.exports = Car;
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
		email:'892323@qq.com'
	}
}

var car = merges.copy(req,Car);
car.save();
console.log(car);



