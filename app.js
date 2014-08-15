var engine = require('./libs/engine');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

//TODO: can be move 
require('./code.js');

//bootstrap
engine.bootstrap(config, function(err){
    // TODO: 对于异常没有判断，
    // TODO: 对于err请使用console.err
	if(err)//throw error log to stdout .
		console.error(err);
	console.log('enterprise is running .');
});
