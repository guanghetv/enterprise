exports.run = function (modules, originData, callback) {

    modules[0].create(originData, originData, function (err, data) {
        if (err) {
            modules[0].restore();
        } else {
            callback(err, modules[0].name, data);
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

                var userDistinguishTask = function (obj,callback) {
                    var error = null;
                    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                    console.log("【" +obj.key + "】is running");
                    var d = obj.data[obj.key];
                    for(var i = 0;i<obj.modules.length;i++){
                        sync(obj.modules[i],'create');
                        sync.fiber(function(){
                            obj.modules[i].create(obj.key,d,originData,function(err,newData){
                                if(!err){
                                    d = newData;
                                    //callback(err,modules[i].name, newData);
                                }else{
                                    error = err;
                                }

                            });
                        });
                    }
                    callback(error,obj.key);
                };

                userTasks.push(userDistinguishTask(params,function(err,key){
                    if(!err){
                        console.log(key+" is done!");
                        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                    }
                }));
            });

            async.parallelLimit(userTasks,10,function(err,result){
                if(!err){
                    console.log("hahah")
                }
            })
        }
    });
};
