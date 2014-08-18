var engine = require('./libs/engine');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

require('./code.js');

//bootstrap
engine.bootstrap(config, function(err){
	if(err){
        console.error(err);
    }else{
        console.log('enterprise is running .');
    }
});
