/*exports.create = function(key,data,originData,callback){
    console.log('-------添加 room 信息-------');
    var rooms = originData.rooms;
    _.each(data,function(track){
        _.each(track.user.rooms,function(roomId,index){
            var roomObject = _.find(rooms,function(room){
                return room.roomId == roomId;
            });
            track.user.rooms[index] = roomObject;
        })
    });
    console.log(JSON.stringify(data));
    callback(null, data);
};*/

exports.create = function(key,data,originData,callback){
    console.log('-------添加 room 信息-------');
    var schools = originData.rooms;

    _.each(data,function(track){
        var userRooms = [];

        for(var index in schools[0].rooms){
            var student = _.find(schools[0].rooms[index].students,function(student){
                return student.oid == track.user._id.oid
            });
            if (student!=undefined){
                userRooms.push(schools[0].rooms[index]);
            }
        }
        track.user.rooms = userRooms;
    });
    console.log(JSON.stringify(data));
    callback(null, data);
};

exports.restore = function(){

};
