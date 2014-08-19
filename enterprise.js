var process = require('child_process');
var CronJob = require('cron').CronJob;

console.log("> %s", 'waiting for cron job start .');

new CronJob('*/10 * * * * *', function(){
	console.log('[CronTab]: Arousing Data Factory.');
	var ps = process.exec('npm run app');
	ps.stdout.on('data', function(logs){
		console.log(logs);
	});
	ps.on('exit', function(){
		console.log('Data Factory accomplished its job.');
	});
}, null, true);
