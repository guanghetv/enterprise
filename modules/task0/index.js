/*exports.create = function(key,data, originData, callback){
    console.log("--------填充用户信息--------");
    var users = originData.users;

    _.each(data,function(track,index){
        var user = _.find(users,function(user){
            return user.name == key;
        });
        track.user['age'] = user.age;
    });
    console.log(JSON.stringify(data));
	callback(null, data);
};*/

exports.create = function(key,data, originData, callback){
    console.log("--------填充用户信息--------");
    var users = originData.users;

    _.each(data,function(track,index){
        var user = _.find(users,function(user){
            return user.username == key;
        });
        track.user = user;
    });
    console.log(JSON.stringify(data));
    callback(null, data);
};

exports.restore = function(){

};