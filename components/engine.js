//core
var TaskManager     = require('./core/TaskManager').TaskManager;
var DataManager     = require('./core/DataManager').DataManager;
var ModuleLoader    = require('./core/ModuleLoader').ModuleLoader;
var CacheManager    = require('./core/CacheManager').CacheManager;

//service
var loginService = require('./services/login');

exports.bootstrap = function (config, callback) {

    var cacheManager = new CacheManager(config);

    var moduleLoader = new ModuleLoader(config);

    var dataManager = new DataManager(config, cacheManager);

    var taskManager = new TaskManager(config, dataManager);

    var moduleLoaderReady = function(){
        taskManager.run();
    };

    moduleLoader.loadModules(function(err, modules){
        taskManager.register(modules, function(err){
            if(err) return console.error(err);
            console.info('modules %s is register .', modules.join(', '));
            moduleLoaderReady();
        });
    });
    moduleLoader.watch(function(ev,modules){
        switch(ev){
            case 'new':
                taskManager.register(modules, function(err){
                    if(err) return console.error(err);
                    console.info('modules %s is register .', modules.join(', '));
                });
                break;
            case 'remove':
                taskManager.unRegister(modules, function(err){
                    if(err) return console.error(err);
                    console.info('modules %s is un-register .', modules.join(', '));
                });
                break;
        }
    });
};