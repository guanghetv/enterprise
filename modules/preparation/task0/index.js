/**
 * Created by solomon on 14-8-21.
 */


exports.create = function (mDataManager, callback) {
   /* var getBasicInfoFromEnterprise = function (callback) {
        var prefix = 'basic_';
        mDataManager.request({"url": mDataManager.config.mothership_url + '/enterprise'}, function (err, response) {
            if (err) {
                console.error(err);
            } else {
                var data = JSON.parse(response);
                _.each(data,function(vaule,key){
                    mDataManager.cache.set(prefix + key, data, function () {
                        callback(null, data);
                        console.log(data);
                    });
                });
            }
        });
    };*/
    callback(null,"hello")
};

exports.restore = function () {

};