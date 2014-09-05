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

module.exports = function (track, trackSetKey, chapterSituation) {
    //console.log('-------计算个人学习情况-------');

    var basicInfo = fulfillBasicInfo(track, chapterSituation);
    var chapterId = basicInfo.chapterId;
    var lessonId = basicInfo.lessonId;
    var time = new Date(track.headers.time).getTime();

    switch (trackSetKey) {
        case 'FinishLesson':
            if (chapterSituation[chapterId][lessonId].stats['LessonSituation'] == undefined) {
                chapterSituation[chapterId][lessonId].stats['LessonSituation'] = {};
            }
            if (chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'] == undefined) {
                chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'] = {};
            }

            if (chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'][time] == undefined) {
                chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'][time] = {};
            }

            chapterSituation[chapterId][lessonId].stats['LessonSituation']['finishLesson'][time] = {
                "is_review": track.status.isReview,
                "pass_or_not": track.status.PassOrNot
            };
            break;

        case 'StartLesson':
            if (chapterSituation[chapterId][lessonId].stats['LessonSituation'] == undefined) {
                chapterSituation[chapterId][lessonId].stats['LessonSituation'] = {};
            }
            if (chapterSituation[chapterId][lessonId].stats['LessonSituation']['startLesson'] == undefined) {
                chapterSituation[chapterId][lessonId].stats['LessonSituation']['startLesson'] = {};
            }

            if (chapterSituation[chapterId][lessonId].stats['LessonSituation']['startLesson'][time] == undefined) {
                chapterSituation[chapterId][lessonId].stats['LessonSituation']['startLesson'][time] = {};
            }

            chapterSituation[chapterId][lessonId].stats['LessonSituation']['startLesson'][time] = {
                "is_review": track.status.isReview
            };
            break;


        case 'FinishVideo':
            if (track.course.ActivityType === 'video') {
                if (chapterId != undefined && lessonId != undefined) {
                    if (chapterSituation[chapterId][lessonId].stats['VideoSituation'] == undefined) {
                        chapterSituation[chapterId][lessonId].stats['VideoSituation'] = {};
                    }
                    if (chapterSituation[chapterId][lessonId].stats['VideoSituation']['watchVideo'] == undefined) {
                        chapterSituation[chapterId][lessonId].stats['VideoSituation']['watchVideo'] = {};
                    }

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

            break;

        case "StartProblemSet":
            if (track.course != undefined && _.contains(['gonggu', 'lianxi'], track.course.ActivityType)) {

                if (chapterId != undefined && lessonId != undefined) {
                    if (chapterSituation[chapterId][lessonId].stats['QuizSituation'] == undefined) {
                        chapterSituation[chapterId][lessonId].stats['QuizSituation'] = {};
                    }
                    if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['startProblemSet'] == undefined) {
                        chapterSituation[chapterId][lessonId].stats['QuizSituation']['startProblemSet'] = {};
                    }
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
            break;
        case "FinishProblemSet":
            if (track.course != undefined && _.contains(['gonggu', 'lianxi'], track.course.ActivityType)) {
                if (chapterId != undefined && lessonId != undefined) {
                    if (chapterSituation[chapterId][lessonId].stats['QuizSituation'] == undefined) {
                        chapterSituation[chapterId][lessonId].stats['QuizSituation'] = {};
                    }
                    if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'] == undefined) {
                        chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'] = {};
                    }
                    if (chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'][time] == undefined) {
                        chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'][time] = {};
                    }

                    //var problemSize = track.status.CorrectCount / track.status.CorrectPercent;
                    var problemSize;

                    if(track.course.ActivityPoolCount == undefined){
                        problemSize = track.course.ActivityProblemsLength;
                    }else{
                        problemSize = track.course.ActivityPoolCount;
                    }

                    if(problemSize!=0 && problemSize!=undefined){
                        chapterSituation[chapterId][lessonId].stats['QuizSituation']['finishProblemSet'][time] = {
                            wrong_ratio: (problemSize - track.status.CorrectCount).toString() + "/" + problemSize.toString(),
                            correct_ratio: track.status.CorrectCount.toString() + "/" + problemSize.toString(),
                            "is_review": track.status.isReview
                        };
                    }
                }
            }
            break;

        case "AnswerProblem":
            if (track.course != undefined && _.contains(['gonggu', 'lianxi'], track.course.ActivityType)) {

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
            break;
        default :
            console.error("请告诉 mothership 管理员，tracks api 写错了！", trackSetKey);
            break;
    }
};




