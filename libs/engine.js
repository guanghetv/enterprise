var Promise = require('promise');
//core
var moduleLoader	= require('./core/ModuleLoader');
var taskManager		= require('./core/TaskManager');
var cacheManager	= require('./core/CacheManager');
var dataManager		= require('./core/DataManager');

exports.bootstrap = function(config, callback){
	dataManager.load(function(err, data){
		if(err)callback(err);
		cacheManager.storage(data, function(err, res){
			if(err)callback(err);
			moduleLoader.load(function(err, modules){
				if(err)callback(err);
				/*moduleLoader.watch(function(err, module){
					if(err)callback(err);
					taskManager.register(module);
				});*/
				/*taskManager.run(modules, res, function(err, name, d){
					if(err)callback(err);
					cacheManager.save(name, d, function(err ,r){
						if(err)callback(err);
						console.log('[AppEngine] task save :' , r);
					});
				});*/
			});
		});
	});
	callback();
};

