exports.create = function (key, data, originData, callback) {
    console.log('-------添加 course 信息-------');
    var courses = originData.courses.all;

    var statusInfo = [
        "isReview", //
        "Rate",
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

    _.each(data, function (trackSet, trackSetKey) {

        var shouldBeRemovedIndexArray = [];
        var addToNoUseTrack = function (index, track, errormsg) {
            shouldBeRemovedIndexArray.push(index);
            console.error(errormsg, track);
        };

        _.each(trackSet, function (track, index) {
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

                var courseObject = _.find(courses, function (course) {
                    return course._id == track.data.properties.ChapterId;
                });
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


                            if (trackSetKey === 'tracks_finishLesson') {
                                var StatusesForFinishLesson = [track.data.properties.isReview, track.data.properties.PassOrNot];
                                if (Utils.haveEssentialVariables(StatusesForFinishLesson)) {
                                    fulfillStatusInfo();
                                } else {
                                    addToNoUseTrack(index, track, "Lack of information for FinishLesson event, delete it:");
                                }
                            }

                            if (_.contains(['tracks_finishVideo', 'tracks_finishProblemSet', 'answerProblem'], trackSetKey)) {

                                if (Utils.haveEssentialVariables([track.data.properties.ActivityId, track.data.properties.isReview])) {
                                    var activityObject = _.find(lessonObject.activities, function (activity) {
                                        return activity._id == track.data.properties.ActivityId;
                                    });
                                    if (activityObject != undefined) {
                                        track['course']['ActivityId'] = activityObject._id;
                                        track['course']['ActivityTitle'] = activityObject.title;
                                        track['course']['ActivityType'] = activityObject.type;

                                        if (trackSetKey === 'tracks_finishVideo') {
                                            var StatusesForFinishVideo = [
                                               // track.data.properties.VideoId,
                                               // track.data.properties.VideoTitle,
                                                track.data.properties.CurrentTime,
                                                track.data.properties.VideoDuration,
                                                track.data.properties.SkipOrNot
                                            ];

                                            if (Utils.haveEssentialVariables(StatusesForFinishVideo)) {
                                               // var videoObject = (activityObject.video._id == track.data.properties.VideoId) ? activityObject.video : undefined;
                                                var videoObject = activityObject.video;
                                                if (videoObject != undefined) {
                                                    track['course']['VideoId'] = videoObject._id;
                                                    track['course']['VideoTitle'] = videoObject.title;
                                                    track['course']['VideoUrl'] = videoObject.url;
                                                    fulfillStatusInfo();
                                                } else {
                                                    addToNoUseTrack(index, track, "Cannot find video from database for this track, delete it:");
                                                }
                                            } else {
                                                addToNoUseTrack(index, track, "Lack of information for FinishVideo event, delete it:");
                                            }
                                        }

                                        if (trackSetKey === 'tracks_finishProblemSet') {
                                            var StatusesForFinishProblemSet = [
                                                track.data.properties.CorrectCount,
                                                track.data.properties.CorrectPercent,
                                                track.data.properties.AnswerTime,
                                                track.data.properties.Pass
                                            ];
                                            if (Utils.haveEssentialVariables(StatusesForFinishProblemSet)) {
                                                fulfillStatusInfo();
                                            } else {
                                                addToNoUseTrack(index, track, "Lack of information for FinishProblemSet event, delete it:");
                                            }
                                        }

                                        if (trackSetKey === 'answerProblem') {
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
                                                            } else {
                                                                addToNoUseTrack(index, track, "Cannot find choice from database for this track, delete it:");
                                                            }
                                                            break;
                                                        case 'multichoice':
                                                            _.each(userAnswer, function (answer) {
                                                                var choiceObject = _.find(problemObject.choices, function (choice) {
                                                                    return choice.body === answer;
                                                                });
                                                                if (choiceObject != undefined) {
                                                                    fulfillStatusInfo();
                                                                    track['status']['UserAnswer'].push(choiceObject._id);
                                                                } else {
                                                                    addToNoUseTrack(index, track, "Cannot find choice from database for this track, delete it:");
                                                                }
                                                            });
                                                            break;
                                                        case 'singlefilling':
                                                            fulfillStatusInfo();
                                                            track['status']['UserAnswer'].push(userAnswer);
                                                            break;
                                                        default :
                                                    }
                                                } else {
                                                    addToNoUseTrack(index, track, "Cannot find problem from database for this track, delete it:");
                                                }

                                            } else {
                                                addToNoUseTrack(index, track, "Lack of information for AnswerProblem event, delete it:");
                                            }
                                        }
                                    } else {
                                        addToNoUseTrack(index, track, "Cannot find activity from database for this track, delete it:");
                                    }
                                } else {
                                    addToNoUseTrack(index, track, "Lack of basic course info, delete it:");
                                }
                            }
                        } else {
                            addToNoUseTrack(index, track, "Cannot find chapter from database for this track, delete it:");
                        }
                    } else {
                        addToNoUseTrack(index, track, "Cannot find chapter from database for this track, delete it:");
                    }
                } else {
                    addToNoUseTrack(index, track, "Cannot find chapter from database for this track, delete it:");
                }
            } else {
                addToNoUseTrack(index, track, "Lack of basic course info, delete it:");
            }
        });
        Utils.deleteMultiElementsFromArrayAtOnce(trackSet, shouldBeRemovedIndexArray);
    });

    callback(null, data);
};

exports.restore = function () {

};