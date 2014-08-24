var statusInfo = [
    "isReview", //
    "Rate",
    "Random",
    "Blood",
    "Size",
    "CurrentTime",//
    "VideoDuration",//
    "SkipOrNot",//
    "Correct",//
    "Thinktime",
    "Answer",//
    "WrongCount",
    "AnswerOrNot",
    "CheckExplanationOrNot",//
    "CorrectCount",//
    "CorrectPercent",//
    "AnswerTime",//
    "Pass",//
    "PassOrNot"//
];


module.exports = function (track, trackId, trackSetKey, dataManager, throwError) {
    var essentialVariables = [
        track.data.properties.ChapterId,
        track.data.properties.LayerId,
        track.data.properties.LessonId,
        track.headers.time
    ];

    var fulfillStatusInfo = function () {
        _.each(statusInfo, function (status) {
            if (_.contains(_.keys(track.data.properties), status)) {
                track['status'][status] = track.data.properties[status];
            }
        })
    };

    if (Utils.haveEssentialVariables(essentialVariables)) {

        /**
         *
         * This is for track.course 方便后续取出某些课程属性
         *
         * */
        track['course'] = {};

        /**
         *
         * This is for track.status 方便后续取出用户生成此记录时的状态
         *
         * */
        track['status'] = {};
        dataManager.cache.getHash("origin@course", track.data.properties.ChapterId, function (err, data) {
            var courseObject = JSON.parse(data);
            if (courseObject != undefined) {
                track['course']['ChapterId'] = courseObject._id;
                track['course']['ChapterTitle'] = courseObject.name;
                var layerObject = _.find(courseObject.layers, function (layer) {
                    return layer._id == track.data.properties.LayerId;
                });

                if (layerObject != undefined) {
                    track['course']['LayerId'] = layerObject._id;
                    track['course']['LayerTitle'] = layerObject.title;

                    var lessonObject = _.find(layerObject.lessons, function (lesson) {
                        return lesson._id == track.data.properties.LessonId;
                    });
                    if (lessonObject != undefined) {
                        track['course']['LessonId'] = lessonObject._id;
                        track['course']['LessonTitle'] = lessonObject.title;
                        track['course']['LessonType'] = lessonObject.type;

                        if (trackSetKey === 'FinishLesson') {
                            var StatusesForFinishLesson = [track.data.properties.isReview, track.data.properties.PassOrNot];
                            if (Utils.haveEssentialVariables(StatusesForFinishLesson)) {
                                fulfillStatusInfo();
                                throwError(null);
                            } else {
                                throwError("Lack of information for FinishLesson event, delete it:");
                            }
                        } else if (_.contains(['FinishVideo', 'StartProblemSet', 'AnswerProblem', 'FinishProblemSet'], trackSetKey)) {

                            if (Utils.haveEssentialVariables([track.data.properties.ActivityId, track.data.properties.isReview])) {
                                var activityObject = _.find(lessonObject.activities, function (activity) {
                                    return activity._id == track.data.properties.ActivityId;
                                });
                                if (activityObject != undefined) {
                                    track['course']['ActivityId'] = activityObject._id;
                                    track['course']['ActivityTitle'] = activityObject.title;
                                    track['course']['ActivityType'] = activityObject.type;

                                    if (trackSetKey === 'FinishVideo') {
                                        var StatusesForFinishVideo = [
                                            // track.data.properties.VideoId,
                                            // track.data.properties.VideoTitle,
                                            track.data.properties.CurrentTime,
                                            track.data.properties.VideoDuration,
                                            track.data.properties.SkipOrNot
                                        ];

                                        if (Utils.haveEssentialVariables(StatusesForFinishVideo)) {
                                            var videoObject = activityObject.video;
                                            if (videoObject != undefined) {
                                                track['course']['VideoId'] = videoObject._id;
                                                track['course']['VideoTitle'] = videoObject.title;
                                                track['course']['VideoUrl'] = videoObject.url;
                                                fulfillStatusInfo();
                                                throwError(null);
                                            } else {
                                                throwError("Cannot find video from database for this track, delete it:");
                                            }
                                        } else {
                                            throwError("Lack of information for FinishVideo event, delete it:");
                                        }
                                    }

                                    if (trackSetKey === 'StartProblemSet') {
                                        var StatusesForStartProblemSet = [
                                            track.data.properties.Random,
                                            track.data.properties.Blood,
                                            track.data.properties.Size
                                        ];
                                        if (Utils.haveEssentialVariables(StatusesForStartProblemSet)) {
                                            fulfillStatusInfo();
                                            throwError(null);
                                        } else {
                                            throwError("Lack of information for StartProblemSet event, delete it:");
                                        }
                                    }

                                    if (trackSetKey === 'FinishProblemSet') {
                                        var StatusesForFinishProblemSet = [
                                            track.data.properties.CorrectCount,
                                            track.data.properties.CorrectPercent,
                                            track.data.properties.AnswerTime,
                                            track.data.properties.Pass
                                        ];
                                        if (Utils.haveEssentialVariables(StatusesForFinishProblemSet)) {
                                            fulfillStatusInfo();
                                            throwError(null);
                                        } else {
                                            throwError("Lack of information for FinishProblemSet event, delete it:");
                                        }
                                    }

                                    if (trackSetKey === 'AnswerProblem') {
                                        var StatusesForAnswerProblem = [
                                            track.data.properties.ProblemId,
                                            track.data.properties.Correct,
                                            track.data.properties.ThinkTime,
                                            track.data.properties.Answer,
                                            track.data.properties.CheckExplanationOrNot
                                        ];

                                        if (Utils.haveEssentialVariables(StatusesForAnswerProblem)) {
                                            var problemObject = _.find(activityObject.problems, function (problem) {
                                                return problem._id == track.data.properties.ProblemId;
                                            });
                                            if (problemObject != undefined) {
                                                track['course']['ProblemId'] = problemObject._id;
                                                track['course']['ProblemBody'] = problemObject.body;
                                                track['course']['ProblemType'] = problemObject.type;
                                                track['status']['UserAnswer'] = [];

                                                var userAnswer = track.data.properties.Answer;

                                                switch (problemObject.type) {
                                                    case 'singlechoice':
                                                        var choiceObject = _.find(problemObject.choices, function (choice) {
                                                            return choice.body === userAnswer;
                                                        });
                                                        if (choiceObject != undefined) {
                                                            fulfillStatusInfo();
                                                            track['status']['UserAnswer'] = [choiceObject._id];
                                                            throwError(null);
                                                        } else {
                                                            throwError("Cannot find choice from database for this track, delete it:");
                                                        }
                                                        break;
                                                    case 'multichoice':
                                                        var ret = true;
                                                        _.each(userAnswer, function (answer) {
                                                            var choiceObject = _.find(problemObject.choices, function (choice) {
                                                                return choice.body === answer;
                                                            });
                                                            if (choiceObject != undefined) {
                                                                fulfillStatusInfo();
                                                                track['status']['UserAnswer'].push(choiceObject._id);
                                                            } else {
                                                                ret = false;
                                                            }
                                                        });
                                                        if (ret) {
                                                            throwError(null);
                                                        } else {
                                                            throwError("Cannot find choice from database for this track, delete it:");
                                                        }
                                                        break;
                                                    case 'singlefilling':
                                                        fulfillStatusInfo();
                                                        track['status']['UserAnswer'].push(userAnswer);
                                                        throwError(null);
                                                        break;
                                                    default :
                                                        throwError("Cannot read this problem's type, delete it");
                                                }
                                            } else {
                                                throwError("Cannot find problem from database for this track, delete it:");
                                            }

                                        } else {
                                            throwError("Lack of information for AnswerProblem event, delete it:");
                                        }
                                    }
                                } else {
                                    throwError("Cannot find activity from database for this track, delete it:");
                                }
                            } else {
                                throwError("Lack of basic course info, delete it:");
                            }
                        } else {
                            throwError("Cannot find this event key, delete it:");
                        }
                    } else {
                        throwError("Cannot find lesson from database for this track, delete it:");
                    }
                } else {
                    throwError("Cannot find layer from database for this track, delete it:");
                }
            } else {
                throwError("Cannot find chapter from database for this track, delete it:");
            }
        });
    } else {
        throwError("Lack of basic course info, delete it:");
    }
};


