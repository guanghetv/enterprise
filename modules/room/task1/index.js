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
            lessonsStats[lessonId]['compute_helper']['problem_compute_helper'] = {};

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
                *               "startProblemSet" : {
                *                    "1408267302796" : {
                *                        "is_review" : "false",
                *                        "size" : "7",
                *                        "blood" : "1",
                *                        "is_random" : "undefined"
                *                    }
                *                }
                *
                *               "answerProblem": {
                *                    "538fe48f76cb8a0068b1403b": {
                *                        "1407988724150": {
                *                            "is_review": "false",
                *                            "is_correct": false,
                *                            "answer": "$3$",
                *                            "check_explanation_or_not": false
                *                        }
                *                    }
                *                }
                *
                *                "finishProblemSet" : {
                *                    "1408267338459" : {
                *                        "is_review" : "false",
                *                        "correct_ratio" : "7/7",
                *                        "wrong_ratio" : "0/7"
                *                    }
                *                },
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

                if (userStatsAboutThisLesson.LessonSituation != undefined &&
                    _.keys(userStatsAboutThisLesson.LessonSituation.finishLesson).length > 0) {
                    lessonsStats[lessonId]['stats']['LessonSituation']['finishLesson']['finish_count']++;
                    lessonsStats[lessonId]['stats']['LessonSituation']['finishLesson']['details'][user._id] =
                        userStatsAboutThisLesson.LessonSituation.finishLesson;
                }

                //------------------计算VideoSituation 中的 watchVideo--------------------------
                if (lessonObject.lessonType === 'learn' && _.keys(userStatsAboutThisLesson.VideoSituation).length > 0) {
                    if (lessonsStats[lessonId]['stats']['VideoSituation'] == undefined) {
                        lessonsStats[lessonId]['stats']['VideoSituation'] = {};
                    }

                    if (_.keys(userStatsAboutThisLesson.VideoSituation.watchVideo).length > 0) {
                        if (userStatsAboutThisLesson.LessonSituation != undefined && _.keys(userStatsAboutThisLesson.LessonSituation.finishLesson).length > 0) { // 只统计完成过本课的学生的视频观看率 -- From PRD

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
                        }
                    }
                }

                //------------------计算Quiz Situation 中的 finishProblemSet---------------------
                if (_.keys(userStatsAboutThisLesson.QuizSituation).length > 0) {

                    if (lessonsStats[lessonId]['stats']['QuizSituation'] == undefined) {
                        lessonsStats[lessonId]['stats']['QuizSituation'] = {};
                    }

                    if (_.keys(userStatsAboutThisLesson.QuizSituation.finishProblemSet).length > 0) {
                        if (userStatsAboutThisLesson.LessonSituation!=undefined && _.keys(userStatsAboutThisLesson.LessonSituation.finishLesson).length > 0) { // 只统计完成过本课的学生的习题正确率 -- From PRD

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
                        }
                    }
                }

                //------------------计算Quiz Situation 中的 answerProblem------------------------
                if (_.keys(userStatsAboutThisLesson.QuizSituation).length > 0) {
                    if (userStatsAboutThisLesson.LessonSituation!=undefined && _.keys(userStatsAboutThisLesson.LessonSituation.finishLesson).length > 0) { // 只统计完成过本课的学生的题目正确率 -- From PRD
                        if (_.keys(userStatsAboutThisLesson.QuizSituation.startProblemSet).length > 0) { //TODO: 可能冗余判断
                            if (_.keys(userStatsAboutThisLesson.QuizSituation.finishProblemSet).length > 0) {  //TODO: 可能冗余判断
                                if (_.keys(userStatsAboutThisLesson.QuizSituation.answerProblem).length > 0) { //TODO: 可能冗余判断

                                    if (lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'] == undefined) {
                                        lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'] = {};
                                    }

                                    var computeRecentDoProblemSetTime = function () {
                                        var recentDoProblemSetTime = {};

                                        var startProblemSetTimeArray = _.keys(userStatsAboutThisLesson.QuizSituation.startProblemSet);
                                        var finishProblemSetTimeArray = _.keys(userStatsAboutThisLesson.QuizSituation.finishProblemSet);

                                        var sortedStartProblemSetTimeArray = _.sortBy(startProblemSetTimeArray, function (time) {
                                            return parseInt(time);
                                        });
                                        var sortedFinishProblemSetTimeArray = _.sortBy(finishProblemSetTimeArray, function (time) {
                                            return parseInt(time);
                                        });

                                        //console.log(important + 'start:', sortedStartProblemSetTimeArray);
                                        //console.log(important + 'finish:', sortedFinishProblemSetTimeArray);

                                        var lastStartProblemSetTime = _.last(sortedStartProblemSetTimeArray);
                                        var lastFinishProblemSetTime = _.last(sortedFinishProblemSetTimeArray);
                                        var sortedStartTimeCount = sortedStartProblemSetTimeArray.length;
                                        var sortedFinishTimeCount = sortedFinishProblemSetTimeArray.length;

                                        /**
                                         * 事件流末尾可能出现的情况模型
                                         *
                                         * start - finish （正常记录）
                                         * finish - start （正常记录）
                                         * finish - finish （非正常记录）
                                         * start - start （非正常记录）
                                         *
                                         * */

                                        if (lastStartProblemSetTime < lastFinishProblemSetTime) { // start - finish
                                            if (sortedFinishTimeCount >= 2) {
                                                if (lastStartProblemSetTime > sortedFinishProblemSetTimeArray[sortedFinishTimeCount - 2]) {  // finish - start - finish
                                                    // 最后一段计为一次有效做题区间
                                                    recentDoProblemSetTime.startTime = lastStartProblemSetTime;
                                                    recentDoProblemSetTime.finishTime = lastFinishProblemSetTime;

                                                } else if (lastStartProblemSetTime < sortedFinishProblemSetTimeArray[sortedFinishTimeCount - 2]) { //  start - finish - finish
                                                    // 最后两个 finish 间计为有效区间
                                                    recentDoProblemSetTime.startTime = sortedFinishProblemSetTimeArray[sortedFinishTimeCount - 2]; // 从上次结束算开始
                                                    recentDoProblemSetTime.finishTime = lastFinishProblemSetTime;
                                                } else {
                                                    console.error("1.请找 tracks 管理员，为什么总是出现同一题集完成时间跟开始时间相等的问题！！");
                                                }
                                            } else {
                                                recentDoProblemSetTime.startTime = lastStartProblemSetTime;
                                                recentDoProblemSetTime.finishTime = lastFinishProblemSetTime;
                                            }

                                        } else if (lastStartProblemSetTime > lastFinishProblemSetTime) {  // finish - start
                                            if (sortedStartTimeCount >= 2) {
                                                if (sortedStartProblemSetTimeArray[sortedStartTimeCount - 2] < lastFinishProblemSetTime) { // start - finish - start

                                                    recentDoProblemSetTime.startTime = sortedStartProblemSetTimeArray[sortedStartTimeCount - 2];
                                                    recentDoProblemSetTime.finishTime = lastFinishProblemSetTime;

                                                } else if (sortedStartProblemSetTimeArray[sortedStartTimeCount - 2] > lastFinishProblemSetTime) { //finish - start - start ...
                                                    var newArray = sortedStartProblemSetTimeArray;
                                                    var isError = false;
                                                    do {
                                                        if (newArray.length >= 2) {
                                                            newArray.splice(1)
                                                        } else {
                                                            console.error("统计题集的过程中发现源数据严重错误");
                                                            isError = true;
                                                            break;
                                                        }
                                                    } while (_.last(newArray) > lastFinishProblemSetTime);
                                                    if (!isError) {
                                                        // start - finish - start - start....
                                                        recentDoProblemSetTime.startTime = _.last(newArray);
                                                        recentDoProblemSetTime.finishTime = lastFinishProblemSetTime;
                                                    }
                                                } else {
                                                    console.error("2.请找 tracks 管理员，为什么总是出现同一题集完成时间跟开始时间相等的问题！！");
                                                }
                                            } else {
                                                console.error("统计题集的过程中发现源数据严重错误");
                                            }
                                        } else {
                                            console.error("3.请找 tracks 管理员，为什么总是出现同一题集完成时间跟开始时间相等的问题！！");
                                        }
                                        return recentDoProblemSetTime;
                                    };

                                    var recentDoProblemSetTime = computeRecentDoProblemSetTime(); // 最近一次做该题集且完成的时间区间

                                    _.each(userStatsAboutThisLesson.QuizSituation.answerProblem, function (problemDetails, problemId) {
                                        if (lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'][problemId] == undefined) {
                                            lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'][problemId] = {};
                                            lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'][problemId]['average_correct_ratio'] = {};
                                            lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'][problemId]['average_answer_ratio'] = {};
                                            lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'][problemId]['details'] = {};

                                            // 因为题库 pool_count 的缘故，每个人可能做过不同的题，所以平均率需要考虑做过这道题的人数的统计;
                                            lessonsStats[lessonId]['compute_helper']['problem_compute_helper'][problemId] = {};
                                            lessonsStats[lessonId]['compute_helper']['problem_compute_helper'][problemId]['user_count'] = 0;
                                            lessonsStats[lessonId]['compute_helper']['problem_compute_helper'][problemId]['correct_count'] = 0;
                                            lessonsStats[lessonId]['compute_helper']['problem_compute_helper'][problemId]['answer_situation'] = {};

                                        }

                                        var answerProblemTimeArray = _.map(_.keys(problemDetails), function (time) {
                                            return parseInt(time);
                                        });

                                        var recentAnswerProblemTimeArray = _.filter(answerProblemTimeArray, function (time) {
                                            return time > recentDoProblemSetTime.startTime && time < recentDoProblemSetTime.finishTime;
                                        });  // 最近一次做该题集时，本题的所有作答

                                        var recentFirstAnswerTime = _.min(recentAnswerProblemTimeArray); // “其中”的首次作答的时间
                                        var recentFirstAnswerSituation = problemDetails[recentFirstAnswerTime];


                                        _.each(recentFirstAnswerSituation.answers_ids, function (answerId) {
                                            if (lessonsStats[lessonId]['compute_helper']['problem_compute_helper'][problemId]['answer_situation'][answerId] == undefined) {
                                                lessonsStats[lessonId]['compute_helper']['problem_compute_helper'][problemId]['answer_situation'][answerId] = 0;
                                            }
                                            lessonsStats[lessonId]['compute_helper']['problem_compute_helper'][problemId]['answer_situation'][answerId]++; //选过该选项的人数
                                        });

                                        lessonsStats[lessonId]['compute_helper']['problem_compute_helper'][problemId]['user_count']++; // 做过该题的人数
                                        if (recentFirstAnswerSituation.is_correct) {
                                            lessonsStats[lessonId]['compute_helper']['problem_compute_helper'][problemId]['correct_count']++;
                                        }

                                        lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'][problemId]['details'][user._id] = problemDetails;
                                    });
                                }
                            }


                        }
                    }
                }

            });



            //----------  循环的末尾，以下是用来计算各种平均率 ---------------------

            /**
             *
             * 主视频首次平均视频观看时长率 = 所有完成过本课的人第一次观看该视频的播放率之和 / 这个群体的人数 * 100%
             *
             * */
            if (eachLessonStats[0].lesson.lesson.lessonType === 'learn') {
                var watchingRatiosArray = _.map(lessonsStats[lessonId]['compute_helper']['video_compute_helper'], function (ratio) {
                    return parseFloat(ratio);
                });
                var averageWatchingRatio = (_.reduce(watchingRatiosArray, function (memo, num) {
                    return memo + num;
                }, 0)) / watchingRatiosArray.length;
                lessonsStats[lessonId]['stats']['VideoSituation']['watchVideo']['average_watching_ratio'] = Math.round(averageWatchingRatio).toString() + '%';
            }

            /**
             *
             * 习题集最近一次平均正确率 = 所有完成过本课的人最近一次做本题集的正确率之和 / 这个群体的人数  * 100%
             *
             * */
            if(lessonsStats[lessonId]['compute_helper']['quiz_compute_helper'].length > 0){
                var correctRatiosArray = _.map(lessonsStats[lessonId]['compute_helper']['quiz_compute_helper'], function (ratio) {
                    return (function (ratio) {
                        //console.log(important,ratio);
                        var fractionArray = ratio.split('/'); // 分数数组：index-0 : 分子 ； index-1 : 分母
                        return (parseInt(fractionArray[0]) / parseInt(fractionArray[1])) * 100;
                    })(ratio);
                });
                var averageCorrectRatio = (_.reduce(correctRatiosArray, function (memo, num) {
                    return memo + num;
                }, 0)) / correctRatiosArray.length;
                lessonsStats[lessonId]['stats']['QuizSituation']['finishProblemSet']['average_correct_ratio'] = Math.round(averageCorrectRatio).toString() + '%';

            }

            /**
             *
             *   {
                     *     '538fe48f76cb8a0068b1403b': { user_count: 1, correct_count: 1 },
                     *     '538ff83076cb8a0068b14071': { user_count: 1, correct_count: 1 },
                     *     '5398173e7c92662841b021f7': { user_count: 1, correct_count: 1 },
                     *     '538feaea76cb8a0068b14043': { user_count: 1, correct_count: 1 },
                     *     '538fed5f76cb8a0068b14068': { user_count: 1, correct_count: 1 },
                     *     '538fed5f76cb8a0068b14067': { user_count: 1, correct_count: 1,answer_situation:
                                                                                              { '538ff83076cb8a0068b14074': {user},
                                                                                                '538ff83076cb8a0068b14072': [Object],
                                                                                                '538ff83076cb8a0068b14075': [Object] }
                     *     },
                     *     '539159da81d531b15a4b7b5b': { user_count: 1, correct_count: 1 }
                     *   }
             *
             * */


            /**
             *
             * 某道题最近一次做题（最近一次做题集且题集finish）首次作答的平均正确率 =
             *
             *                      所有完成过本课的人最近一次做本题首次作答的正确率之和 / 这个群体的人数  * 100%
             *
             * 某个选项在这次作答中的平均被选择率 = 选择该选项的人数 / 这个群体中做过该题的群体的总人数 * 100%
             *
             * */
            if(_.keys(lessonsStats[lessonId]['compute_helper']['problem_compute_helper']).length >0){
                _.each(lessonsStats[lessonId]['compute_helper']['problem_compute_helper'], function (problemDetail, problemId) {
                    var averageCorrectRatio = problemDetail.correct_count / problemDetail.user_count * 100;

                    lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'][problemId]['average_correct_ratio'] =
                        Math.round(averageCorrectRatio).toString() + '%';

                    _.each(problemDetail.answer_situation,function(countOfChoose,answerId){
                        var averageAnswerRatio = countOfChoose/problemDetail.user_count * 100;
                        lessonsStats[lessonId]['stats']['QuizSituation']['answerProblem'][problemId]['average_answer_ratio'][answerId]=
                            Math.round(averageAnswerRatio).toString()+'%';
                    });
                });
            }

            //---------------------- 计算结束，删除 compute_helper -----------------------
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

    async.parallelLimit(taskGroups, 3, function (err, result) {
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