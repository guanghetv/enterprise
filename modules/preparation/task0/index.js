/**
 * Created by solomon on 14-8-21.
 */

exports.create = function (mDataManager, callback) {
    console.log('hello mothership');
    var getBasicInfoFromEnterprise = function (callback) {
        mDataManager.request({"url": mDataManager.config.mothership_url + '/enterprise'}, function (err, response) {
            if (err) {
                console.error(err);
            } else {
                callback(JSON.parse(response));
            }
        });
    };

    getBasicInfoFromEnterprise(function (enterpriseInfo) {
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
    });

};

exports.restore = function () {

};