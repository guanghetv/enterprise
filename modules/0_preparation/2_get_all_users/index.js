/**
 * Created by solomon on 14-8-21.
 */

var getAllUsers = function (dataManager, callback) {
    var prefix = 'origin@user';
    var url = dataManager.config.mothership_url + '/users';

    dataManager.request({"url": url}, function (err, data) {
        if (err) {
            console.error(err);
            callback(err, "404");
        } else {
            var users = JSON.parse(data);
            var map = _.indexBy(users,'_id');
            dataManager.cache.setHash(prefix, map, function () {
                callback(null, 'OK');
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
