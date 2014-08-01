var _ = require('underscore');
exports.create = function(data,originData,callback){
    console.log('----------正在添加 room 信息----------');
    var rooms = originData.rooms;


	callback(null, data);
};

/*exports.restore = function(){

};*/
