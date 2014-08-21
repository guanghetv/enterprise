//core
var TaskManager     = require('./core/TaskManager');
var DataManager     = require('./core/DataManager');
var ModuleLoader    = require('./core/ModuleLoader');
var CacheManager    = require('./core/CacheManager');
var MissionManager   = require('./core/MissionManager');

exports.bootstrap = function (config, callback) {
    console.log('[ENGINE] enterprise is running');
    //
    var cacheManager = new CacheManager(config);
    //
    var moduleLoader = new ModuleLoader(config);

    //
    var dataManager = new DataManager(config, cacheManager);
    //
    var taskManager = new TaskManager(config, dataManager);
    //
    taskManager.on('error', function(err){
        callback(err);
    });
    //
    taskManager.on('task_end', function(name){
        console.log('task %s ended.', name);
    });

    taskManager.on('all_task_end', function(name){
        console.log('all tasks are ended .');
        process.exit(0);
    });

    var moduleLoaderReady = function(){
        console.log('[ENGINE] moduleLoader is ready .');
        taskManager.run();
        callback();
    };

    moduleLoader.loadModules(function(err, modules){
        taskManager.register(modules, function(err){
            if(err) return console.error(err);
            setTimeout(moduleLoaderReady, 100);
            console.info('[ENGINE] %s modules is register .', modules.length);
        });
    });
    moduleLoader.watch(function(ev,modules){
        switch(ev){
            case 'new':
                taskManager.register(modules, function(err){
                    if(err) return console.error(err);
                    console.info('[ENGINE] %s modules is register .', modules.length);
                });
                break;
            case 'remove':
                taskManager.unRegister(modules, function(err){
                    if(err) return console.error(err);
                    console.info('[ENGINE] %s modules is un-register .', modules.length);
                });
                break;
        }
    });
};