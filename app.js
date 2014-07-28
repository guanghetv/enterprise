var Promise = require('promise');
//core
var moduleLoader	= require('./libs/core/ModuleLoader');
var taskManager		= require('./libs/core/TaskManager');
var cacheManager	= require('./libs/core/CacheManager');
var dataManager		= require('./libs/core/DataManager');
//bootstrap
var bootstrap 		= require('./libs/bootstrap');

var env = process.ENV;
var config = require('./config')[env];

//TODO: use Promise
var dataPromise = new Promise(function(resolve, reject){
	dataManager.load(function(err, originData){
		if(err)reject(err);	
		else resolve(originData);
	}
});

dataPromise.then(function(data){
	var cachePromise = new Promise(function(resolve, reject){
		cacheManager.load(function(err, cachedData){
			if(err)reject(err);
			else resolve(cachedData);
		});
	});
}, function(err){
	console.log('something is wrong .');
});


var modulePromise = new Promise(function(resolve, reject){
	moduleLoader.load(function(err, modules){
		if(err)reject(err);
    else resolve(modules);
	});	
});

var taskPromise = new Promise(function(resolve, reject){
	taskManager.run(modules, function(err, name, data){
		if(err)reject(err);
		else resolve(name, data);
	});
});

exports.bootstrap = function(){

};
