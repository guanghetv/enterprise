/**
 * Created by solomon on 14-8-14.
 */
exports.create = function(data,callback){
    console.log("--------按班级分类事件--------");
    console.log(data);
    var roomifyStats = {};
    _.each(data,function(userifyStatsArray){
        var userRooms = userifyStatsArray[0].user.rooms;
        _.each(userRooms,function(room){
            if(roomifyStats[room._id] == undefined){
                roomifyStats[room._id] = [];
            }
            roomifyStats[room._id].push(userifyStatsArray);
        });
    });
    console.log("=========================",roomifyStats);
    callback(null, roomifyStats);
};

exports.restore = function(){

};