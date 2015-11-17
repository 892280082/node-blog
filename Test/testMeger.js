var megers = require('./megers.js');

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
		name:"polo",
		address:'kexuedadao',
		like:"问题的功能或"
	}
}

function User(name,gender,old){
	this.name = megers.string;
	this.gender = megers.string;
	this.like = megers.string;
	this.old = megers.integer;
	this.time = megers.date;
	this.address = megers.string;
}

var user =  megers.copy(req,new User());
console.log(user);