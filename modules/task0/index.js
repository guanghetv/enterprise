var _ = require('underscore');
exports.create = function(data, originData, callback){
    console.log("--------填充用户信息--------");
    var users = originData.users;
    for(var key in data){
        data[key].forEach(function(item){
            var user = _.find(users,function(user){
                return user.name == key;
            })
            item.user['age'] = user.age;
        })
    }
    callback(null, data);
};

exports.restore = function(){

};