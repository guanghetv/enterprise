module.exports = {
    "name": "individual",
    "seq": 1,
    "async": function (dataManager, callback) {


        dataManager.getCache('basic@track', function (err, eventKeysArray) {

            var group = [];
            _.each(eventKeysArray, function (eventKey) {
                group.push(function (cb) {
                    dataManager.getCache('origin@track_' + eventKey, function (err, tracks) {
                        var usersArrayFromThisEvent = [];
                        _.each(tracks, function (track, index) {
                            var essentialVariables = [track.data.properties.distinct_id];

                             if (Utils.haveEssentialVariables(essentialVariables)) {
                                 var distinct_id = track.data.properties.distinct_id;
                                 usersArrayFromThisEvent.push(distinct_id);
                             } else {
                                 addToNoUseTrack(index, track, "Cannot find distinct_id of this track, delete it:");
                             }





                        });
                        cb(null, usersArrayFromThisEvent);
                    });
                });

                async.series(group, function (err, usersArrays) {
                    var users = _.uniq(_.flatten(usersArrays));
                    console.log("=================",users);
                    callback(err, users);
                })
            })
        });
    },
    "limit": 3,
    "disabled": true
};