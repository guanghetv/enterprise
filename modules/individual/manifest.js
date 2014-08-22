var shouldBeRemovedIdObject = {};

var addToNoUseTrack = function (eventKey, index, track, errormsg) {
    shouldBeRemovedIdObject[eventKey].push(index);
   // console.error(errormsg, track);
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=",index);
};

var removeNoUseTracks = function (dataManager) {
    _.each(shouldBeRemovedIdObject, function (shouldBeRemovedIdArray, eventKey) {
        shouldBeRemovedIdArray.forEach(function(id){
            dataManager.cache.removeHashField('origin@track@'+eventKey,id,function(){});
        })
    })
};

module.exports = {
    "name": "individual",
    "seq": 1,
    "async": function (dataManager, callback) {
        dataManager.getCache('basic@track', function (err, eventKeysArray) {
            console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=",eventKeysArray);
            var group = [];
            _.each(eventKeysArray, function (eventKey) {
                group.push(function (cb) {
                    dataManager.cache.getHash('origin@track@' + eventKey, function (err, tracks) {
                        var usersArrayFromThisEvent = [];
                        _.each(tracks, function (track, index) {
                            track = JSON.parse(track);
                            var essentialVariables = [track.data.properties.distinct_id];

                            if (Utils.haveEssentialVariables(essentialVariables)) {
                                var distinct_id = track.data.properties.distinct_id;
                                usersArrayFromThisEvent.push(distinct_id);
                            } else {
                                addToNoUseTrack(eventKey,track._id, track, "Cannot find distinct_id of this track, delete it:");
                            }
                        });
                        cb(null, usersArrayFromThisEvent);
                    });
                });
            });

            async.series(group, function (err, usersArrays) {
                var users = _.uniq(_.flatten(usersArrays));
                console.log("=================", users);
                removeNoUseTracks(dataManager);
                callback(err, users);
            })

        });
    },
    "limit": 3,
    "disabled": true
};