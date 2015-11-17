var mongodb = require('./db'),
	merges = require('../merges/merges.js');

function Home(){
	this.title = merges.string;
	this.number = merges.integer;
	this.type = merges.integer;
	this.address = merges.string;
}

module.exports = Home;
