exports.create = function (key, data, originData, callback) {
    console.log('-------计算个人做题状况-------');
    var courses = originData.courses;
    var allStats = [];
    var chapterSituation = {};
    _.each(data, function (track) {
        if (track.course != undefined) {
            if (chapterSituation[track.course.ChapterId] == null) {
                chapterSituation[track.course.ChapterId] = {};
            }

            if (chapterSituation[track.course.ChapterId][track.course.LessonId] == null) {
                chapterSituation[track.course.ChapterId][track.course.LessonId] = {};
                chapterSituation[track.course.ChapterId][track.course.LessonId].lesson = {};
                chapterSituation[track.course.ChapterId][track.course.LessonId].stats = {};
            }
            chapterSituation[track.course.ChapterId][track.course.LessonId].lesson['lessonId'] = track.course.LessonId;
            chapterSituation[track.course.ChapterId][track.course.LessonId].lesson['lessonTitle'] = track.course.LessonTitle;
            chapterSituation[track.course.ChapterId][track.course.LessonId].lesson['layerId'] = track.course.LayerId;

            if (chapterSituation[track.course.ChapterId][track.course.LessonId].stats['QuizSituation'] == null) {
                chapterSituation[track.course.ChapterId][track.course.LessonId].stats['QuizSituation'] = {};
            }

            if (chapterSituation[track.course.ChapterId][track.course.LessonId].stats['VideoSituation'] == null) {
                chapterSituation[track.course.ChapterId][track.course.LessonId].stats['VideoSituation'] = {};
            }

            if (chapterSituation[track.course.ChapterId][track.course.LessonId].stats['QuizSituation'][track.course.ProblemId] == null) {
                chapterSituation[track.course.ChapterId][track.course.LessonId].stats['QuizSituation'][track.course.ProblemId] = {};
                if (chapterSituation[track.course.ChapterId][track.course.LessonId].stats['QuizSituation'][track.course.ProblemId][track.headers.time] == null) {
                    chapterSituation[track.course.ChapterId][track.course.LessonId].stats['QuizSituation'][track.course.ProblemId][track.headers.time] = {};
                }
                chapterSituation[track.course.ChapterId][track.course.LessonId].stats['QuizSituation'][track.course.ProblemId][track.headers.time]['is_correct'] = track.data.properties.Correct ;
            }
        }
    });

    _.each(chapterSituation, function (chapter, chapterId) {
        var singleChapterData = {};
        singleChapterData['user'] = data[0].user;
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

exports.restore = function () {

};
