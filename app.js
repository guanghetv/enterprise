//bootstrap
var engine = require('./libs/engine');

var env = process.ENV;
var config = require('./config/config')[env];


engine.bootstrap(config, function(err){
	console.log('enterprise is running .');
});