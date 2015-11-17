var megers = require('./merges.js');

var req = {
	query:{
		name:"sdfsdf"
	},
	param:{
		name:'luoli',
		gender:'woman',
		old:'123',
		time:"2015-10-5"
	},	
	body:{
		name:'aboluo',
		address:'kexuedadao',
		like:"问题的功能或"
	}
}

function User(name,gender,old){
	this.name = megers.String;
	this.gender = megers.String;
	this.like = megers.String;
	this.old = megers.Number;
	this.time = megers.Date;
	this.address = megers.String;
	this.do = function(){
		console.log("my name is "+this.name);
	}
}

var user =  megers.copy(req,User);
console.log(user);
user.do();