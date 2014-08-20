var engine = require('./components/engine');
//env
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

//bootstrap
engine.bootstrap(config, function(err){
	if(err){
        console.error(err);
    }else{
        console.log('enterprise is running .');
    }
});
