exports.create = function (key, data, originData, callback) {
    console.log('-------计算个人做题状况-------');
    var courses = originData.courses.all;
    var users = originData.users.all;
    var allStats = [];
    var chapterSituation = {};
    _.each(data, function(trackSet,trackSetKey){
        if(trackSetKey === 'tracks_answerProblem'){
            _.each(trackSet,function(track) {
                if (track.course != undefined) {

                    var chapterId = track.course.ChapterId;
                    if (chapterSituation[chapterId] == null) {
                        chapterSituation[chapterId] = {};
                    }
                    var lessonId = track.course.LessonId;
                    if (chapterSituation[chapterId][lessonId] == null) {
                        chapterSituation[chapterId][lessonId] = {};
                        chapterSituation[chapterId][lessonId].lesson = {};
                        chapterSituation[chapterId][lessonId].stats = {};
                    }
                    chapterSituation[chapterId][lessonId].lesson['lessonId'] = lessonId;
                    chapterSituation[chapterId][lessonId].lesson['lessonTitle'] = track.course.LessonTitle;
                    chapterSituation[chapterId][lessonId].lesson['layerId'] = track.course.LayerId;

                    if (chapterSituation[chapterId][lessonId].stats['QuizSituation'] == null) {
                        chapterSituation[chapterId][lessonId].stats['QuizSituation'] = {};
                    }

                    if (chapterSituation[chapterId][lessonId].stats['VideoSituation'] == null) {
                        chapterSituation[chapterId][lessonId].stats['VideoSituation'] = {};
                    }
                    var problemId = track.course.ProblemId;
                    if (chapterSituation[chapterId][lessonId].stats['QuizSituation'][problemId] == null) {
                        chapterSituation[chapterId][lessonId].stats['QuizSituation'][problemId] = {};
                        var time = new Date(track.headers.time).getTime();
                        if (chapterSituation[chapterId][lessonId].stats['QuizSituation'][problemId][time] == null) {
                            chapterSituation[chapterId][lessonId].stats['QuizSituation'][problemId][time] = {};
                        }
                        chapterSituation[chapterId][lessonId].stats['QuizSituation'][problemId][time]['is_correct'] = track.data.properties.Correct;
                    }
                }
            })
        }

    });

    _.each(chapterSituation, function (chapter, chapterId) {
        var singleChapterData = {};
        singleChapterData['user'] = _.find(users,function(user){
            return user.username == key;
        });
        singleChapterData['stats'] = {};
        singleChapterData['stats']['chapter'] = {};
        singleChapterData['stats']['lessons'] = [];
        singleChapterData['stats']['chapter']['chapterId'] = chapterId;
        singleChapterData['stats']['chapter']['chapterTitle'] = _.find(courses,function(chapter){
            return chapter._id == chapterId;
        }).name;

        _.each(chapter, function (lesson, lessonId) {
            singleChapterData['stats']['lessons'].push(lesson);
        });
        allStats.push(singleChapterData);
    });
    console.log(JSON.stringify(allStats));
    callback(null, allStats);
};
/*
exports.restore = function () {

};
*/
