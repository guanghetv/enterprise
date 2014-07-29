var engine = require('./libs/engine');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

//bootstrap
engine.bootstrap(config, function(err){
	console.log('enterprise is running .');
});