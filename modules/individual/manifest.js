module.exports = {
    "name": "individual",
    "seq": 1,
    "async": function (dataManager, callback) {
        dataManager.getAllTracks(function (err) {
            dataManager.getEnterprise(function (err, info) {
                var trackEvents = JSON.parse(info).track;
                var taskGroups = [];

                _.each(trackEvents, function (eventKey) {
                    taskGroups.push(function (cb) {
                        var usersArrayFromThisEvent = [];

                        dataManager.getCache('track_' + eventKey, function (err, trackSet) {
                            JSON.parse(trackSet).forEach(function (track) {
                                var distinct_id = track.data.properties.distinct_id;
                                usersArrayFromThisEvent.push(distinct_id);
                            })
                            usersArrayFromThisEvent = _.uniq(usersArrayFromThisEvent);
                            cb(null, usersArrayFromThisEvent);
                        })
                    })
                })

                async.parallel(taskGroups, function (err, usersArrays) {
                    var users = _.uniq(_.flatten(usersArrays));
                    console.log(users);
                    callback(err, users);
                })
            })
        });
    },
    "limit": 3,
    "disabled": false

};