var engine = require('./libs/engine');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
require('./code.js');

//bootstrap
engine.bootstrap(config, function(err){
    // TODO: 对于异常没有判断，
    // TODO: 对于err请使用console.err
	console.log('enterprise is running .');
});