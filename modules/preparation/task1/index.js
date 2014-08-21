/**
 * Created by solomon on 14-8-21.
 */

exports.create = function(mDataManager,callback){
    var getCourseInfo = function (callback) {
        var prefix = 'origin_course_';

        mDataManager.getCache('basic_course',function(err,courseIdsArray){
            if(err){
                console.error(err);
                callback(err)
            }else{
                var taskGroups = [];
                _.each(courseIdsArray,function(courseId){
                    taskGroups.push(function(cb){
                        mDataManager.request({"url": mDataManager.config.mothership_url + '/api/v1/courses/'+courseId}, function (err, response,body) {
                            if(err){
                                console.error(err);
                                cb(err,response.statusCode);
                            }else{
                                console.log(courseId);
                                mDataManager.cache.set(prefix + courseId, body, function () {
                                    cb(null,response.statusCode);
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
