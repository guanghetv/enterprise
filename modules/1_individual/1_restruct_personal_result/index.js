/**
 * Created by solomon on 14-8-23.
 */

var restructAllSituation = function (user,dataManager,callback) {
    var pattern = "middle@individual@$userId";
    dataManager.cache.getHash(pattern.replace('$userId', user._id), function (err, chapterSituation) {
        var allStats = [];
        _.each(chapterSituation, function (chapter, chapterId) {
            chapter = JSON.parse(chapter);
            var singleChapterData = {};
            singleChapterData['user'] = user;
            singleChapterData['stats'] = {};
            singleChapterData['stats']['chapter'] = {};
            singleChapterData['stats']['lessons'] = [];
            singleChapterData['stats']['chapter']['chapterId'] = chapterId;

            _.each(chapter, function (lesson) {
                singleChapterData['stats']['lessons'].push(lesson);
            });
            allStats.push(singleChapterData);
        });
        callback(null, allStats);
    });
};

exports.create = function (userId, dataManager, callback) {
    dataManager.cache.getHash('origin@user', userId, function (err, user) {
        restructAllSituation(JSON.parse(user),dataManager,function(err,allStats){
            //console.log(JSON.stringify(allStats));
            dataManager.cache.setHash('result@individual@'+userId, _.indexBy(allStats,function(item){
                return item.stats.chapter.chapterId;
            }),function(err,result){
                callback(err,'OK');
            });
        });
    });
};

exports.restore = function(){

};