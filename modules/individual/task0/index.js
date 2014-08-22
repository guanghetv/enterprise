exports.create = function (dataManager, callback) {
    console.log("--------填充用户信息--------");
    callback(null,'OK');
   /* callback(null, 'OK');
    *//*
    

    var users = originData.users.all;
    var repairedData = {};
    _.each(data, function (trackSet,trackSetKey) {

        var shouldBeRemovedIndexArray = [];
        var addToNoUseTrack = function (index, track, errormsg) {
            shouldBeRemovedIndexArray.push(index);
            console.error(errormsg,track);
        };

        _.each(trackSet, function (track, index) {
            var user = _.find(users, function (user) {
                return user.username === key;
            });
            var essentialVariables = [user];
            if (Utils.haveEssentialVariables(essentialVariables)) {
                track.user = user;
            } else {
                addToNoUseTrack(index, track, "Didn't find user info from database for this track, delete it:");
            }
        });
        if(shouldBeRemovedIndexArray.length!=0){
            repairedData[trackSetKey] = Utils.deleteMultiElementsFromArrayAtOnce(trackSet, shouldBeRemovedIndexArray);
        }else{
            repairedData[trackSetKey] = trackSet;
        }
    });

    callback(null, repairedData);
     */
};

exports.restore = function () {

};

