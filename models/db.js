var settings = require('../settings'),
	 Db = require('mongodb').Db,
 	connection = require('mongodb').Connection,
 	server = require('mongodb').Server;

module.exports = new Db(settings.db,new Server(settings.host,settings.port),{safe:true});