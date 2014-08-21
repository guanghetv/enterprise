/**
 * Created by solomon on 14-8-21.
 */

exports.create = function (mDataManager) {
    console.log(important, 'hello world');
    var getBasicInfoFromEnterprise = function (callback) {
        mDataManager.request({"url": mDataManager.config.mothership_url + '/enterprise'}, function (err, response) {
            if (err) {
                console.error(err);
            } else {
                console.log(response);
                callback(JSON.parse(response));
            }
        });
    };

    getBasicInfoFromEnterprise(function (enterpriseInfo) {
        var courseInfo = enterpriseInfo.course;
        console.log(courseInfo);
        _.each(courseInfo, function (chapterId) {
            mDataManager.getChapterById(chapterId, function (err, chapter) {
                console.log('++++', JSON.parse(chapter).name);
            });
        });
    });
};

exports.restore = function () {

};