/**
 * Created by solomon on 14-8-21.
 */

exports.create = function(mDataManager,callback){
	//console.log('hello world');

/*    getBasicInfoFromEnterprise(function (enterpriseInfo) {
        var courseInfo = enterpriseInfo.course;
        var taskGroups = [];
        _.each(courseInfo, function (chapterId) {
            taskGroups.push(function (cb) {
                mDataManager.getChapterById(chapterId, function (err, chapter) {
                    cb(err, JSON.parse(chapter).name);
                });
            })
        });
        async.parallel(taskGroups, function (err, results) {
            console.log(results);
            callback(err);
        })
    });*/
    callback(null,"world");

};

exports.restore = function(){

};
