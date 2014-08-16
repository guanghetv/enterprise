/**
 * Created by solomon on 14-8-14.
 */
exports.create = function (key, data, callback) {
    console.log("--------按章节计算平均率--------");
    var taskGroups = [];
    var chapterAlgorithm = function (stats, chapterId, cb) {
        //[{ user:{},stats:{}},{user:{},stats:{}}] 不同 user， 同一章节
        var ret = {};
        ret.room = {};
        ret.stats = {};

        ret.stats.chapter = stats[0].stats.chapter;
        ret.stats.lessons = [];

        var roomObject = _.find(stats[0].user.rooms, function (room) {
            return room._id == key;
        });
        ret.room = roomObject;

        var organizeStatsByLesson = function (stats) {
            var arrayJustForOperation = [];
            _.each(stats, function (userifyStat) {
                var userifyLessonArray = [];
                _.each(userifyStat.stats.lessons, function (lesson) {
                    userifyLessonArray.push({user: userifyStat.user, lesson: lesson});
                });
                arrayJustForOperation.push(userifyLessonArray);
            });

            return _.groupBy(_.flatten(arrayJustForOperation), function (item) {
                return item.lesson.lesson.lessonId;
            });
        };

        /**
         *  lessonifyStats => key:每个 lesson 的 lessonId; value: 关于此 lesson 的每个 user 各自的统计数据的详情
         *
         * {
        *     "lid1":[
        *         {user:{},lesson:{}},
        *         {user:{},lesson:{}}
        *     ],
        *
        *     "lid2":[
        *         {user:{},lesson:{}}
        *     ]
        *  }
         *
         * */

        var lessonifyStats = organizeStatsByLesson(stats);

        var lessonsStats = {};
        _.each(lessonifyStats, function (eachLessonStats, lessonId) {
            lessonsStats[lessonId] = {};
            lessonsStats[lessonId]['lesson'] = {};
            lessonsStats[lessonId]['stats'] = {};
            lessonsStats[lessonId]['compute_helper'] = {};

            if (eachLessonStats[0].lesson.lesson.lessonType === 'learn') {
                lessonsStats[lessonId]['compute_helper']['video_compute_helper'] = []; // 用来协助内部进行视频观看平均率的计算
            }

            lessonsStats[lessonId]['compute_helper']['quiz_compute_helper'] = [];

            _.each(eachLessonStats, function (eachUserLessonStat, userIndexOfLessonStats) {

                /**
                 * eachUserLessonStat => 每个 user 关于这个 lesson 的统计详情
                 *
                 * {
                *   user:{},
                *   lesson:{
                *       lesson:{},
                *       stats:{
                *           LessonSituation:{
                *               finishLesson:{
                *                   "time1":{"is_review": "false", "pass_or_not": true},
                *                   "time2":{"is_review": "false", "pass_or_not": true}
                *               }
                *           },
                *
                *           VideoSituation:{
                *               "watchVideo": {
                *                    "time1": {"watching_ratio": "72.57314724607865%", "watched_time": 121.027125,"video_duration": 166.765711,"is_review":false},
                *                    "time2": {"watching_ratio": "72.57314724607865%", "watched_time": 121.027125,"video_duration": 166.765711,"is_review":false}
                *                }
                *           },
                *
                *           QuizSituation:{
                *           }
                *       }
                *   }
                * }
                 *
                 * */

                var userStatsAboutThisLesson = eachUserLessonStat.lesson.stats;
                var lessonObject = eachUserLessonStat.lesson.lesson;
                var user = eachUserLessonStat.user;

                lessonsStats[lessonId]['lesson'] = lessonObject;

                //------------------计算LessonSituation 中的 finishLesson-----------------------
                if (lessonsStats[lessonId]['stats']['LessonSituation'] == undefined) {
                    lessonsStats[lessonId]['stats']['LessonSituation'] = {};
                }

                if (lessonsStats[lessonId]['stats']['LessonSituation']['finishLesson'] == undefined) {
                    lessonsStats[lessonId]['stats']['LessonSituation']['finishLesson'] = {};
                    lessonsStats[lessonId]['stats']['LessonSituation']['finishLesson']['finish_count'] = 0;
                    lessonsStats[lessonId]['stats']['LessonSituation']['finishLesson']['details'] = {};
                }

                if (userStatsAboutThisLesson.LessonSituation!=undefined &&
                    _.keys(userStatsAboutThisLesson.LessonSituation.finishLesson).length > 0) {
                    lessonsStats[lessonId]['stats']['LessonSituation']['finishLesson']['finish_count']++
                    lessonsStats[lessonId]['stats']['LessonSituation']['finishLesson']['details'][user._id] =
                        userStatsAboutThisLesson.LessonSituation.finishLesson;
                }

                //------------------计算VideoSituation 中的 watchVideo--------------------------
                if (lessonObject.lessonType === 'learn' && _.keys(userStatsAboutThisLesson.VideoSituation).length > 0) {
                    if (lessonsStats[lessonId]['stats']['VideoSituation'] == undefined) {
                        lessonsStats[lessonId]['stats']['VideoSituation'] = {};
                    }

                    if (_.keys(userStatsAboutThisLesson.VideoSituation.watchVideo).length > 0) {
                        if (userStatsAboutThisLesson.LessonSituation!=undefined && _.keys(userStatsAboutThisLesson.LessonSituation.finishLesson).length > 0) { // 只统计完成过本课的学生的视频观看率 -- From PRD

                            if (lessonsStats[lessonId]['stats']['VideoSituation']['watchVideo'] == undefined) {
                                lessonsStats[lessonId]['stats']['VideoSituation']['watchVideo'] = {};
                                lessonsStats[lessonId]['stats']['VideoSituation']['watchVideo']['average_watching_ratio'] = "";
                                lessonsStats[lessonId]['stats']['VideoSituation']['watchVideo']['details'] = {};
                            }

                            var firstWatchingTime = Utils.findFirstTime(userStatsAboutThisLesson.VideoSituation.watchVideo);// 统计每个人首次观看该视频的观看率

                            lessonsStats[lessonId]['compute_helper']['video_compute_helper'].push(_.find(userStatsAboutThisLesson.VideoSituation.watchVideo, function (value, timeKey) {
                                return timeKey == firstWatchingTime.toString();
                            }).watching_ratio);

                            lessonsStats[lessonId]['stats']['VideoSituation']['watchVideo']['details'][user._id] =
                                userStatsAboutThisLesson.VideoSituation.watchVideo;

                            if (userIndexOfLessonStats == (eachLessonStats.length - 1)) { //循环的最后一个,开始计算平均率
                                var watchingRatiosArray = _.map(lessonsStats[lessonId]['compute_helper']['video_compute_helper'], function (ratio) {
                                    return parseFloat(ratio);
                                });
                                var averageWatchingRatio = (_.reduce(watchingRatiosArray, function (memo, num) {
                                    return memo + num;
                                }, 0)) /watchingRatiosArray.length;
                                lessonsStats[lessonId]['stats']['VideoSituation']['watchVideo']['average_watching_ratio'] = averageWatchingRatio + '%';
                            }

                        }
                    }
                }

                //------------------计算Quiz Situation 中的 finishProblemSet---------------------
                if (_.keys(userStatsAboutThisLesson.QuizSituation).length > 0) {

                    if (lessonsStats[lessonId]['stats']['QuizSituation'] == undefined) {
                        lessonsStats[lessonId]['stats']['QuizSituation'] = {};
                    }

                    if (_.keys(userStatsAboutThisLesson.QuizSituation.finishProblemSet).length > 0) {
                        if (_.keys(userStatsAboutThisLesson.LessonSituation.finishLesson).length > 0) { // 只统计完成过本课的学生的习题正确率 -- From PRD

                            if (lessonsStats[lessonId]['stats']['QuizSituation']['finishProblemSet'] == undefined) {
                                lessonsStats[lessonId]['stats']['QuizSituation']['finishProblemSet'] = {};
                                lessonsStats[lessonId]['stats']['QuizSituation']['finishProblemSet']['average_correct_ratio'] = "";
                                lessonsStats[lessonId]['stats']['QuizSituation']['finishProblemSet']['details'] = {};
                            }

                            var lastFinishTime = Utils.findLastTime(userStatsAboutThisLesson.QuizSituation.finishProblemSet); // 统计每个人最近一次做本题集的正确率
                            lessonsStats[lessonId]['compute_helper']['quiz_compute_helper'].push(_.find(userStatsAboutThisLesson.QuizSituation.finishProblemSet, function (value, timeKey) {
                                return timeKey == lastFinishTime.toString();
                            }).correct_ratio);

                            lessonsStats[lessonId]['stats']['QuizSituation']['finishProblemSet']['details'][user._id] =
                                userStatsAboutThisLesson.QuizSituation.finishProblemSet;

                            if (userIndexOfLessonStats == (eachLessonStats.length - 1)) { //循环的最后一个,开始计算平均率
                                var correctRatiosArray = _.map(lessonsStats[lessonId]['compute_helper']['quiz_compute_helper'], function (ratio) {
                                    return (function(ratio){
                                        console.log(important,ratio);
                                        var fractionArray = ratio.split('/'); // 分数数组：index-0 : 分子 ； index-1 : 分母
                                        return (parseInt(fractionArray[0])/parseInt(fractionArray[1]))*100;
                                    })(ratio);
                                });
                                var averageCorrectRatio = (_.reduce(correctRatiosArray, function (memo, num) {
                                    return memo + num;
                                }, 0)) / correctRatiosArray.length;
                                lessonsStats[lessonId]['stats']['QuizSituation']['finishProblemSet']['average_correct_ratio'] = averageCorrectRatio+ '%';
                            }
                        }
                    }
                }


                //------------------计算Quiz Situation 中的 answerProblem------------------------
                if (_.keys(userStatsAboutThisLesson.QuizSituation).length > 0) {

                    if (_.keys(userStatsAboutThisLesson.QuizSituation.answerProblem).length > 0) {

                    }

                }

            });
            delete lessonsStats[lessonId]['compute_helper'];
        });

        _.each(lessonsStats, function (eachLessonStats) {
            ret.stats.lessons.push({lesson: eachLessonStats.lesson, stats: eachLessonStats.stats});
        });
        // console.log("------------------------|||||||||||||||||||||||||||||||-----------------------",JSON.stringify(ret));
        cb(null, chapterId, ret);
    };

    _.each(data, function (chapterifyStats, chapterId) {
        var chapterDistinguishTask = function (stats, cb) {
            chapterAlgorithm(stats, chapterId, function (err, chapterId, ret) {
                cb(err, chapterId, ret);
            });
        };
        taskGroups.push(
            function (callback) {
                chapterDistinguishTask(chapterifyStats, function (err, chapterId, ret) {
                    if (!err) {
                        console.log("Chapter " + chapterId + " is done!");
                        callback(err, ret);
                    }
                });
            }
        );
    });

    async.parallelLimit(taskGroups, 10, function (err, result) {
        if (!err) {
            callback(null, result);

            //console.log(JSON.stringify(result));
        } else {
            callback(undefined, err);
        }
    });
};

exports.restore = function () {

};

var Utils = {

    findFirstTime: function (obj) {
        var timeTableArray = _.map(obj, function (value, timeKey) {
            return parseInt(timeKey);
        });

        return _.min(timeTableArray);
    },

    findLastTime: function (obj) {
        var timeTableArray = _.map(obj, function (value, timeKey) {
            return parseInt(timeKey);
        });

        return _.max(timeTableArray);
    }
};