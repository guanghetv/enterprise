/**
 * Created by solomon on 14-8-21.
 */

var getAllRooms = function (dataManager, callback) {
    var prefix = 'origin@room';
    var url = dataManager.config.mothership_url + '/rooms/';

    dataManager.getCache('basic@room', function (err, roomIdsArray) {
        if (err) {
            console.error(err);
            callback(err)
        } else {
            var taskGroups = [];
            _.each(roomIdsArray, function (roomId) {
                taskGroups.push(function (cb) {
                    dataManager.request({"url": url + roomId}, function (err, data) {
                        if (err) {
                            console.error(err);
                            cb(err, "404");
                        } else {
                            var room = JSON.parse(data);
                            dataManager.cache.setHashField(prefix, room._id, room, function (err,result) {
                                cb(err, 'OK');
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
