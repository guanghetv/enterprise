module.exports = {
    "name": "individual",
    "seq": 1,
    "async": function (dataManager, callback) {
        dataManager.getCache('basic@track', function (err, eventKeysArray) {
            var group = [];
            _.each(eventKeysArray, function (eventKey) {
                group.push(function (cb) {
                    var pattern = '*origin@track@$event_name@*';
                    dataManager.cache.getKeys(pattern.replace('$event_name', eventKey), function (err, keys) {
                        var userArrayFromThisEvent = _.map(keys, function (key) {
                            return _.last(key.split('@'));
                        });
                        cb(null, userArrayFromThisEvent);
                    });
                });
            });

            async.series(group, function (err, usersArrays) {
                var users = _.uniq(_.flatten(usersArrays));
                console.log("=================", users);
                callback(err, users);
            })
        });
    },
    "limit": 3,
    "disabled": false
};