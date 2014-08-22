/**
 * Created by solomon on 14-8-21.
 */

var getAllUsers = function (dataManager, callback) {
    var prefix = 'origin@user_';
    var url = dataManager.config.mothership_url + '/users';

    dataManager.request({"url": url}, function (err, data) {
        if (err) {
            console.error(err);
            callback(err, "404");
        } else {
            var users = JSON.parse(data);
            var groups = [];
            _.each(users, function (user) {
                groups.push(function (cb) {
                    dataManager.cache.set(prefix + user._id, user, function () {
                        cb(null, 'OK');
                    });
                })
            });

            async.parallelLimit(groups,20,function (err, results) {
                callback(err, results);
            });
        }
    });
};

exports.create = function (mDataManager, callback) {
    getAllUsers(mDataManager, function (err, data) {
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
