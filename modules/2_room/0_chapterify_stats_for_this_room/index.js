/**
 * Created by solomon on 14-8-14.
 */
exports.create = function (roomId, dataManager, callback) {

    dataManager.cache.getHash('origin@room', roomId, function (err, room) {
        room = JSON.parse(room);
        var studentIdsArray = room.students;
        var taskGroup = [];

        _.each(studentIdsArray, function (studentId) {
            taskGroup.push(function (cb) {
                var individualResultHashKey = "result@individual@$user_id";
                var hashKey = individualResultHashKey.replace('$user_id', studentId);

                dataManager.cache.getHashFields(hashKey, function (err, chapterIdsArray) {
                    var chapterTaskGroup = [];
                    _.each(chapterIdsArray, function (chapterId) {
                        chapterTaskGroup.push(function (callback) {
                            dataManager.cache.getHash(hashKey, chapterId, function (err, statsForThisChapter) {
                                var roomMiddleHashKey = "middle@room@$room_id@$chapter_id";
                                var middleHashKey = roomMiddleHashKey.replace('$room_id',roomId).replace('$chapter_id', chapterId);
                                dataManager.cache.setHashField(middleHashKey, studentId, JSON.parse(statsForThisChapter), function (err, reply) {
                                    callback(err, 'OK');
                                });
                            })
                        })
                    });

                    async.parallel(chapterTaskGroup, function (err, results) {
                        cb(err, 'OK');
                    })
                })
            });
        });

        async.parallelLimit(taskGroup, 5, function (err, results) {
            callback(null, 'OK');
        });
    });
};

exports.restore = function () {

};