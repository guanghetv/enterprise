/**
 * Created by solomon on 14-8-13.
 */
exports.create = function (key, data, originData, callback) {
    console.log('-------计算个人学习情况-------');
    var courses = originData.courses.all;
    var users = originData.users.all;

    var allStats = [];
    var chapterSituation = {};

    var fulfillBasicInfo = function (track, chapterSituation) {
        var chapterId = track.course.ChapterId;
        if (chapterSituation[chapterId] == undefined) {
            chapterSituation[chapterId] = {};
        }
        var lessonId = track.course.LessonId;
        if (chapterSituation[chapterId][lessonId] == undefined) {
            chapterSituation[chapterId][lessonId] = {};
            chapterSituation[chapterId][lessonId].lesson = {};
            chapterSituation[chapterId][lessonId].stats = {};
        }
        chapterSituation[chapterId][lessonId].lesson['layerId'] = track.course.LayerId;
        chapterSituation[chapterId][lessonId].lesson['lessonId'] = track.course.LessonId;
        chapterSituation[chapterId][lessonId].lesson['lessonTitle'] = track.course.LessonTitle;
        chapterSituation[chapterId][lessonId].lesson['lessonType'] = track.course.LessonType;
        return {chapterId: chapterId, lessonId: lessonId};
    };

    _.each(data, function (trackSet, trackSetKey) {
        if (trackSetKey === 'tracks_finishLesson') {
            _.each(trackSet, function (track, index) {
                var basicInfo = fulfillBasicInfo(track, chapterSituation);
                var chapterId = basicInfo.chapterId;
                var lessonId = basicInfo.lessonId;
                if (chapterSituation[chapterId][lessonId].stats['LessonSituation'] == undefined) {
                    chapterSituation[chapterId][lessonId].stats['LessonSituation'] = {};
                }
                if (chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'] == undefined) {
                    chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'] = {};
                }

                var time = new Date(track.headers.time).getTime();
                if (chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'][time] == undefined) {
                    chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'][time] = {};
                }

                chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'][time] = {
                    "is_review": track.status.isReview,
                    "pass_or_not": track.status.PassOrNot
                };
            });
        }

        if (trackSetKey === 'tracks_finishVideo') {
            _.each(trackSet, function (track, index) {
                if (track.course.ActivityType === 'video') {
                    var basicInfo = fulfillBasicInfo(track, chapterSituation);
                    var chapterId = basicInfo.chapterId;
                    var lessonId = basicInfo.lessonId;
                    if (chapterId != undefined && lessonId != undefined) {
                        if (chapterSituation[chapterId][lessonId].stats['VideoSituation'] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['VideoSituation'] = {};
                        }
                        if (chapterSituation[chapterId][lessonId].stats['VideoSituation']['watchVideo'] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['VideoSituation']['watchVideo'] = {};
                        }

                        var time = new Date(track.headers.time).getTime();
                        if (chapterSituation[chapterId][lessonId].stats['VideoSituation']['watchVideo'][time] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['VideoSituation']['watchVideo'][time] = {};
                        }

                        chapterSituation[chapterId][lessonId].stats['VideoSituation']['watchVideo'][time] = {
                            "watching_ratio": (track.status.CurrentTime / track.status.VideoDuration * 100).toString() + '%',
                            "watched_time": track.status.CurrentTime,
                            "video_duration": track.status.VideoDuration,
                            "is_review": track.status.isReview
                        };
                    }
                }
            });
        }

        if(trackSetKey === 'tracks_startProblemSet'){
            _.each(trackSet, function (track) {
                if (track.course != undefined &&  _.contains(['gonggu', 'lianxi'], track.course.ActivityType)) {
                    var basicInfo = fulfillBasicInfo(track, chapterSituation);
                    var chapterId = basicInfo.chapterId;
                    var lessonId = basicInfo.lessonId;
                    if (chapterId != undefined && lessonId != undefined) {
                        if (chapterSituation[chapterId][lessonId].stats['QuizSituation'] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['QuizSituation'] = {};
                        }
                        if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['startProblemSet'] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['QuizSituation']['startProblemSet'] = {};
                        }
                        var time = new Date(track.headers.time).getTime();
                        if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['startProblemSet'][time] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['QuizSituation']['startProblemSet'][time] = {};
                        }

                        chapterSituation[chapterId][lessonId].stats['QuizSituation']['startProblemSet'][time] = {
                            "is_random": track.status.Random,
                            "blood": track.status.Blood,
                            "size": track.status.Size,
                            "is_review": track.status.isReview
                        };
                    }
                }
            });
        }

        if (trackSetKey === 'tracks_finishProblemSet') {
            _.each(trackSet, function (track) {
                if (track.course != undefined &&  _.contains(['gonggu', 'lianxi'], track.course.ActivityType)) {
                    var basicInfo = fulfillBasicInfo(track, chapterSituation);
                    var chapterId = basicInfo.chapterId;
                    var lessonId = basicInfo.lessonId;
                    if (chapterId != undefined && lessonId != undefined) {
                        if (chapterSituation[chapterId][lessonId].stats['QuizSituation'] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['QuizSituation'] = {};
                        }
                        if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'] = {};
                        }
                        var time = new Date(track.headers.time).getTime();
                        if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'][time] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'][time] = {};
                        }


                        var problemSize = track.status.CorrectCount / track.status.CorrectPercent;
                        chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'][time] = {
                            wrong_ratio: (problemSize - track.status.CorrectCount).toString() + "/" + problemSize.toString(),
                            correct_ratio: track.status.CorrectCount.toString() + "/" + problemSize.toString(),
                            "is_review": track.status.isReview
                        };

                    }

                }
            });
        }

        if (trackSetKey === 'tracks_answerProblem') {
            _.each(trackSet, function (track) {
                if (track.course != undefined && _.contains(['gonggu', 'lianxi'], track.course.ActivityType)) {
                    var basicInfo = fulfillBasicInfo(track, chapterSituation);
                    var chapterId = basicInfo.chapterId;
                    var lessonId = basicInfo.lessonId;
                    if (chapterId != undefined && lessonId != undefined) {

                        if (chapterSituation[chapterId][lessonId].stats['QuizSituation'] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['QuizSituation'] = {};
                        }
                        if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['answerProblem'] == undefined) {
                            chapterSituation[chapterId][lessonId].stats['QuizSituation']['answerProblem'] = {};
                        }
                        var problemId = track.course.ProblemId;
                        if (problemId != undefined) {
                            if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['answerProblem'][problemId] == undefined) {
                                chapterSituation[chapterId][lessonId].stats['QuizSituation']['answerProblem'][problemId] = {};
                            }
                            var time = new Date(track.headers.time).getTime();
                            if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['answerProblem'][problemId][time] == undefined) {
                                chapterSituation[chapterId][lessonId].stats['QuizSituation']['answerProblem'][problemId][time] = {};
                            }

                            chapterSituation[chapterId][lessonId].stats['QuizSituation']['answerProblem'][problemId][time] = {
                                "is_review": track.status.isReview,
                                "is_correct": track.status.Correct,
                                "think_time": track.status.ThinkTime,
                                "answer": track.status.Answer,
                                "check_explanation_or_not": track.status.CheckExplanationOrNot
                            };

                            if (_.contains(['singlechoice', 'multichoice'], track.course.ProblemType)) {
                                chapterSituation[chapterId][lessonId].stats['QuizSituation']['answerProblem'][problemId][time]['answers_ids'] =
                                    track.status.UserAnswer;
                            }
                        }

                    }
                }

            })
        }
    });

    _.each(chapterSituation, function (chapter, chapterId) {
        var singleChapterData = {};
        singleChapterData['user'] = _.find(users, function (user) {
            return user.username == key;
        });
        singleChapterData['stats'] = {};
        singleChapterData['stats']['chapter'] = {};
        singleChapterData['stats']['lessons'] = [];
        singleChapterData['stats']['chapter']['chapterId'] = chapterId;
        singleChapterData['stats']['chapter']['chapterTitle'] = _.find(courses, function (chapter) {
            return chapter._id == chapterId;
        }).name;

        _.each(chapter, function (lesson) {
            singleChapterData['stats']['lessons'].push(lesson);
        });
        allStats.push(singleChapterData);
    });
    //console.log(JSON.stringify(allStats));
    callback(null, allStats);
};
exports.restore = function () {

};


