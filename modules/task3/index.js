/*
exports.create = function(key,data,originData,callback){
    console.log('-------计算个人做题状况-------');

    var problemSituation = {};

    _.each(data,function(track){
        if(problemSituation[track.problemId] == null){
            problemSituation[track.problemId] = {};
            problemSituation[track.problemId]['correct_count'] = 0;
            problemSituation[track.problemId]['wrong_count'] = 0;
        }

        if(track.correct === 'true'){
            problemSituation[track.problemId]['correct_count'] ++;
        }else{
            problemSituation[track.problemId]['wrong_count'] ++;
        }
    });

    var stats = {"user":data[0].user,"stats":[{"chapterId":"c01","problemStats":problemSituation}]};
    console.log(stats);
    callback(null, stats);
};
*/

/*exports.create = function(key,data,originData,callback){
    console.log('-------计算个人做题状况-------');

    var problemSituation = {};

    _.each(data,function(track){
        if(track.course!=undefined){
            if(problemSituation[track.course.ProblemId] == null){
                problemSituation[track.course.ProblemId] = {};
                problemSituation[track.course.ProblemId]['correct_count'] = 0;
                problemSituation[track.course.ProblemId]['wrong_count'] = 0;
            }


            if(track.data.properties.Correct){
                problemSituation[track.course.ProblemId]['correct_count'] ++;
            }else{
                problemSituation[track.course.ProblemId]['wrong_count'] ++;
            }
        }
    });

    var stats = {"user":data[0].user,"stats":[{"chapterId":"c01","problemStats":problemSituation}]};
    console.log(JSON.stringify(stats));
    callback(null, stats);
};*/

exports.create = function(key,data,originData,callback){
    console.log('-------计算个人做题状况-------');

    var lessons = [];
    var lessonSituation = {};
    _.each(data,function(track){
        if(track.course!=undefined){
            if(lessonSituation[track.course.LessonId] == null){
                lessonSituation[track.course.LessonId] = {};
            }

            lessonSituation[track.course.LessonId].lesson = {};
            lessonSituation[track.course.LessonId].stats = {};
            lessonSituation[track.course.LessonId].lesson['lessonId'] = track.course.LessonId;
            lessonSituation[track.course.LessonId].lesson['lessonTitle'] = track.course.LessonTitle;
            if(lessonSituation[track.course.LessonId].stats[track.course.ProblemId] == null){
                lessonSituation[track.course.LessonId].stats[track.course.ProblemId] = {};
                lessonSituation[track.course.LessonId].stats[track.course.ProblemId]['correct_count'] = 0;
                lessonSituation[track.course.LessonId].stats[track.course.ProblemId]['wrong_count'] = 0;
            }
            if(track.data.properties.Correct){
                lessonSituation[track.course.LessonId].stats[track.course.ProblemId]['correct_count'] ++;
            }else{
                lessonSituation[track.course.LessonId].stats[track.course.ProblemId]['wrong_count'] ++;
            }
        }
    });
    
    for (var key in lessonSituation){
        lessons.push(lessonSituation[key]);
    }

    var stats = {"user":data[0].user,"stats":{"chapter":{"chapterId":data[1].course.ChapterId,"chapterTitle":data[1].course.ChapterTitle},lessons:lessons}};
    console.log(JSON.stringify(stats));
    callback(null, stats);
};

exports.restore = function(){

};
