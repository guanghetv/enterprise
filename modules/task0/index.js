exports.create = function(key,data,originData, callback){
    console.log("--------填充用户信息--------");
    var users = originData.users;
    _.each(data,function(track,index){
        var user = _.find(users,function(user){
            return user.username == key;
        });
        track.user = user;
    });
    callback(null, data);
};

exports.restore = function(){

};
