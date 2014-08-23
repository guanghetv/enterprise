/**
 * Created by solomon on 14-8-21.
 */

var fulfillUserRooms = function (dataManager, callback) {
    dataManager.cache.getHashFields('origin@user', function (err, usernamesArray) {
        var taskGroup = [];
        _.each(usernamesArray, function (username) {
            taskGroup.push(function(cb){
                dataManager.cache.getHash('origin@user', username, function (err, user) {
                    user = JSON.parse(user);
                    dataManager.cache.getHashFields('origin@room', function (err, roomIdsArray) {
                        var taskGroup = [];
                        var roomsArray = [];
                        _.each(roomIdsArray, function (roomId) {
                            taskGroup.push(function (callback) {
                                dataManager.cache.getHash('origin@room', roomId, function (err, room) {
                                    room = JSON.parse(room);
                                    if(_.contains(room.students,user._id)){
                                        roomsArray.push(room);
                                    }
                                    callback(err,'OK');
                                });
                            })
                        });

                        async.parallel(taskGroup, function (err, results) {
                            user['rooms'] = roomsArray;
                            dataManager.cache.setHashField('origin@user',username,user,function(err,result){
                                cb(err,'OK');
                            })
                        })
                    });
                });
            });
        });

        async.parallelLimit(taskGroup,100,function(err,results){
            callback(err,'OK');
        });
    })
};

exports.create = function (mDataManager, callback) {
    fulfillUserRooms(mDataManager, function (err, data) {
        var ret = 'OK';
        if (err) {
            console.error(err);
            ret = 'Error';
        }
        callback(err, ret);
    });
};

exports.restore = function () {

};
