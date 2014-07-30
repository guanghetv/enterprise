var sync = require('synchronize');
function Modules(modules){
    this.modules = modules;
}

Modules.prototype.getModules = function(){
    return this.modules;
};

exports.run = function(modules, originData, callback){
    modules[0].create(originData,originData, function(err, data){
        if(err) {
            modules[0].restore();
        }else{
            callback(err, modules[0].name, data);
            var childModules = modules.splice(1,1);
            var d = data;
            for(var i = 0;i<childModules.length;i++){
                sync(childModules[i],'create');
                sync.fiber(function(){
                   childModules[i].create(d,originData,function(err,newData){
                       d = newData;
                       callback(err, childModules[i].name, newData);
                   });
                });
            }
        }
    });
};
