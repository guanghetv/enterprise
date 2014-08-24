var dispatchByUsername = function (dataManager, callback) {
    var pattern = '*origin@track@*';
    dataManager.cache.getKeys(pattern, function (err, keys) {
        var usersArray = _.map(keys, function (key) {
            return key.split('@').slice(2, 3);
        });
        var uniqUsersArray = _.uniq(_.flatten(usersArray));
        console.log("==============", uniqUsersArray);
        callback(null, uniqUsersArray);
    });
};

module.exports = {
    "name": "individual",
    "description": "This is a module for analysis and calculate each student's personal learning situation.",
    "seq": 1,
    "async": dispatchByUsername,
    "limit": 3,
    "disabled": false,
    "output": "/stats/individuals/"
};