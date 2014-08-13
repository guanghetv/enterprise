exports.run = function (modules, originData, callback) {

    modules[0].create(originData, originData, function (err, data) {
        if (err) {
            modules[0].restore();
        } else {
            callback(undefined,err, modules[0].name, data);
            console.log(_.keys(data));
            modules.splice(0, 1);
            var childModules = modules;

            var userTasks = [];
            _.each(data,function(value,key){
                var params = {
                    modules: childModules,
                    key: key,
                    data: data
                };

                var userDistinguishTask = function (obj,cb) {
                    var error = null;
                    //console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                    console.log("【" +obj.key + "】is running");
                    var d = obj.data[obj.key];
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

            async.parallel(userTasks,function(err,result){
                if(!err){
                    callback('all is well');
                }else{
                    callback(undefined,err);
                }
            });

        }
    });
};
