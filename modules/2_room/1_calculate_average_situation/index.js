/**
 * Created by solomon on 14-8-24.
 */
var chapterAlgorithm = require('./calculate_average_situation');

exports.create = function (roomId, dataManager, callback) {
    var pattern = '*middle@room@$room_id*';
    dataManager.cache.getKeys(pattern.replace('$room_id', roomId), function (err, keys) {
        var chapterIdsArray = _.map(keys, function (key) {
            return _.last(key.split('@'));
        });

        if (chapterIdsArray.length > 0) {
            var taskGroups = [];
            _.each(chapterIdsArray, function (chapterId) {
                var chapterDistinguishTask = function (stats, cb) {
                    chapterAlgorithm(stats,function (err, ret) {
                        dataManager.cache.getHash('origin@room', roomId, function (err, room) {
                            ret['room'] = JSON.parse(room);
                            cb(err, ret);
                        })
                    });
                };

                taskGroups.push(
                    function (callback) {
                        dataManager.cache.getHash('middle@room@' + roomId + '@' + chapterId, function (err, userifyStats) {

                            var stats = _.map(_.values(userifyStats), function (item) {
                                return JSON.parse(item);
                            });

                            chapterDistinguishTask(stats, function (err, ret) {
                                if (!err) {
                                    console.log("Chapter " + chapterId + " is done!");
                                }

                                dataManager.cache.setHashField('result@room@'+roomId,chapterId,ret,function(err,result){
                                    callback(err, 'OK');
                                });
                            });
                        });
                    }
                );
            });

            async.parallelLimit(taskGroups, 3, function (err, result) {
                var ret = 'OK';

                if (err) {
                    ret = 'ERROR'
                }
                callback(err, ret);
            });
        } else {
            callback(null, 'OK');
        }
    });
};

exports.restore = function () {

};