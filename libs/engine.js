var Promise = require('promise');
//core
var moduleLoader	= require('./core/ModuleLoader');
var taskManager		= require('./core/TaskManager');
var cacheManager	= require('./core/CacheManager');
var dataManager		= require('./core/DataManager');

exports.bootstrap = function(config){
	dataManager.load(function(err, data){
		cacheManager.storage(data, function(err, res){
			moduleLoader.load(function(err, modules){
				moduleLoader.watch(function(err, module){
					taskManager.register(module);
				})
				taskManager.run(modules, res, function(err, name, d){
					cacheManager.save(name, d, function(err ,r){
						console.log('[AppEngine] task save :' , r);
					});
				});
			});
		});
	});
};