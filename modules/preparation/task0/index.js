/**
 * Created by solomon on 14-8-21.
 */

exports.create = function (mDataManager, callback) {
    var getBasicInfoForEnterprise = function (callback) {
        var prefix = 'basic@';
        mDataManager.request({"url": mDataManager.config.mothership_url + '/enterprise'}, function (err, response) {
            if (err) {
                console.error(err);
                callback(err);
            } else {
                var data = JSON.parse(response);
                var taskGroups = [];
                _.each(data,function(value,key){
                    taskGroups.push(function(cb){
                        mDataManager.cache.set(prefix + key, value, function () {
                            cb(null,value)
                        });
                    });
                });

                async.parallel(taskGroups,function(err,results){
                    if(err){
                        console.error(err);
                    }else{
//                      console.log(results);
                    }
                    callback(err);
                });
            }
        });
    };

    getBasicInfoForEnterprise(function(err,data){
        var ret = 'OK';
        if(err){
            console.error(err);
            ret = 'Error';
        }
        callback(err,ret);
    });
};

exports.restore = function () {

};