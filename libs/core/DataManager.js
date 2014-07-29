/**
 * Created by solomon on 14-7-29.
 */

var request = require('request');

exports.load = function(callback){
    request('http://localhost:2333/origin', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = {};
            data = body;
            console.info('[DataManager]: load data %s', data);
            callback(null, data);
        }else{
            console.err("Error occur when loading origin data: "+ error);
        }
    });
};

exports.save = function(data, callback){
	console.info('[DataManager]: save data %s', data);
	callback(null, data);
};
