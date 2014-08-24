var fulfillCourseInfo = require('./fulfill_course_info');
var calculatePersonalSituation = require('./calculate_personal_situation');

exports.create = function (userId, dataManager, callback) {
    console.log("--------填充 %s 信息--------", userId);

    // 先把这个 user 的 object 取出来
    dataManager.cache.getHash('origin@user', userId, function (err, user) {
        // 再把每条 track 的 各种信息（userInfo,roomInfo,courseInfo）填充进去
        fulfillInfo(userId, JSON.parse(user), function (err, result) {
            callback(err, result);
        })
    });

    var fulfillInfo = function (userId, user, callback) {
        var pattern = '*origin@track@$userId@*';
        dataManager.cache.getKeys(pattern.replace('$userId', userId), function (err, keys) {
            var taskGroup = [];
            var shouldBeRemovedIdObject = {};
            var removeNoUseTracks = function (callback) {
                var taskGroup = [];
                _.each(shouldBeRemovedIdObject, function (shouldBeRemovedIdArray, eventKey) {
                    taskGroup.push(function (cb) {
                        shouldBeRemovedIdArray.forEach(function (id) {
                            dataManager.cache.removeHashField('origin@track@' + userId + '@' + eventKey, id, function (err) {
                                cb(err, 'OK');
                            });
                        })
                    })
                });

                async.parallel(taskGroup, function (err, results) {
                    callback(err, 'OK');
                })
            };

            var addToNoUseTrack = function (eventKey, id, track, errormsg) {
                if (shouldBeRemovedIdObject[eventKey] == undefined) {
                    shouldBeRemovedIdObject[eventKey] = [];
                }
                shouldBeRemovedIdObject[eventKey].push(id);
                console.error(errormsg, track);
            };

            var chapterSituation = {};
            _.each(keys, function (key) {
                taskGroup.push(function (cb) {
                    dataManager.cache.getHash(key, function (err, trackSet) {
                        var trackSetKey = _.last(key.split('@'));
                        var taskGroupForTracks = [];
                        _.each(trackSet, function (track, trackId) {
                            taskGroupForTracks.push(function (callback) {
                                var newTrack = JSON.parse(track);
                                newTrack['user'] = user;
                                fulfillCourseInfo(newTrack, trackId, trackSetKey, dataManager, function (err, result) {
                                    var ret = 'OK';
                                    if (err) {
                                        // 将这条数据标记为无用数据
                                        addToNoUseTrack(key, trackId, track, err);
                                        ret = 'NOT OK';
                                    } else {
                                        // 执行 calculate 方法
                                        calculatePersonalSituation(newTrack, trackSetKey, chapterSituation);
                                    }
                                    callback(null, ret);
                                });
                            });
                        });
                        async.parallelLimit(taskGroupForTracks, 10, function (err, results) {
                            cb(err, 'OK');
                        })
                    })
                })
            });
            async.parallel(taskGroup, function (err, results) {
                //removeNoUseTracks();
                dataManager.cache.setHash("middle@individual@" + userId, chapterSituation, function (err, data) {
                    callback(err, 'OK')
                })
            });
        });
    };
};

exports.restore = function () {

};

