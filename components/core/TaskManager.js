var TaskManager = function (config, dataManager) {
    this.modules = {};
    this.config = config;
    this.dataManager = dataManager;
    this.status = {};
    this.eventQueue = {};
};

TaskManager.prototype.register = function (modules, callback) {
    if (!modules)callback(new Error('[TaskManager] modules is undefined .'));
    var mTaskManager = this;
    modules.forEach(function (module) {
        mTaskManager.modules[ module.name ] = module;
    });
    callback();
};

TaskManager.prototype.unRegister = function (modules_name, callback) {
    if (!modules)callback(new Error('[TaskManager] modules is undefined .'));
    var mTaskManager = this;
    modules_name.forEach(function (name) {
        if (!mTaskManager.modules[name]) {
            delete mTaskManager.modules[name];
        } else {
            callback(new Error('[TaskManager] not found module %s', name));
        }
    });
    callback();
};

TaskManager.prototype.setTaskStatus = function (name, status) {
    this.status[ name ] = status;
    this.trigger('status_change', {
        name: name,
        status: status
    });
};

TaskManager.prototype.run = function () {
    var mTaskManager = this;
    mTaskManager.trigger('mission_start');

    var moduleGroups = [];

    _.each(mTaskManager.modules, function (module) {
        moduleGroups.push(function (callback) {

            mTaskManager.trigger('module_start', module.name);

            if (module.async != undefined) {
                module.async(mTaskManager.dataManager, function (err, keys) {
                    var keyifyTasks = [];
                    _.each(keys, function (asyncKey) {
                        keyifyTasks.push(function (cb) {
                            console.log("【 %s 】 is running!", asyncKey);
                            mTaskManager.runForEachModule(asyncKey, module, function (err, results) {
                                // 应该将发送数据的操作放在整个 mission 的末尾，尽可能保证用户从前端页面看到 ？？？？
                                if (module.output) {
                                    var hashKey = 'result@$module_name@$async_key';
                                    mTaskManager.dataManager.cache.getHash(hashKey.replace('$module_name', module.name).replace('$async_key', asyncKey),
                                        function (err, allStats) {
                                            var statsArray = _.map(_.values(allStats), function (item) {
                                                return JSON.parse(item);
                                            });

                                            var taskGroups = [];
                                            _.each(statsArray, function (stats) {
                                                taskGroups.push(function (callback) {
                                                    mTaskManager.dataManager.request({method: 'POST', url: mTaskManager.config.datapipe_url+module.output, headers: {'content-type': 'application/json'},
                                                        body: JSON.stringify(stats)}, function (err, statusCode) {
                                                        callback(err, statusCode);
                                                    })
                                                })
                                            });
                                            async.series(taskGroups, function (err, results) {
                                                cb(err, results);
                                            })
                                        }
                                    )
                                }
                            });
                        });
                    });

                    async.parallelLimit(keyifyTasks, module.limit || 3, function (err, results) {
                        mTaskManager.trigger('module_end', module.name);
                        callback(err, results);
                    });
                });
            } else {
                mTaskManager.runForEachModule(null, module, function (err, results) {
                    // Todo: if(module.output)
                    mTaskManager.trigger('module_end', module.name);
                    callback(err, results);
                });
            }
        });
    });

    async.series(moduleGroups, function (err, results) {
        mTaskManager.trigger('mission_end');
    });
};


TaskManager.prototype.runForEachModule = function (asyncKey, module, callback) {
    var mTaskManager = this;
    var taskGroups = [];
    _.each(module.tasks, function (task) {
        taskGroups.push(function (callback) {

            mTaskManager.trigger('task_start', task.name);

            var getArgs = function (asyncKey, dataManager, cb) {
                var args = [];
                if (asyncKey == null) {
                    args = [dataManager, cb];
                } else {
                    args = [asyncKey, dataManager, cb];
                }
                return args;
            };

            try {
                task.create.apply(task.create, getArgs(asyncKey, mTaskManager.dataManager, function (err, data) {
                    var STATUS_SUCCESS = 0x11;
                    mTaskManager.setTaskStatus(task.name, STATUS_SUCCESS);
                    console.log(task.name, data);
                    mTaskManager.trigger('task_end', task.name);
                    callback(err, data);
                }));
            } catch (e) {
                task.restore.apply(task.restore, getArgs(asyncKey, mTaskManager.dataManager, function (err) {
                    mTaskManager.trigger('task_end', task.name);
                    callback(err);
                }));
            }
        })
    });

    async.series(taskGroups, function (err, results) {
        console.log("execute each task result: ", results);
        callback(err, results);
    });

};


//event handler
TaskManager.prototype.on = function (event, callback) {
    if (!(event in this.eventQueue)) this.eventQueue[event] = [];
    this.eventQueue[event].push(callback);
};

TaskManager.prototype.trigger = function (event, args) {
    var handlers = this.eventQueue[event];
    if (handlers) {
        handlers.forEach(function (cb) {
            cb(args);
        });
    }
};

module.exports = TaskManager;