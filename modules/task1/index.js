exports.create = function(key,data,originData,callback){
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
};

exports.restore = function(){

};
