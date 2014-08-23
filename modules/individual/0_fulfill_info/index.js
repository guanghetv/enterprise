var fulfillCourseInfo = require('./fulfill_course_info');

exports.create = function (username, dataManager, callback) {
    console.log("--------填充 %s 信息--------", username);

    // 先把这个 user 的 object 取出来
    dataManager.cache.getHash('origin@user', username, function (err, user) {
        fulfillInfo(username, JSON.parse(user), function (err, result) {
            callback(err, result);
        })
    });

    // 再把每条 track 的 user 信息填充进去
    var fulfillInfo = function (username, user, callback) {
        dataManager.cache.getHash('origin@room', function (err, rooms) {
            //console.log(rooms);
            //rooms = JSON.parse(rooms);

            var roomsArray = [];
            _.each(rooms, function (room) {
                room = JSON.parse(room);
                var student = _.find(room.students, function (studentId) {
                    return studentId == user._id;
                });
                if (student != undefined) {
                    roomsArray.push(room);
                }
            });

            user['rooms'] = roomsArray;

            var pattern = '*origin@track@$username@*';
            dataManager.cache.getKeys(pattern.replace('$username', username), function (err, keys) {
                var taskGroup = [];
//                var shouldBeRemovedIdObject = {};
//                var removeNoUseTracks = function (callback) {
//                    var taskGroup = [];
//                    _.each(shouldBeRemovedIdObject, function (shouldBeRemovedIdArray, eventKey) {
//                        taskGroup.push(function (cb) {
//                            shouldBeRemovedIdArray.forEach(function (id) {
//                                dataManager.cache.removeHashField('origin@track@' + username + '@' + eventKey, id, function (err) {
//                                    cb(err, 'OK');
//                                });
//                            })
//                        })
//                    });
//
//                    async.parallel(taskGroup, function (err, results) {
//                        callback(err, 'OK');
//                    })
//                };
                _.each(keys, function (key) {
                    taskGroup.push(function (cb) {




                        dataManager.cache.getHash(key, function (err, trackSet) {
                            var newTrackSet = {};
                            _.each(trackSet, function (track, trackId) {


                                var newTrack = JSON.parse(track);
                                newTrack['user'] = user;
                                newTrackSet[trackId] = newTrack;

                                fulfillCourseInfo(newTrack, trackId, key, dataManager, username, shouldBeRemovedIdObject,function(err,result){

                                    if(err){
                                        // 将这条数据标记为无用数据   里面的 addtonouse 需要立刻 callback error
                                    }else{
                                        // 执行 calculate 方法
                                    }
                                });

                            });

                           // removeNoUseTracks()


                            dataManager.cache.setHash(key, newTrackSet, function (err, result) {
                                cb(err, result);
                            })
                        })

                    })
                });
                async.parallel(taskGroup, function (err, results) {
                    remove
                    callback(err, 'OK')
                });
            })
        });
    };
};

exports.restore = function () {

};

