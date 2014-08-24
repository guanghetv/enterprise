var dispatchByUserId = function (dataManager, callback) {
    var pattern = '*origin@track@*';
    dataManager.cache.getKeys(pattern, function (err, keys) {
        var userIdsArray = _.map(keys, function (key) {
            return key.split('@').slice(2, 3);
        });
        var uniqUserIdsArray = _.uniq(_.flatten(userIdsArray));
        console.log("==============", uniqUserIdsArray);
        callback(null, uniqUserIdsArray);
    });
};

module.exports = {
    "name": "individual",
    "description": "This is a module for analyzing and calculating each student's personal learning situation.",
    "seq": 1,
    "async": dispatchByUserId,
    "limit": 3,
    "disabled": false,
    "output": "/stats/individuals/"
};