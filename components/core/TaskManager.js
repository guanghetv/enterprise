var _ = require('underscore');

var TaskManager = function(config, dataManager){
    this.modules = {};
    this.config = config;
    this.dataManager = dataManager;
    this.status = {};
    this.eventQueue = {};
};

TaskManager.prototype.register = function(modules, callback) {
    if(!modules)callback(new Error('modules is undefined .'));
    var that = this;
    modules.forEach(function(module){
        that.modules[ module.name ] = module;
    });

    this.currentModuleKey = _.first(_.keys(this.modules));

    this.currentTaskKey = _.first(this.getCurrentModule().tasks).name;

    console.log("---------",this.currentModuleKey);

    console.log("---------",this.currentTaskKey);

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

TaskManager.prototype.setTaskStatus = function(name, status){
    this.status[ name ] = status;
   // this.tigger('task_end', name);

};

TaskManager.prototype.hasNextTaskKey = function(){
    var ret = false;
    var that = this;
    var taskNameArray = _.pluck(this.getCurrentModule().tasks,'name');
    var index = taskNameArray.indexOf(this.currentTaskKey);
    return index < taskNameArray.length -1;
}

TaskManager.prototype.hasNextModuleKey = function(){
    var that = this;
    var moduleNameArray = _.pluck(this.modules,'name');
    var index = moduleNameArray.indexOf(this.currentModuleKey);
    return index < moduleNameArray.length -1;
}


TaskManager.prototype.runNext = function(err){
    if(this.hasNextTaskKey()){
        this.currentTaskKey = ;
    }else{
        if(this.hasNextModulekey()){
            this.currentModuleKey = this.getNextModuleKey();
        }else{
            this.tigger('all_task_end');
        }
    }
    this.run();
};

TaskManager.prototype.getCurrentModule = function(){
    return this.modules[ this.currentModuleKey ];
};

TaskManager.prototype.getCurrentTask = function(module){
    var that = this;
    return _.find(module.tasks,function(task){
        return task.name == that.currentTaskKey;
    })
};


TaskManager.prototype.run = function(){
    var that = this;
    var currentModule = this.getCurrentModule();
    var currentTask = this.getCurrentTask(currentModule);
    try{
        currentTask.create(this.dataManager, function(err){
            that.runNext(err);
        });
    }catch(e){
        currentTask.restore(this.dataManager);
    } 
    console.log('[TaskManager] TaskManager is running .');
};

//event handler
TaskManager.prototype.on = function(event, callback) {
    if(!(event in this.eventQueue)) this.eventQueue[event] = [];
    this.eventQueue[event].push(callback);
};

TaskManager.prototype.tigger = function(event, args){
    var callback = this.eventQueue[event];
    callback.forEach(function(cb){
        cb(args);
    }); 
};

module.exports = TaskManager;



var run = function (modules, originData, callback) {

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

