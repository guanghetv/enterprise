exports.create = function (data, originData, callback) {
    console.log("--------按用户分类事件--------");
    var userifyTracks = {};
    var tracks = originData.tracks;


    _.each(tracks, function (trackSet, key) {

        var shouldBeRemovedIndexArray = [];
        var addToNoUseTrack = function (index, track, errormsg) {
            shouldBeRemovedIndexArray.push(index);
            console.error(errormsg, track);
        };

        _.each(trackSet, function (track, index) {

            var essentialVariables = [track.data.properties.distinct_id];

            if (Utils.haveEssentialVariables(essentialVariables)) {
                var distinct_id = track.data.properties.distinct_id;
                if (userifyTracks[distinct_id] == undefined) {
                    userifyTracks[distinct_id] = {};
                }
                if (userifyTracks[distinct_id][key] == undefined) {
                    userifyTracks[distinct_id][key] = [];
                }
                userifyTracks[distinct_id][key].push(track);
            } else {
                addToNoUseTrack(index, track, "Cannot find distinct_id of this track, delete it:");
            }
        });

        Utils.deleteMultiElementsFromArrayAtOnce(trackSet, shouldBeRemovedIndexArray);

    });
    callback(null, userifyTracks);
};

exports.restore = function () {

};