//core
var TaskManager     = require('./core/TaskManager');
var DataManager     = require('./core/DataManager');
var ModuleLoader    = require('./core/ModuleLoader');
var CacheManager    = require('./core/CacheManager');

exports.bootstrap = function (config, callback) {
    //
    var cacheManager = new CacheManager(config);
    //
    var moduleLoader = new ModuleLoader(config);

    //
    var dataManager = new DataManager(config, cacheManager);
    //
    var taskManager = new TaskManager(config, dataManager);
    //
    taskManager.on('error', function(err,info){
        callback(err,info);
    });

    taskManager.on('mission_start', function(){
        console.log('mission start.',new Date());
    });

    taskManager.on('module_start', function(name){
        console.log('module %s start.',name);
    });

    taskManager.on('task_start', function(name){
        console.log('task %s start.',name);
    });

    taskManager.on('task_end', function(name){
        console.log('task %s end.', name);
    });

    taskManager.on('module_end', function(name){
        console.log('module %s end.',name);
    });

    taskManager.on('mission_end', function(){
        console.log('mission end.',Date.now);
        process.exit(0);
    });

    dataManager.on('login_succeed', function(){
        console.log('[LoginService]: Login mothership server succeed!');
        moduleLoaderReady('login');
    });

    var status = [];
    var moduleLoaderReady = function(from){
        status.push(from);
        if(status.length >= 2){
           taskManager.run();
           setTimeout(callback, 0);
        }
    };

    moduleLoader.loadModules(function(err, modules){
        taskManager.register(modules, function(err){
            if(err) return console.error(err);
            moduleLoaderReady('modules')
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