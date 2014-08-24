var dispatchByRoomId = function (dataManager, callback) {
    var hashKey = 'origin@room';
    dataManager.cache.getHashFields(hashKey, function (err, roomIdsArray) {
        console.log("==============",roomIdsArray);
        callback(null,roomIdsArray);
    });
};

module.exports = {
    "name": "room",
    "description": "This is a module for analyzing and calculating each room's average learning situation.",
    "seq": 2,
    "async": dispatchByRoomId,
    "limit": 3,
    "disabled":true,
    "output":"/stats/rooms/"
};