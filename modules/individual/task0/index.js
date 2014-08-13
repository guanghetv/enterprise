exports.create = function(key,data,originData, callback){
    console.log("--------填充用户信息--------");
    var users = originData.users.all;
    _.each(data,function(trackSet){
        _.each(trackSet,function(track){
            var user = _.find(users,function(user){
                return user.username == key;
            });
            track.user = user;
        })
    });
    callback(null, data);
};

exports.restore = function(){

};

