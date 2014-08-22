// exports.create = function (data, originData, callback) {
//     console.log("--------按用户分类事件--------");
//     var userifyTracks = {};
//     var tracks = originData.tracks;
//     var repairedData = {};

//     _.each(tracks, function (trackSet, trackSetKey) {

//         var shouldBeRemovedIndexArray = [];
//         var addToNoUseTrack = function (index, track, errormsg) {
//             shouldBeRemovedIndexArray.push(index);
//             console.error(errormsg, track);
//         };

//         _.each(trackSet, function (track, index) {

//             var essentialVariables = [track.data.properties.distinct_id];

//             if (Utils.haveEssentialVariables(essentialVariables)) {
//                 var distinct_id = track.data.properties.distinct_id;
//                 if (userifyTracks[distinct_id] == undefined) {
//                     userifyTracks[distinct_id] = {};
//                 }
//                 if (userifyTracks[distinct_id][trackSetKey] == undefined) {
//                     userifyTracks[distinct_id][trackSetKey] = [];
//                 }
//                 userifyTracks[distinct_id][trackSetKey].push(track);
//             } else {
//                 addToNoUseTrack(index, track, "Cannot find distinct_id of this track, delete it:");
//             }
//         });

//         if(shouldBeRemovedIndexArray.length!=0){
//             repairedData[trackSetKey] = Utils.deleteMultiElementsFromArrayAtOnce(trackSet, shouldBeRemovedIndexArray);
//         }else{
//             repairedData[trackSetKey] = trackSet;
//         }
//     });

//     callback(null, userifyTracks);
// };
// 
exports.create = function(dataManager,callback){
    callback(null,'OK');
}

exports.restore = function () {

};