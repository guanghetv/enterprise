/**
 * Created by solomon on 14-8-18.
 */
var CronJob = require('cron').CronJob;
var shell = require('shelljs');

exports.start = function () {
    new CronJob('0 */10 * * * *', function(){
        console.log('[CronTab]: Arousing Data Factory.');
        shell.exec('npm run app');
    }, null, true);
};