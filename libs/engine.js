//core
var moduleLoader	= require('./core/ModuleLoader');
var taskManager		= require('./core/TaskManager');
var cacheManager	= require('./core/CacheManager');
var dataManager		= require('./core/DataManager');

exports.bootstrap = function(config, callback){
	//dataManager
	dataManager.load(function(err, data){
		if(err)callback(err);
		//cacheManager
		cacheManager.storage(data, function(err, res){
			if(err)callback(err);
			//moduleLoader
			moduleLoader.load(config, function(err, modules){
				if(err)callback(err);
				//moduleWatcher
				moduleLoader.watch(config,function(err, module){
					if(err)callback(err);
					taskManager.register(module);
				});
				//taskManager
				taskManager.run(modules, res, function(msg,err, name, d){
                    if(err)callback(err);
                    if(msg!=undefined && msg === 'all is well'){
                        cacheManager.load(function(err,mem){dataManager.save(mem)},'middle')
                    }else{
                        cacheManager.save(name, d, function(err ,r){
                            if(err)callback(err);
                            console.log('[AppEngine] task save :' , JSON.stringify(r));
                        });
                    }

				});


			});
		});
	});
	callback();
};

