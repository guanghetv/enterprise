
var moduleLoader	= require('./libs/core/ModuleLoader');
var taskManager		= require('./libs/core/TaskManager');
var cacheManager	= require('./libs/core/CacheManager');
var dataManager		= require('./libs/core/DataManager');
//TODO: use Promise
dataManager.load(function(err, originData){
	if(err)throw err;
	cacheManager.storage(originData, function(err, data){
		moduleLoader.load(function(err, modules){
			taskManager.run(modules, function(err, name, res){
				cacheManager.save(name, res, function(){
					console.log("task save: %s %s", name, res);
				});	
			});
		});
	});	
});

