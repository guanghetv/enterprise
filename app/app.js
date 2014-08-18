var engine = require('./libs/engine');
var CronJob = require('cron').CronJob;
var shell = require('shelljs');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

require('./code.js');

//bootstrap
engine.bootstrap(config, function(err){
	if(err){
        console.error(err);
    }else{
        console.log('enterprise is running .');
        new CronJob('0 */5 * * * *', function(){
            console.log('[CronTab]: Arousing Data Factory.');
            shell.exec('npm run app');
        }, null, true);
    }
});
