/**
 * Created by solomon on 14-7-29.
 */

var request = require('request');

exports.load = function(callback){
    request('http://localhost:2333/origin', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            console.info('[DataManager]: load data %s', data);
            callback(null, data);
        }else{
            console.error("Error occur when loading origin data: "+ error);
            callback(error);
        }
    });
};

exports.save = function(data, callback){
	console.info('[DataManager]: upload data %s', JSON.stringify(data.crew_0003));
    var finalStats = data.crew_0003;

    var postStats = function(data,callback){
        request(
            {
                method: 'POST',
                uri: 'http://localhost:3002/stats/individuals',
                headers:{'content-type': 'application/json'},
                body:JSON.stringify(data)
            },

            function (error, response, body) {
                if(response.statusCode == 200){
                    console.log(body);
                } else {
                    console.log('error: '+ response.statusCode);
                    console.log(body)
                }
                callback(error,response.statusCode);
            }
        );
    };

    var uploadTasks = [];
    _.each(finalStats,function(stat){
       uploadTasks.push(function(cb){
           postStats(stat,function(err,statusCode){
               cb(err,statusCode);
           });
       })
    });

    async.parallelLimit(uploadTasks,10,function(err,result){
        console.log(result);
    });
};