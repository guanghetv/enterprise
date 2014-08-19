var process = require('child_process');
var CronJob = require('cron').CronJob;

console.log("> %s", 'waiting for cron job start .');

var env = 'development';

new CronJob('*/10 * * * * *', function(){
	console.log('[CronTab]: Arousing Data Factory.');
	//var ps = process.exec('npm run app > tmp/logs/' + env + (+new Date) + '.log' );
	var ps = process.exec('npm run app');
	ps.stdout.on('data', function(logs){
		console.log(logs);
	});
	ps.on('exit', function(){
		console.log('Task is ended.');	
	});
}, null, true);
