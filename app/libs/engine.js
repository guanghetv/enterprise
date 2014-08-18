//core
var moduleLoader = require('./core/ModuleLoader');
var taskManager = require('./core/TaskManager');
var cacheManager = require('./core/CacheManager');
var dataManager = require('./core/DataManager');

//service
var loginService = require('./services/login');

exports.bootstrap = function (config, callback) {
    loginService.loginMothership(config,function (err) {
        if(err){
            return console.error('Login error:',err);
        }else{
            //dataManager
            dataManager.load(config, function (err, data) {
                if (err)callback(err);
                //cacheManager
                cacheManager.storage(data, function (err, res) {
                    if (err)callback(err);
                    //moduleLoader
                    moduleLoader.load(config, function (err, modules) {
                        if (err)callback(err);
                        //moduleWatcher
                        moduleLoader.watch(config, function (err, module) {
                            if (err)callback(err);
                            taskManager.register(module);
                        });
                        //taskManager
                        taskManager.run(modules, res, function (msg, err, name, d) {
                            if (err)callback(err);
                            if (msg != undefined){
                                switch(msg) {
                                    case 'individual is well':
                                        //TODO: -> cacheManager.loadIntermediate();
                                        cacheManager.load(function (err, mem) {
                                            dataManager.save('individuals',mem)
                                        }, 'middle');
                                        break;
                                    case 'room is well':
                                        cacheManager.load(function (err, mem) {
                                            dataManager.save('rooms',mem)
                                        }, 'middle');
                                        break;
                                    default:
                                }
                            }else {
                                cacheManager.save(name, d, function (err, r) {
                                    if (err)callback(err);
                                    //console.log('[AppEngine] task save :', JSON.stringify(r));
                                });
                            }
                        });
                    });
                });
            });
        }
    });

    callback();
};


