exports.create = function (key, data, originData, callback) {
    console.log('-------添加 course 信息-------');
    var courses = originData.courses.all;
    var statusInfo = [
        "isReview",
        "Rate",
        "CurrentTime",
        "VideoDuration",
        "SkipOrNot",
        "Correct",
        "Thinktime",
        "Answer",
        "WrongCount",
        "AnswerOrNot",
        "CheckExplanationOrNot",
        "CorrectCount",
        "CorrectPercent",
        "AnswerTime",
        "Pass",
        "PassOrNot"
    ];

    _.each(data, function (trackSet) {
        _.each(trackSet, function (track) {
            if (track.data.properties.ChapterId != undefined) {
                track['course'] = {};
                var courseObject = _.find(courses, function (course) {
                    return course._id == track.data.properties.ChapterId;
                });
                if (courseObject != undefined) {
                    track['course']['ChapterId'] = courseObject._id;
                    track['course']['ChapterTitle'] = courseObject.name;

                    if (track.data.properties.LayerId != undefined) {
                        var layerObject = _.find(courseObject.layers, function (layer) {
                            return layer._id == track.data.properties.LayerId;
                        });
                        if (layerObject != undefined) {
                            track['course']['LayerId'] = layerObject._id;
                            track['course']['LayerTitle'] = layerObject.title;

                            if (track.data.properties.LessonId != undefined) {
                                var lessonObject = _.find(layerObject.lessons, function (lesson) {
                                    return lesson._id == track.data.properties.LessonId;
                                });
                                if (lessonObject != undefined) {
                                    track['course']['LessonId'] = lessonObject._id;
                                    track['course']['LessonTitle'] = lessonObject.title;

                                    if (track.data.properties.VideoId != undefined) {
                                        track['course']['VideoId'] = track.data.properties.VideoId;
                                        track['course']['VideoTitle'] = track.data.properties.VideoTitle;
                                    }

                                    if (track.data.properties.ActivityId != undefined) {
                                        var activityObject = _.find(lessonObject.activities, function (activity) {
                                            return activity._id == track.data.properties.ActivityId;
                                        });
                                        if (activityObject != undefined) {
                                            track['course']['ActivityId'] = activityObject._id;
                                            track['course']['ActivityTitle'] = activityObject.title;
                                            track['course']['ActivityType'] = activityObject.type;

                                            if (track.data.properties.ProblemId != undefined) {
                                                var problemObject = _.find(activityObject.problems, function (problem) {
                                                    return problem._id == track.data.properties.ProblemId;
                                                });
                                                if (problemObject != undefined) {
                                                    track['course']['ProblemId'] = problemObject._id;
                                                    track['course']['ProblemBody'] = problemObject.body;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            track['status'] = {};
            _.each(statusInfo,function(status){
                if(_.contains(_.keys(track.data.properties),status)){
                    track['status'][status] = track.data.properties[status];
                }
            })
        })
    });
    callback(null, data);
};

exports.restore = function () {

};
