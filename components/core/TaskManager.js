
var TaskManager = function(config, dataManager){
    this.modules = {};
    this.config = config;
    this.dataManager = dataManager;
};

TaskManager.prototype.register = function(modules, callback) {
    if(!modules)callback(new Error('modules is undefined .'));
    var that = this;
    modules.forEach(function(module){
        that.modules[ module.name ] = module;
    });
    callback();
};

TaskManager.prototype.unRegister = function(modules_name, callback) {
    if(!modules)callback(new Error('modules is undefined .'));
    var that = this;
    modules_name.forEach(function(name){
        if(!that.modules[name]){
            delete that.modules[name];
        }else{
            callback(new Error('not found module %s', name));
        }
    });
    callback();
};

TaskManager.prototype.run = function(first_argument) {
    // body...
};

module.exports.TaskManager = TaskManager;

//


var cacheManager = require('./CacheManager');
exports.run = function (modules, originData, callback) {

    // TODO: 规定TaskManager"只"执行对于task的操作，每个task内部"只"做数据操作，两者职责要划清
    // TODO: Module[0]目前包含两部分操作，track的数据操作和对于其他模块的任务分配
    // TODO: 所以请把Module[0]中对于其他module的操作移入TaskManager，而对于数据处理的部分请保持在Module[0]里面
    console.log("==========================> INDIVIDUAL DIMENSION <=======================");

    modules[0].create(originData, originData, function (err, data) {
        if (err) {
            modules[0].restore();
        } else {
            callback(undefined,err, modules[0].name, data);
            console.log(_.keys(data));

            // TODO: var childModules = modules.splice(0,1);
            modules.splice(0, 1);
            var childModules = modules;

            // TODO: userTasks -> taskGroups
            var userTasks = [];
            _.each(data,function(value,key){
                var params = {
                    modules: childModules,
                    key: key,
                    data: data
                };

                // TODO: userDistinguishTask -> execute
                // TODO: 重要!! 请参见根目录TODO.txt第4条
                var userDistinguishTask = function (obj,cb) {
                    var error = null;
                    //console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                    console.log("【" +obj.key + "】is running");
                    var d = obj.data[obj.key];
                    // TODO: _.each()
                    for(var i = 0;i<obj.modules.length;i++){
                        sync(obj.modules[i],'create');
                        sync.fiber(function(){
                            obj.modules[i].create(obj.key,d,originData,function(err,newData){
                                if(!err){
                                    d = newData;
                                    callback(undefined,err,modules[i].name, newData);
                                }else{
                                    error = err;
                                }
                            });
                        });


                    }
                    cb(error,obj.key)
                };

                userTasks.push(
                    function(callback){
                        userDistinguishTask(params,function(err,key){
                            if(!err){
                             console.log(key+" is done!");
                             callback(err,key);
                             //console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                            }
                        });
                    }
                );
            });

            async.parallelLimit(userTasks,3,function(err,result){
                if(!err){
                    callback('individual is well');
                    //-----------------------
                    (function(){
                        console.log("==========================> ROOM DIMENSION <==============================");
                        var task  = require('../../modules/room/task/index.js');
                        var task0 = require('../../modules/room/task0/index.js');
                        var task1 = require('../../modules/room/task1/index.js');
                        var modules = [task,task0,task1];
                        cacheManager.load(function (err, mem) {
                            var originStats = mem.crew_0003;
                            modules[0].create(originStats,function(err,data){
                                if(err){
                                    callback(undefined,err);
                                }else{
                                    callback(undefined,err,"crew_room",data);
                                    console.log(_.keys(data));
                                    modules.splice(0, 1);
                                    var childModules = modules;

                                    var taskGroups = [];
                                    _.each(data,function(value,key){
                                        var params = {
                                            modules: childModules,
                                            key: key,
                                            data: data
                                        };

                                        var roomDistinguishTask = function (obj,cb) {
                                            var error = null;
                                            //console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                                            console.log("【" +obj.key + "】is running");
                                            var d = obj.data[obj.key];
                                            for(var i = 0;i<obj.modules.length;i++){
                                                sync(obj.modules[i],'create');
                                                sync.fiber(function(){
                                                    obj.modules[i].create(obj.key,d,function(err,newData){
                                                        if(!err){
                                                            d = newData;
                                                            callback(undefined,err,'crew_room_000'+i, newData);
                                                        }else{
                                                            error = err;
                                                        }
                                                    });
                                                });
                                            }
                                            cb(error,obj.key)
                                        };

                                        taskGroups.push(
                                            function(callback){
                                                roomDistinguishTask(params,function(err,key){
                                                    if(!err){
                                                        console.log(key+" is done!");
                                                        callback(err,key);
                                                        //console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                                                    }
                                                });
                                            }
                                        );
                                    });

                                    async.parallelLimit(taskGroups,3,function(err,result) {
                                        if (!err) {
                                            callback('room is well');
                                        }else{
                                            callback(undefined,err);
                                        }
                                    });
                                }
                            });
                        }, 'middle');
                    })();
                    //--------------------------
                }else{
                    callback(undefined,err);
                }
            });
        }
    });
};
