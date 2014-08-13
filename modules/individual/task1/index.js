exports.create = function(key,data,originData,callback){
    console.log('-------添加 room 信息-------');
    var schools = originData.schools.all;
    _.each(data,function(trackSet){
        _.each(trackSet,function(track) {
            var userRooms = [];
            _.each(schools, function (school) {
                _.each(school.rooms, function (room) {
                    var student = _.find(room.students, function (student) {
                        return student == track.user._id
                    });
                    if (student != undefined) {
                        userRooms.push(room);
                    }
                })
            });
            track.user.rooms = userRooms;
        })
    });
    callback(null, data);
};

exports.restore = function(){

};
