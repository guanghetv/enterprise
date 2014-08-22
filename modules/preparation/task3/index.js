/**
 * Created by solomon on 14-8-21.
 */



var getAllRooms = function (dataManager, callback) {
    var prefix = 'origin@room_';
    var url = dataManager.config.mothership_url + '/school/';

    dataManager.getCache('basic@school', function (err, schoolIdsArray) {
        if (err) {
            console.error(err);
            callback(err)
        } else {
            var taskGroups = [];
            _.each(schoolIdsArray, function (schoolId) {
                taskGroups.push(function (cb) {
                    dataManager.request({"url": url + schoolId}, function (err, data) {
                        if (err) {
                            console.error(err);
                            cb(err, "404");
                        } else {
                            var rooms = JSON.parse(data).rooms;
                            var groups = [];
                            _.each(rooms, function (room) {
                                groups.push(function (cb) {
                                    //console.log(room);
                                    dataManager.cache.set(prefix + room._id, room, function () {
                                        cb(null, 'OK');
                                    });
                                })
                            });

                            async.parallel(groups, function (err, results) {
                                cb(err, '200');
                            });
                        }
                    });
                });
            });

            async.parallel(taskGroups, function (err, results) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(results);
                }
                callback(err);
            });
        }
    });
};

exports.create = function (mDataManager, callback) {
    getAllRooms(mDataManager, function (err, data) {
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
