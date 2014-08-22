/**
 * Created by solomon on 14-8-21.
 */



var getAllTracks = function (dataManager, callback) {
    var prefix = 'origin@track@';
    var url = dataManager.config.mothership_url + '/tracks?$and=[{"data.event":"$event_key"},{"$or":[{"data.properties.usergroup":"student"},{"data.properties.roles":"student"}]}]';

    dataManager.getCache('basic@track', function (err, trackEventNamesArray) {
        if (err) {
            console.error(err);
            callback(err)
        } else {
            var taskGroups = [];
            _.each(trackEventNamesArray, function (trackEventName) {
                taskGroups.push(function (cb) {
                    dataManager.request({"url": url.replace('$event_key', trackEventName)}, function (err, data) {
                        if (err) {
                            console.error(err);
                            cb(err, "404");
                        } else {
                            var trackSet = {};
                            _.each(JSON.parse(data), function (track) {
                                trackSet[track._id] = track;
                            });

                            dataManager.cache.setHash(prefix + trackEventName, trackSet, function (err,results) {
                                cb(null, "200");
                            });
                        }
                    });
                });
            });

            async.series(taskGroups, function (err, results) {
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
    getAllTracks(mDataManager, function (err, data) {
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
