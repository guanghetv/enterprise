exports.create = function (username, dataManager, callback) {
    console.log("--------填充 %s 信息--------",username);

    // 先把这个 user 的 object 取出来
    dataManager.cache.getHash('origin@user', username, function (err, user) {
        fulfillUserInfo(username, JSON.parse(user), function (err, result) {
            callback(err, result);
        })
    });

    // 再把每条 track 的 user 信息填充进去
    var fulfillUserInfo = function (username, user, callback) {
        var pattern = '*origin@track@$username@*';
        dataManager.cache.getKeys(pattern.replace('$username', username), function (err, keys) {
            var taskGroup = [];
            _.each(keys, function (key) {
                taskGroup.push(function (cb) {
                    dataManager.cache.getHash(key, function (err, trackSet) {
                        var newTrackSet = {};
                        _.each(trackSet, function (track, trackId) {
                            var newTrack = JSON.parse(track);
                            newTrack['user'] = user;
                            newTrackSet[trackId] = newTrack;
                        });
                        dataManager.cache.setHash(key, newTrackSet, function (err, result) {
                            cb(err, result);
                        })
                    })
                })
            });

            async.parallel(taskGroup, function (err, results) {
                callback(err, 'OK')
            });
        })

    };
};

exports.restore = function () {

};

