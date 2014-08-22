/**
 * Created by solomon on 14-8-21.
 */

exports.create = function(mDataManager,callback){
    var getCourseInfo = function (callback) {
        var prefix = 'origin@course@';

        mDataManager.getCache('basic@course',function(err,courseIdsArray){
            if(err){
                console.error(err);
                callback(err)
            }else{
                var taskGroups = [];
                _.each(courseIdsArray,function(courseId){
                    taskGroups.push(function(cb){
                        mDataManager.request({"url": mDataManager.config.mothership_url + '/api/v1/courses/'+courseId}, function (err, data) {
                            if(err){
                                console.error(err);
                                cb(err,"404");
                            }else{
                                mDataManager.cache.set(prefix + courseId, data, function () {
                                    cb(null,"200");
                                });
                            }
                        });
                    });
                });

                async.parallel(taskGroups,function(err,results){
                    if(err){
                        console.error(err);
                    }else{
                        console.log(results);
                    }
                    callback(err);
                });
            }
        });
    };

    getCourseInfo(function(err,data){
        var ret = 'OK';
        if(err){
            console.error(err);
            ret = 'Error';
        }
        callback(err,ret);
    });
};

exports.restore = function(){

};
